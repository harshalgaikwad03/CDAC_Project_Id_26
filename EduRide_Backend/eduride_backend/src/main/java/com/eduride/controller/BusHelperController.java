package com.eduride.controller;

import com.eduride.dto.BusHelperUpdateDTO;
import com.eduride.dto.StatusRequest;
import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.BusHelper;
import com.eduride.entity.Student;
import com.eduride.entity.StudentStatus;
import com.eduride.service.BusHelperService;
import com.eduride.service.StudentService;
import com.eduride.service.StudentStatusService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/helpers")
@CrossOrigin(origins = "http://localhost:5173")
public class BusHelperController {

    private final BusHelperService service;
    private final StudentService studentService;
    private final StudentStatusService studentStatusService;

    public BusHelperController(
            BusHelperService service,
            StudentService studentService,
            StudentStatusService studentStatusService
    ) {
        this.service = service;
        this.studentService = studentService;
        this.studentStatusService = studentStatusService;
    }

    // ───────── EXISTING APIs (UNCHANGED) ─────────

    @GetMapping("/me")
    @PreAuthorize("hasRole('HELPER')")
    public BusHelper getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.findByEmail(email)
        		.orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "BusHelper profile not found for email: " + email));
    }

    
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
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public BusHelper update(
            @PathVariable Long id,
            @RequestBody BusHelperUpdateDTO dto
    ) {
        return service.update(id, dto);
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

    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('HELPER')")
    public BusHelperDashboardSummaryDTO getBusHelperDashboardSummary() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return service.getBusHelperDashboardSummary(email);
    }

    // ───────── ✅ NEW APIs FOR STUDENT STATUS ─────────

    // ✅ Students under logged-in helper
    @GetMapping("/students")
    @PreAuthorize("hasRole('HELPER')")
    public List<Student> getMyStudents() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return studentService.findStudentsByHelperEmail(email);
    }

    // ✅ Create / Update today student status
    @PostMapping("/student-status")
    @PreAuthorize("hasRole('HELPER')")
    public StudentStatus markStudentStatus(@RequestBody StatusRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        BusHelper helper = service.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Bus Helper not found for email: " + email));

        return studentStatusService.upsertTodayStatus(
                request.getStudentId(),
                request.getPickupStatus(),
                helper
        );
    }

}
