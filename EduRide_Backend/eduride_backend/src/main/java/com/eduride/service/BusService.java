package com.eduride.service;

import com.eduride.dto.BusDTO;

import com.eduride.entity.*;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class BusService {

    private final BusRepository busRepository;
    private final AgencyRepository agencyRepository;
    private final DriverRepository driverRepository;
    private final SchoolRepository schoolRepository;
    private final BusHelperRepository helperRepository;

    public BusService(
            BusRepository busRepository,
            AgencyRepository agencyRepository,
            DriverRepository driverRepository,
            SchoolRepository schoolRepository,
            BusHelperRepository helperRepository
    ) {
        this.busRepository = busRepository;
        this.agencyRepository = agencyRepository;
        this.driverRepository = driverRepository;
        this.schoolRepository = schoolRepository;
        this.helperRepository = helperRepository;
    }

    // ─────────────────────────────────────────────
    // CREATE BUS
    // ─────────────────────────────────────────────
    public Bus create(Bus bus) {
        Agency agency = getLoggedInAgency();
        bus.setAgency(agency);

        assignSchool(bus, agency);
        assignDriver(bus, agency, null);

        return busRepository.save(bus);
    }

    // ─────────────────────────────────────────────
    // UPDATE BUS (✔ FULLY FIXED)
    // ─────────────────────────────────────────────
    public Bus update(Long id, Bus updated) {
        Bus existing = findById(id);
        Agency agency = getLoggedInAgency();

        existing.setBusNumber(updated.getBusNumber());
        existing.setCapacity(updated.getCapacity());

        // 🔥 CRITICAL: copy incoming relations
        existing.setSchool(updated.getSchool());
        existing.setDriver(updated.getDriver());

        // Validate & assign safely
        assignSchool(existing, agency);
        assignDriver(existing, agency, existing.getId());

        return busRepository.save(existing);
    }

    // ─────────────────────────────────────────────
    // HELPER METHODS
    // ─────────────────────────────────────────────
    private Agency getLoggedInAgency() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        Agency agency = agencyRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.FORBIDDEN, "Agency not found"));

        if (!agency.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Agency inactive");
        }
        return agency;
    }

    private void assignSchool(Bus bus, Agency agency) {
        if (bus.getSchool() != null && bus.getSchool().getId() != null) {
            School school = schoolRepository.findById(bus.getSchool().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("School not found"));

            if (!school.getAgency().getId().equals(agency.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "School does not belong to your agency"
                );
            }
            bus.setSchool(school);
        } else {
            bus.setSchool(null);
        }
    }

    private void assignDriver(Bus bus, Agency agency, Long currentBusId) {
        if (bus.getDriver() != null && bus.getDriver().getId() != null) {
            Long driverId = bus.getDriver().getId();

            Driver driver = driverRepository.findById(driverId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Driver not found"));

            if (!driver.getAgency().getId().equals(agency.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Driver does not belong to your agency"
                );
            }

            busRepository.findByDriverId(driverId).ifPresent(otherBus -> {
                if (currentBusId == null || !otherBus.getId().equals(currentBusId)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Driver already assigned to another bus"
                    );
                }
            });

            bus.setDriver(driver);
        } else {
            bus.setDriver(null);
        }
    }

    // ─────────────────────────────────────────────
    // OTHER METHODS
    // ─────────────────────────────────────────────
    public Bus assignHelper(Long busId, Long helperId) {
        Bus bus = findById(busId);
        BusHelper helper = helperRepository.findById(helperId)
                .orElseThrow(() -> new ResourceNotFoundException("Helper not found"));
        helper.setAssignedBus(bus);
        helperRepository.save(helper);
        return bus;
    }

    public List<Bus> findAll() {
        return busRepository.findAll();
    }

    public Bus findById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
    }

    public List<Bus> findByAgency(Long agencyId) {
        return busRepository.findByAgencyId(agencyId);
    }

    public List<Bus> findBySchool(Long schoolId) {
        return busRepository.findBySchoolId(schoolId);
    }

    public Bus getBusByDriver(Long driverId) {
        return busRepository.findByDriverId(driverId).orElse(null);
    }

    public void delete(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bus not found");
        }
        busRepository.deleteById(id);
    }
    
    public List<Bus> findByLoggedInSchool(String email) {
        School school = schoolRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("School not found"));
        return busRepository.findBySchoolId(school.getId());
    }

    
    public List<BusDTO> getBusesBySchool(Long schoolId) {
        return busRepository.findBySchoolId(schoolId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private BusDTO toDTO(Bus bus) {

    	Long schoolId = null;
        String schoolName = null;
        if (bus.getSchool() != null) {
        	schoolId = bus.getSchool().getId();
            schoolName = bus.getSchool().getName();
        }
        
        Long driverId = null;
        String driverName = null;
        String driverPhone = null;
        if (bus.getDriver() != null) {
        	driverId = bus.getDriver().getId();
            driverName = bus.getDriver().getName();
            driverPhone = bus.getDriver().getPhone();
        }

        String helperName = null;
        String helperPhone = null;

        BusHelper helper = helperRepository
                .findByAssignedBusId(bus.getId())
                .stream()
                .findFirst()
                .orElse(null);

        if (helper != null) {
            helperName = helper.getName();
            helperPhone = helper.getPhone();
        }

        return new BusDTO(
                bus.getId(),
                bus.getBusNumber(),
                bus.getCapacity(),
                schoolId,
                schoolName,
                driverId,
                driverName,
                driverPhone,
                helperName,
                helperPhone
        );
    }
    
    
    public List<BusDTO> findByAgencyDTO(Long agencyId) {
        return busRepository.findByAgencyId(agencyId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

 // ✅ SINGLE BUS DTO (FOR EDIT PAGE)
    public BusDTO getBusDTOById(Long busId) {
        Bus bus = findById(busId);
        return toDTO(bus);
    }



}
