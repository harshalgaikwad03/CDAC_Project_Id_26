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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eduride.dto.HelperStudentStatusDTO;
import com.eduride.dto.StudentStatusDTO;
import com.eduride.entity.Student;
import com.eduride.entity.StudentStatus;
import com.eduride.service.StudentService;
import com.eduride.service.StudentStatusService;

@RestController
@RequestMapping("/api/student-status")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentStatusController {

    private final StudentStatusService statusService;
    private final StudentService studentService;

    public StudentStatusController(StudentStatusService statusService, StudentService studentService) {
        this.statusService = statusService;
        this.studentService = studentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL')")
    public StudentStatus create(@RequestBody StudentStatus status) {
        return statusService.create(status);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL')")
    public List<StudentStatus> getAll() {
        return statusService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL','STUDENT')")
    public StudentStatus getById(@PathVariable Long id) {
        return statusService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL')")
    public StudentStatus update(@PathVariable Long id, @RequestBody StudentStatus status) {
        return statusService.update(id, status);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL')")
    public void delete(@PathVariable Long id) {
        statusService.delete(id);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL','STUDENT')")
    public List<StudentStatus> getByStudent(@PathVariable Long studentId) {
        checkStudentAccess(studentId);
        return statusService.findByStudent(studentId);
    }

    // FIXED: Proper Optional handling with type-safe return
//    @GetMapping("/today/{studentId}")
//    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL','STUDENT','HELPER')")
//    public ResponseEntity<StudentStatus> getTodayStatus(@PathVariable Long studentId) {
//
//        return statusService.findTodayStatusForStudent(studentId)
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.noContent().build());
//    }
    
    @GetMapping("/today/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentStatusDTO> getTodayStatus(
            @PathVariable Long studentId
    ) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Student student = studentService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // 🔐 SECURITY CHECK: student can only access their own status
        if (!student.getId().equals(studentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return statusService
                .getTodayStatus(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }


    

    // Get all student statuses for a school on today's date
    @GetMapping("/school/{schoolId}/today")
    @PreAuthorize("hasRole('SCHOOL')")
    public List<HelperStudentStatusDTO> getTodayBySchool(
            @PathVariable Long schoolId
    ) {
        return statusService.findTodayBySchoolDTO(schoolId);
    }


    private void checkStudentAccess(Long studentId) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if ("ROLE_STUDENT".equals(role)) {
            Student student = studentService.findById(studentId);
            if (student == null || !currentEmail.equals(student.getEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You are not authorized to view this student's data");
            }
        }
        // AGENCY and SCHOOL can view any
    }
}