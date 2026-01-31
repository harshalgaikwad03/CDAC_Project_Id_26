package com.eduride.service;

import com.eduride.dto.dashboard.AgencyDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.AgencyRepository;
import com.eduride.repository.BusRepository;
import com.eduride.repository.DriverRepository;
import com.eduride.repository.SchoolRepository;
import com.eduride.repository.StudentRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgencyService {

    private final AgencyRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;

    public AgencyService(
            AgencyRepository repo,
            PasswordEncoder passwordEncoder,
            BusRepository busRepository,
            DriverRepository driverRepository,
            StudentRepository studentRepository,
            SchoolRepository schoolRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.studentRepository = studentRepository;
        this.schoolRepository = schoolRepository;
    }

    // ────────────────────────────────────────────────
    // Existing methods – unchanged
    // ────────────────────────────────────────────────
    public Agency create(Agency agency) {
        agency.setRole(Role.AGENCY);
        agency.setPassword(passwordEncoder.encode(agency.getPassword()));
        return repo.save(agency);
    }

    public List<Agency> findAll() {
        return repo.findAll();
    }

    public Agency findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found"));
    }

    public Agency update(Long id, Agency updated) {
        Agency existing = findById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());

        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Optional<Agency> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // ────────────────────────────────────────────────
    // NEW: Agency-wide dashboard summary
    // ────────────────────────────────────────────────
    public AgencyDashboardSummaryDTO getAgencyDashboardSummary() {

        // 🔐 Get logged-in agency email
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Agency agency = repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found"));

        Long agencyId = agency.getId();

        long totalBuses = busRepository.countByAgencyId(agencyId);
        long totalDrivers = driverRepository.countByAgencyId(agencyId);
        long totalStudents = studentRepository.countByAgencyId(agencyId);
        long totalSchools = schoolRepository.countByAgencyId(agencyId);

        return new AgencyDashboardSummaryDTO(
                totalBuses,
                totalDrivers,
                totalStudents,
                totalSchools
        );
    }
}