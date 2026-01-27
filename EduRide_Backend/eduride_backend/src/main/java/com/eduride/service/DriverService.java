package com.eduride.service;

import com.eduride.dto.dashboard.DriverDashboardSummaryDTO;
import com.eduride.entity.Bus;
import com.eduride.entity.Driver;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusRepository;
import com.eduride.repository.DriverRepository;
import com.eduride.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final BusRepository busRepository;
    private final StudentRepository studentRepository;

    public DriverService(
            DriverRepository repo,
            PasswordEncoder passwordEncoder,
            BusRepository busRepository,
            StudentRepository studentRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.busRepository = busRepository;
        this.studentRepository = studentRepository;
    }

    // ────────────────────────────────────────────────
    // Existing methods – unchanged
    // ────────────────────────────────────────────────
    public Driver create(Driver driver) {
        driver.setRole(Role.DRIVER);
        driver.setPassword(passwordEncoder.encode(driver.getPassword()));
        return repo.save(driver);
    }

    public List<Driver> findAll() {
        return repo.findAll();
    }

    public Driver findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
    }

    public Driver update(Long id, Driver updated) {
        Driver existing = findById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setLicenseNumber(updated.getLicenseNumber());
        existing.setAgency(updated.getAgency());

        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Driver> findByAgency(Long agencyId) {
        return repo.findByAgencyId(agencyId);
    }

    public Optional<Driver> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // ────────────────────────────────────────────────
    // NEW: Driver-specific dashboard summary
    // ────────────────────────────────────────────────
    public DriverDashboardSummaryDTO getDriverDashboardSummary(String currentEmail) {
        Driver driver = findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found for current user"));

        Bus assignedBus = busRepository.findByDriverId(driver.getId())
                .orElse(null);

        String busNumber = assignedBus != null ? assignedBus.getBusNumber() : "Not Assigned";
        String routeName = "School Route";  // ← placeholder (add Route entity later if needed)
        String status = "On Time";          // ← placeholder (can be dynamic later)

        long totalStudents = assignedBus != null
                ? studentRepository.findByAssignedBusId(assignedBus.getId()).size()
                : 0;

        // For now: dummy picked-up count (replace with real StudentStatus query later)
        int pickedUpCount = (int) (totalStudents * 0.75);  // 75% dummy

        return new DriverDashboardSummaryDTO(
                busNumber,
                routeName,
                status,
                (int) totalStudents,
                pickedUpCount
        );
    }
    
    public List<Driver> findUnassignedDriversByAgency(Long agencyId) {
        return repo.findUnassignedDriversByAgency(agencyId);
    }
}