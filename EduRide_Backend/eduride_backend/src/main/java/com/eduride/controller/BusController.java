package com.eduride.controller;

import com.eduride.entity.Agency;
import com.eduride.entity.Bus;
import com.eduride.entity.School;
import com.eduride.service.AgencyService;
import com.eduride.service.BusService;
import com.eduride.service.SchoolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:5173")
public class BusController {

    private final BusService service;
    private final AgencyService agencyService;
    private final SchoolService schoolService;

    public BusController(BusService service, AgencyService agencyService, SchoolService schoolService) {
        this.service = service;
        this.agencyService = agencyService;
        this.schoolService = schoolService;
    }

    @PostMapping
    @PreAuthorize("hasRole('AGENCY')")
    public Bus create(@RequestBody Bus bus) {
        return service.create(bus);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Bus> getAll() {
        System.out.println("BUS CONTROLLER DEBUG: getAll() CALLED - THIS IS PUBLIC");
        return service.findAll();
    }

    // === NEW METHOD: ASSIGN HELPER ===
    @PutMapping("/{busId}/assign-helper/{helperId}")
    @PreAuthorize("hasRole('SCHOOL') or hasRole('AGENCY')")
    public ResponseEntity<Bus> assignHelper(@PathVariable Long busId, @PathVariable Long helperId) {
        Bus updatedBus = service.assignHelper(busId, helperId);
        return ResponseEntity.ok(updatedBus);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public Bus getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public Bus update(@PathVariable Long id, @RequestBody Bus bus) {
        return service.update(id, bus);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/agency/{agencyId}")
    @PreAuthorize("hasRole('AGENCY')")
    public List<Bus> getByAgency(@PathVariable Long agencyId) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Agency currentAgency = agencyService.findByEmail(currentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Agency not found"));
        if (!currentAgency.getId().equals(agencyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own buses");
        }
        return service.findByAgency(agencyId);
    }

    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<Bus> getBySchool(@PathVariable Long schoolId) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if ("ROLE_SCHOOL".equals(role)) {
            School currentSchool = schoolService.findByEmail(currentEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "School not found"));
            if (!currentSchool.getId().equals(schoolId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view buses assigned to your own school");
            }
        }
        return service.findBySchool(schoolId);
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasRole('DRIVER') or hasRole('AGENCY')")
    public ResponseEntity<Bus> getBusByDriver(@PathVariable Long driverId) {
        Bus bus = service.getBusByDriver(driverId);
        return ResponseEntity.ok(bus);
    }
}