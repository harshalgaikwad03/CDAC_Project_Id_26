package com.eduride.controller;

import com.eduride.entity.Student;
import com.eduride.entity.StudentStatus;
import com.eduride.service.StudentService;
import com.eduride.service.StudentStatusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

    @GetMapping("/today/{studentId}")
    @PreAuthorize("hasAnyRole('AGENCY','SCHOOL','STUDENT')")
    public ResponseEntity<StudentStatus> getTodayStatus(@PathVariable Long studentId) {
        checkStudentAccess(studentId);

        StudentStatus todayStatus = statusService.findTodayStatusForStudent(studentId);

        if (todayStatus == null) {
            return ResponseEntity.noContent().build(); // 204 No Content
            // Alternative: throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No status record found for today");
        }

        return ResponseEntity.ok(todayStatus);
    }

    // Security helper: Students can only access their own data
    private void checkStudentAccess(Long studentId) {
        String currentEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if ("ROLE_STUDENT".equals(role)) {
            Student student = studentService.findById(studentId);
            if (student == null || !currentEmail.equals(student.getEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this student's data");
            }
        }
        // AGENCY and SCHOOL roles can view any student
    }
}