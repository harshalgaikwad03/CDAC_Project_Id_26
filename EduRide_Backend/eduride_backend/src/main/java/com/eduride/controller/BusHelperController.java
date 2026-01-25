package com.eduride.controller;

import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.BusHelper;
import com.eduride.service.BusHelperService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helpers")
@CrossOrigin(origins = "http://localhost:5173")
public class BusHelperController {

    private final BusHelperService service;

    public BusHelperController(BusHelperService service) {
        this.service = service;
    }

    // ─── Existing unchanged ───
    @PostMapping("/signup")
    public BusHelper create(@RequestBody BusHelper helper) {
        return service.create(helper);
    }

    @GetMapping
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<BusHelper> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('HELPER')")
    public BusHelper getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('HELPER')")
    public BusHelper update(@PathVariable Long id, @RequestBody BusHelper helper) {
        return service.update(id, helper);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<BusHelper> getBySchool(@PathVariable Long schoolId) {
        return service.findBySchool(schoolId);
    }

    @GetMapping("/bus/{busId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('HELPER')")
    public List<BusHelper> getByBus(@PathVariable Long busId) {
        return service.findByBus(busId);
    }

    // ─── NEW: Dashboard summary for Bus Helper ───
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('HELPER')")
    public BusHelperDashboardSummaryDTO getBusHelperDashboardSummary() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getBusHelperDashboardSummary(currentEmail);
    }
}