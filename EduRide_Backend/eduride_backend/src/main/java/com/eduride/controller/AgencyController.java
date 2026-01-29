package com.eduride.controller;

import com.eduride.dto.dashboard.AgencyDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.service.AgencyService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = "http://localhost:5173")
public class AgencyController {

    private final AgencyService service;

    public AgencyController(AgencyService service) {
        this.service = service;
    }
    
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('AGENCY')")
    public Agency getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.findByEmail(email)
        		.orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Agency profile not found for email: " + email));
    }


    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public Agency create(@RequestBody Agency agency) {
        return service.create(agency);
    }

    // FIXED: Public for dropdown during signup
    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Agency> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public Agency getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public Agency update(@PathVariable Long id, @RequestBody Agency agency) {
        return service.update(id, agency);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('AGENCY')")
    public AgencyDashboardSummaryDTO getAgencyDashboardSummary() {
        return service.getAgencyDashboardSummary();
    }
}