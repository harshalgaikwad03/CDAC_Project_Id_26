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

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public Student getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found for email: " + email));
    }
    
    
    

    @PostMapping("/signup")
    public Student create(@RequestBody Student student) {
        return service.create(student);
    }

    @GetMapping
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<Student> getAll() {
        return service.findAll();
    }

    // ✅ NEW: ONLY STUDENTS OF LOGGED-IN SCHOOL
    @GetMapping("/school/me")
    @PreAuthorize("hasRole('SCHOOL')")
    public List<Student> getStudentsOfLoggedInSchool() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return service.findByLoggedInSchool(email);
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

    @GetMapping("/school/{schoolId}")
    @PreAuthorize("hasRole('AGENCY')")
    public List<Student> getBySchool(@PathVariable Long schoolId) {
        return service.findBySchool(schoolId);
    }

    @GetMapping("/bus/{busId}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<Student> getByBus(@PathVariable Long busId) {
        return service.findByBus(busId);
    }
}
