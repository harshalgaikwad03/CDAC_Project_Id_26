package com.eduride.controller;

import com.eduride.dto.dashboard.AgencyDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.service.AgencyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = "http://localhost:5173")
public class AgencyController {

    private final AgencyService service;

    public AgencyController(AgencyService service) {
        this.service = service;
    }

    // ─── Your existing endpoints (unchanged) ───
    @PostMapping("/signup")
    public Agency create(@RequestBody Agency agency) {
        return service.create(agency);
    }

    @GetMapping
    @PreAuthorize("hasRole('AGENCY')")
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

    // ─── NEW: Dashboard summary for Agency ───
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('AGENCY')")
    public AgencyDashboardSummaryDTO getAgencyDashboardSummary() {
        return service.getAgencyDashboardSummary();
    }
}