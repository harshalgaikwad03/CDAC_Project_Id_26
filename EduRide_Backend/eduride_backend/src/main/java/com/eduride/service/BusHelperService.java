package com.eduride.service;

import com.eduride.dto.BusHelperUpdateDTO;
import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.Bus;
import com.eduride.entity.BusHelper;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusHelperRepository;
import com.eduride.repository.BusRepository;
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
    private final BusRepository busRepository;

    public BusHelperService(
            BusHelperRepository repo,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository,
            BusRepository busRepository
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
                .orElseThrow(() ->
                        new ResourceNotFoundException("BusHelper not found with id: " + id));
    }

    // ✅ FIXED UPDATE (ONLY THIS PART CHANGED)
    public BusHelper update(Long id, BusHelperUpdateDTO dto) {
        BusHelper existing = findById(id);

        if (dto.getName() != null)
            existing.setName(dto.getName());

        if (dto.getPhone() != null)
            existing.setPhone(dto.getPhone());

        if (dto.getAssignedBusId() != null) {
            Bus bus = busRepository.findById(dto.getAssignedBusId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Bus not found: " + dto.getAssignedBusId()));
            existing.setAssignedBus(bus);
        } else {
            existing.setAssignedBus(null);
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

    public BusHelperDashboardSummaryDTO getBusHelperDashboardSummary(String email) {
        BusHelper helper = findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bus Helper not found"));

        String busNumber = helper.getAssignedBus() != null
                ? helper.getAssignedBus().getBusNumber()
                : "Not Assigned";

        long totalStudents = helper.getAssignedBus() != null
                ? studentRepository.findByAssignedBusId(helper.getAssignedBus().getId()).size()
                : 0;

        return new BusHelperDashboardSummaryDTO(
                busNumber,
                "Home → School",
                (int) totalStudents,
                (int) (totalStudents * 0.85)
        );
    }
}
