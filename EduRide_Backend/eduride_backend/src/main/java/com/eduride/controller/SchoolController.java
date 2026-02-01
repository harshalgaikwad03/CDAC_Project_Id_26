package com.eduride.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eduride.dto.SchoolProfileDTO;
import com.eduride.dto.dashboard.SchoolDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.entity.School;
import com.eduride.service.AgencyService;
import com.eduride.service.SchoolService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolController {

    private final SchoolService service;
    private final AgencyService agencyService;

    public SchoolController(SchoolService service, AgencyService agencyService) {
        this.service = service;
        this.agencyService = agencyService;
    }

    /**
     * Public signup endpoint - anyone can register a school
     */
    
//    @GetMapping("/me")
//    @PreAuthorize("hasRole('SCHOOL')")
//    public School getMyProfile() {
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        return service.findByEmail(email)
//        		.orElseThrow(() -> new ResponseStatusException(
//                        HttpStatus.NOT_FOUND,
//                        "Student profile not found for email: " + email));
//    }

    
    @GetMapping("/me")
    @PreAuthorize("hasRole('SCHOOL')")
    public SchoolProfileDTO getMyProfile() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        School school = service.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "School profile not found"));

        if (school.getAgency() != null) {
            return new SchoolProfileDTO(
                    school.getId(),
                    school.getName(),
                    school.getPhone(),
                    school.getEmail(),
                    school.getAddress(),
                    new SchoolProfileDTO.AgencyDTO(
                            school.getAgency().getId(),
                            school.getAgency().getName()
                    )
            );
        }

        return new SchoolProfileDTO(
                school.getId(),
                school.getName(),
                school.getPhone(),
                school.getEmail(),
                school.getAddress(),
                null
        );
    }


    
    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<School> create(@Valid @RequestBody School school) {
        School created = service.create(school);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Public GET - used for dropdowns in various signup forms
     * (bus-helper, driver, etc.)
     */
    @GetMapping
    @PreAuthorize("permitAll()")
    public List<School> getAll() {
        return service.findAll();
    }

    /**
     * Get single school by ID - protected
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public School getById(@PathVariable Long id) {
        return service.findById(id);
    }

    /**
     * Update school - protected
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public School update(@PathVariable Long id, @Valid @RequestBody School school) {
        return service.update(id, school);
    }


    /**
     * Delete school - only AGENCY
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    /**
     * Get schools under a specific agency - only the agency itself
     */
    @GetMapping("/agency/{agencyId}")
    @PreAuthorize("hasRole('AGENCY')")
    public List<School> getByAgency(@PathVariable Long agencyId) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Agency current = agencyService.findByEmail(currentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Agency not found"));

        if (!current.getId().equals(agencyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own schools");
        }

        return service.findByAgency(agencyId);
    }

    /**
     * School dashboard summary - only for logged-in school user
     */
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('SCHOOL')")
    public ResponseEntity<SchoolDashboardSummaryDTO> getDashboardSummary() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        SchoolDashboardSummaryDTO summary = service.getSchoolDashboardSummary(currentEmail);
        
        return ResponseEntity.ok(summary);
    }
    
    
}