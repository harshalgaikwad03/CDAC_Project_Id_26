package com.eduride.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eduride.dto.SchoolSummaryDTO;
import com.eduride.dto.dashboard.AgencyDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.service.AgencyService;
import com.eduride.service.SchoolService;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = "http://localhost:5173")
public class AgencyController {

    private final AgencyService service;
    private final SchoolService schoolService;

    public AgencyController(AgencyService service, SchoolService schoolService) {
        this.service = service;
		this.schoolService = schoolService;
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
    
    @GetMapping("/schools")
    @PreAuthorize("hasRole('AGENCY')")
    public List<SchoolSummaryDTO> getMySchools() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Agency agency = service.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Agency not found for email: " + email));

        return schoolService.getSchoolsForAgency(agency.getId());
    }
    
    @PutMapping("/schools/{schoolId}/release")
    @PreAuthorize("hasRole('AGENCY')")
    public void releaseSchool(@PathVariable Long schoolId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Agency agency = service.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Agency not found"));

        schoolService.releaseSchoolFromAgency(schoolId, agency.getId());
    }



}
