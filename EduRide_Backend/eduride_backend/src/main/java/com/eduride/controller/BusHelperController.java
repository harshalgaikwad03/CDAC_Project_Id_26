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
import org.springframework.web.bind.annotation.PutMapping; // ✅ ADDED
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eduride.dto.BusHelperEditDTO;
import com.eduride.dto.BusHelperResponseDTO;

import com.eduride.dto.HelperStudentStatusDTO;
import com.eduride.dto.StatusRequest;
import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.BusHelper;
import com.eduride.entity.Student;
import com.eduride.entity.StudentStatus;
import com.eduride.service.BusHelperService;
import com.eduride.service.StudentService;
import com.eduride.service.StudentStatusService;

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
    public BusHelperResponseDTO myProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return service.getProfile(email);
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

    // ✅ KEEP THIS
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('HELPER')")
    public BusHelper getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // ✅ EDIT FETCH (DTO)
    @GetMapping("/{id}/edit")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public BusHelperEditDTO getHelperForEdit(@PathVariable Long id) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        BusHelperEditDTO dto = service.getForEdit(id);

        Long loggedSchoolId = service.getSchoolIdByEmail(email);
        if (!dto.getSchoolId().equals(loggedSchoolId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return dto;
    }

    // ───────── ✅ FIXED: UPDATE API ─────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public void updateHelper(
            @PathVariable Long id,
            @RequestBody BusHelperEditDTO dto
    ) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        // 🔒 Get logged-in school id
        Long loggedSchoolId = service.getSchoolIdByEmail(email);

        // 🔒 Get existing helper's school id (DB truth)
        BusHelper existing = service.findById(id);

        if (!existing.getSchool().getId().equals(loggedSchoolId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        service.updateHelper(id, dto);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ───────── LIST BY SCHOOL (DTO SAFE) ─────────
    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<BusHelperResponseDTO> getBySchool(@PathVariable Long schoolId) {
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


    // ───────── STUDENT STATUS APIs ─────────

    @GetMapping("/students")
    @PreAuthorize("hasRole('HELPER')")
    public List<HelperStudentStatusDTO> getMyStudentsWithStatus() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return studentService.findStudentsByHelperEmail(email)
                .stream()
                .map(student -> {

                    HelperStudentStatusDTO dto = new HelperStudentStatusDTO();
                    dto.setId(student.getId());
                    dto.setName(student.getName());
                    dto.setRollNo(student.getRollNo());
                    dto.setClassName(student.getClassName());
                    dto.setPhone(student.getPhone());
                    dto.setBusNumber(
                        student.getAssignedBus() != null
                            ? student.getAssignedBus().getBusNumber()
                            : null
                    );

                    // 🔹 Fetch TODAY status from DB
                    StudentStatus todayStatus =
                    	    studentStatusService.findTodayStatus(student.getId());

                    	dto.setPickupStatus(
                    	    todayStatus != null
                    	        ? todayStatus.getPickupStatus()
                    	        : "PENDING"
                    	);


                    return dto;
                })
                .toList();
    }



    @PostMapping("/student-status")
    @PreAuthorize("hasRole('HELPER')")
    public void markStudentStatus(@RequestBody StatusRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        BusHelper helper = service.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("Bus Helper not found"));

        studentStatusService.upsertTodayStatus(
                request.getStudentId(),
                request.getPickupStatus(),
                helper
        );
    }

}
