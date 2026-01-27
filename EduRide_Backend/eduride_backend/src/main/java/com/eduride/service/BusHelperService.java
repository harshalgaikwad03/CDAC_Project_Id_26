package com.eduride.service;

import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.Bus;
import com.eduride.entity.BusHelper;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusHelperRepository;
import com.eduride.repository.BusRepository;          // ← ADDED
import com.eduride.repository.StudentRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusHelperService {

    private final BusHelperRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final BusRepository busRepository;  // ← ADDED to resolve bus by ID

    public BusHelperService(
            BusHelperRepository repo,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository,
            BusRepository busRepository  // ← inject this
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.busRepository = busRepository;
    }

    public BusHelper create(BusHelper helper) {
        helper.setRole(Role.HELPER);
        if (helper.getPassword() != null && !helper.getPassword().isBlank()) {
            helper.setPassword(passwordEncoder.encode(helper.getPassword()));
        }
        return repo.save(helper);
    }

    public List<BusHelper> findAll() {
        return repo.findAll();
    }

    public BusHelper findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusHelper not found with id: " + id));
    }

    public BusHelper update(Long id, BusHelper updated) {
        BusHelper existing = findById(id);

        // Optional: restrict to AGENCY or SCHOOL
        String currentRole = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_AGENCY".equals(currentRole) && !"ROLE_SCHOOL".equals(currentRole)) {
            throw new SecurityException("Only AGENCY or SCHOOL can update helpers");
        }

        // Preserve protected fields
        updated.setEmail(existing.getEmail());
        updated.setPassword(existing.getPassword());
        updated.setRole(existing.getRole());
        updated.setActive(existing.isActive());

        // Safe updates
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());

        // FIXED: Properly resolve Bus from ID
        if (updated.getAssignedBus() != null && updated.getAssignedBus().getId() != null) {
            Long busId = updated.getAssignedBus().getId();
            Bus bus = busRepository.findById(busId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid bus ID: " + busId));
            existing.setAssignedBus(bus);
        } else {
            existing.setAssignedBus(null); // allow unassigning
        }

        // School change – allow if sent
        if (updated.getSchool() != null) existing.setSchool(updated.getSchool());

        // Optional password update
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("BusHelper not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public List<BusHelper> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId);
    }

    public List<BusHelper> findByBus(Long busId) {
        return repo.findByAssignedBusId(busId);
    }

    public Optional<BusHelper> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public BusHelperDashboardSummaryDTO getBusHelperDashboardSummary(String currentEmail) {
        BusHelper helper = findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Bus Helper not found for email: " + currentEmail));

        String busNumber = (helper.getAssignedBus() != null)
                ? helper.getAssignedBus().getBusNumber()
                : "Not Assigned";

        String routeName = "Home → School"; // TODO: replace with real route name

        long totalStudents = (helper.getAssignedBus() != null)
                ? studentRepository.findByAssignedBusId(helper.getAssignedBus().getId()).size()
                : 0;

        // TODO: Replace dummy with real check-in count (e.g. from StudentStatus)
        int checkedInCount = (int) (totalStudents * 0.85);

        return new BusHelperDashboardSummaryDTO(
                busNumber,
                routeName,
                (int) totalStudents,
                checkedInCount
        );
    }
}