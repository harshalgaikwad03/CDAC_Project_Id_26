package com.eduride.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.eduride.dto.DriverDTO;
import com.eduride.dto.dashboard.DriverDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.entity.Bus;
import com.eduride.entity.Driver;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.AgencyRepository;
import com.eduride.repository.BusRepository;
import com.eduride.repository.DriverRepository;
import com.eduride.repository.StudentRepository;
import com.eduride.repository.StudentStatusRepository;

@Service
public class DriverService {

    private final DriverRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final BusRepository busRepository;
    private final StudentRepository studentRepository;
    private final StudentStatusRepository statusRepo;
    private final AgencyRepository agencyRepository;

    public DriverService(
            DriverRepository repo,
            PasswordEncoder passwordEncoder,
            BusRepository busRepository,
            StudentRepository studentRepository,
            StudentStatusRepository statusRepo, 
            AgencyRepository agencyRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.busRepository = busRepository;
        this.studentRepository = studentRepository;
        this.statusRepo = statusRepo;
		this.agencyRepository = agencyRepository;
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

        // ✅ Preserve existing agency
        if (updated.getAgency() != null) {
            existing.setAgency(updated.getAgency());
        }

        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        return repo.save(existing);
    }


    public void delete(Long id) {

        Driver driver = repo.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Driver not found"
                        )
                );

        // 🔥 CHECK: Is driver assigned to a bus?
        boolean assignedToBus = busRepository.findByDriverId(driver.getId()).isPresent();

        if (assignedToBus) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete driver. Driver is assigned to a bus."
            );
        }

        repo.delete(driver);
    }


    public List<Driver> findByAgency(Long agencyId) {
        return repo.findByAgencyId(agencyId);
    }

    public Optional<Driver> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    
    public List<DriverDTO> getDriversByAgency(Long agencyId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        Agency agency = agencyRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Agency not found"));

        if (!agency.getId().equals(agencyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return repo.findByAgencyId(agencyId)
                .stream()
                .map(driver -> {

                    Bus bus = busRepository
                            .findByDriverIdWithSchool(driver.getId())
                            .orElse(null);

                    return new DriverDTO(
                            driver.getId(),
                            driver.getName(),
                            driver.getPhone(),
                            driver.getLicenseNumber(),
                            bus != null ? bus.getId() : null,
                            bus != null ? bus.getBusNumber() : null,
                            bus != null && bus.getSchool() != null ? bus.getSchool().getId() : null,
                            bus != null && bus.getSchool() != null ? bus.getSchool().getName() : null
                    );
                })
                .toList();
    }

    public List<DriverDTO> getDriversForLoggedInAgency() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        Agency agency = agencyRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));

        return getDriversByAgency(agency.getId());
    }
    // ────────────────────────────────────────────────
    // NEW: Driver-specific dashboard summary
    // ────────────────────────────────────────────────
 // DriverService.java

    public DriverDashboardSummaryDTO getSummary(String email) {

        Driver driver = repo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Driver not found"
                ));

        Bus bus = busRepository.findByDriverId(driver.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "No bus assigned to this driver"
                ));

        Long busId = bus.getId();
        LocalDate today = LocalDate.now();

        int totalStudents =
                (int) studentRepository.countByAssignedBusId(busId);

        int pickedHomeToSchool =
                statusRepo.countByStudent_AssignedBus_IdAndDateAndPickupStatus(
                        busId, today, "PICKED"
                );

        int droppedSchoolToHome =
                statusRepo.countByStudent_AssignedBus_IdAndDateAndPickupStatus(
                        busId, today, "DROPPED"
                );

        return new DriverDashboardSummaryDTO(
                bus.getBusNumber(),
                totalStudents,
                pickedHomeToSchool,
                droppedSchoolToHome
        );
    }


    
    public List<Driver> findUnassignedDriversByAgency(Long agencyId) {
        return repo.findUnassignedDriversByAgency(agencyId);
    }
}