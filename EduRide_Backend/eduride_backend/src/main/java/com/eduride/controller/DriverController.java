package com.eduride.controller;

import com.eduride.dto.DriverDTO;
import com.eduride.dto.dashboard.DriverDashboardSummaryDTO;
import com.eduride.entity.Driver;
import com.eduride.service.DriverService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {

    private final DriverService service;

    public DriverController(DriverService service) {
        this.service = service;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('DRIVER')")
    public Driver getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Driver profile not found for email: " + email));
    }

    // ─── Existing unchanged ───
    @PostMapping("/signup")
    public Driver create(@RequestBody Driver driver) {
        return service.create(driver);
    }

    @GetMapping
    @PreAuthorize("hasRole('AGENCY')")
    public List<Driver> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('DRIVER')")
    public Driver getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('DRIVER')")
    public Driver update(@PathVariable Long id, @RequestBody Driver driver) {
        return service.update(id, driver);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/agency/{agencyId}")
    @PreAuthorize("hasRole('AGENCY')")
    public List<Driver> getByAgency(@PathVariable Long agencyId) {
        return service.findByAgency(agencyId);
    }

    // ─── Driver Dashboard ───
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('DRIVER')")
    public DriverDashboardSummaryDTO getSummary() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return service.getSummary(email);
    }
    
    @GetMapping("/agency/me")
    @PreAuthorize("hasRole('AGENCY')")
    public List<DriverDTO> getMyDrivers() {
        return service.getDriversForLoggedInAgency();
    }


    @GetMapping("/agency/{agencyId}/unassigned")
    @PreAuthorize("hasRole('AGENCY')")
    public List<Driver> getUnassignedDrivers(@PathVariable Long agencyId) {
        return service.findUnassignedDriversByAgency(agencyId);
    }
}
