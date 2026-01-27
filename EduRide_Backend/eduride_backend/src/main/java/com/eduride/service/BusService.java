package com.eduride.service;

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
    // CREATE BUS (School + Driver optional)
    // ─────────────────────────────────────────────
    public Bus create(Bus bus) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Agency agency = agencyRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.FORBIDDEN, "Agency not found")
                );

        if (!agency.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Agency account inactive");
        }

        // 🔐 Enforce agency from token
        bus.setAgency(agency);

        // ───────────── SCHOOL ASSIGNMENT ─────────────
        if (bus.getSchool() != null && bus.getSchool().getId() != null) {

            School school = schoolRepository.findById(bus.getSchool().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("School not found")
                    );

            if (!school.getAgency().getId().equals(agency.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "School does not belong to your agency"
                );
            }

            // ✅ Attach managed entity
            bus.setSchool(school);
        } else {
            bus.setSchool(null);
        }

        // ───────────── DRIVER ASSIGNMENT ─────────────
        if (bus.getDriver() != null && bus.getDriver().getId() != null) {

            Long driverId = bus.getDriver().getId();

            Driver driver = driverRepository.findById(driverId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Driver not found")
                    );

            if (!driver.getAgency().getId().equals(agency.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Driver does not belong to your agency"
                );
            }

            // 🚫 Prevent OneToOne violation
            if (busRepository.findByDriverId(driverId).isPresent()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Driver already assigned to another bus"
                );
            }

            // ✅ Attach managed entity
            bus.setDriver(driver);
        } else {
            bus.setDriver(null);
        }

        // ✅ Persist
        return busRepository.save(bus);
    }

    // ─────────────────────────────────────────────
    // ASSIGN HELPER
    // ─────────────────────────────────────────────
    public Bus assignHelper(Long busId, Long helperId) {

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bus not found")
                );

        BusHelper helper = helperRepository.findById(helperId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Helper not found")
                );

        helper.setAssignedBus(bus);
        helperRepository.save(helper);

        return bus;
    }

    // ─────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────
    public List<Bus> findAll() {
        return busRepository.findAll();
    }

    public Bus findById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bus not found")
                );
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

    // ─────────────────────────────────────────────
    // UPDATE (No driver change here)
    // ─────────────────────────────────────────────
    public Bus update(Long id, Bus updated) {
        Bus existing = findById(id);

        existing.setBusNumber(updated.getBusNumber());
        existing.setCapacity(updated.getCapacity());
        existing.setSchool(updated.getSchool());

        return busRepository.save(existing);
    }

    // ─────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────
    public void delete(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bus not found");
        }
        busRepository.deleteById(id);
    }
}
