package com.eduride.controller;

import com.eduride.dto.dashboard.SchoolDashboardSummaryDTO;
import com.eduride.entity.School;
import com.eduride.service.SchoolService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolController {

    private final SchoolService service;

    public SchoolController(SchoolService service) {
        this.service = service;
    }

    // ─── Existing endpoints unchanged ───
    @PostMapping("/signup")
    public School create(@RequestBody School school) {
        return service.create(school);
    }

    @GetMapping
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<School> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public School getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public School update(@PathVariable Long id, @RequestBody School school) {
        return service.update(id, school);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/agency/{agencyId}")
    @PreAuthorize("hasRole('AGENCY')")
    public List<School> getByAgency(@PathVariable Long agencyId) {
        return service.findByAgency(agencyId);
    }

    // ─── NEW: Dashboard summary for School ───
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('SCHOOL')")
    public SchoolDashboardSummaryDTO getSchoolDashboardSummary() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getSchoolDashboardSummary(currentEmail);
    }
}