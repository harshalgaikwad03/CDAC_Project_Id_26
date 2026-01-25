package com.eduride.controller;

import com.eduride.entity.Student;
import com.eduride.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    /**
     * Returns the currently authenticated student's full profile.
     * Uses SecurityContext to get email from JWT → no need for ID in URL.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public Student getCurrentStudent() {
        // Get the authenticated user's email from JWT
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return service.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found for email: " + email));
    }

    // ────────────────────────────────────────────────
    //                  SIGNUP (PUBLIC)
    // ────────────────────────────────────────────────
    @PostMapping("/signup")
    public Student create(@RequestBody Student student) {
        return service.create(student);
    }

    // ────────────────────────────────────────────────
    //                  ADMIN / AGENCY / SCHOOL
    // ────────────────────────────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<Student> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
    public Student getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
    public Student update(@PathVariable Long id, @RequestBody Student student) {
        return service.update(id, student);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ────────────────────────────────────────────────
    //                  FILTERED QUERIES
    // ────────────────────────────────────────────────
    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
    public List<Student> getBySchool(@PathVariable Long schoolId) {
        return service.findBySchool(schoolId);
    }

    @GetMapping("/bus/{busId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
    public List<Student> getByBus(@PathVariable Long busId) {
        return service.findByBus(busId);
    }
}