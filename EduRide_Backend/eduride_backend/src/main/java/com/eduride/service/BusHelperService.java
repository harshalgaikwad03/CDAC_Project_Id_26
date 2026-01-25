package com.eduride.service;

import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.BusHelper;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusHelperRepository;
import com.eduride.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusHelperService {

    private final BusHelperRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;

    public BusHelperService(
            BusHelperRepository repo,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
    }

    // ────────────────────────────────────────────────
    // Existing methods – unchanged
    // ────────────────────────────────────────────────
    public BusHelper create(BusHelper helper) {
        helper.setRole(Role.HELPER);
        helper.setPassword(passwordEncoder.encode(helper.getPassword()));
        return repo.save(helper);
    }

    public List<BusHelper> findAll() {
        return repo.findAll();
    }

    public BusHelper findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusHelper not found"));
    }

    public BusHelper update(Long id, BusHelper updated) {
        BusHelper existing = findById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setSchool(updated.getSchool());
        existing.setAssignedBus(updated.getAssignedBus());

        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }
        return repo.save(existing);
    }

    public void delete(Long id) {
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

    // ────────────────────────────────────────────────
    // NEW: Bus Helper dashboard summary
    // ────────────────────────────────────────────────
    public BusHelperDashboardSummaryDTO getBusHelperDashboardSummary(String currentEmail) {
        BusHelper helper = findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Bus Helper not found"));

        String busNumber = (helper.getAssignedBus() != null)
                ? helper.getAssignedBus().getBusNumber()
                : "Not Assigned";

        String routeName = "Home → School";  // ← placeholder

        long totalStudents = (helper.getAssignedBus() != null)
                ? studentRepository.findByAssignedBusId(helper.getAssignedBus().getId()).size()
                : 0;

        // Dummy checked-in count (replace with real check-in / status logic later)
        int checkedInCount = (int) (totalStudents * 0.85);  // 85% dummy

        return new BusHelperDashboardSummaryDTO(
                busNumber,
                routeName,
                (int) totalStudents,
                checkedInCount
        );
    }
}