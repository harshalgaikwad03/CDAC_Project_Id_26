package com.eduride.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // <--- Added Import
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

import com.eduride.dto.StudentDTO;
import com.eduride.dto.StudentSignupDTO;
import com.eduride.entity.Student;
import com.eduride.mapper.StudentMapper;
import com.eduride.service.StudentService;

import jakarta.validation.Valid;

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
    public StudentDTO getCurrentStudent() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Student student = service.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found"
                ));

        return StudentMapper.toDTO(student);
    }

    
    
    

    @PostMapping("/signup")
    public StudentDTO signup(@Valid @RequestBody StudentSignupDTO dto) {
        Student student = service.createFromSignup(dto);
        return StudentMapper.toDTO(student);
    }




    @GetMapping
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL')")
    public List<Student> getAll() {
        return service.findAll();
    }

    // ONLY STUDENTS OF LOGGED-IN SCHOOL
    @GetMapping("/school/me")
    @PreAuthorize("hasRole('SCHOOL')")
    public List<StudentDTO> getStudentsOfLoggedInSchool() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return service.findDTOsByLoggedInSchool(email);
    }

    
    

//    @GetMapping("/{id}")
//    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
//    public Student getById(@PathVariable Long id) {
//        return service.findById(id);
//    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
    public StudentDTO update(@PathVariable Long id, @RequestBody Student student) {
        return service.update(id, student);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
    public StudentDTO getById(@PathVariable Long id) {
        return StudentMapper.toDTO(service.findById(id));
    }

    

//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('AGENCY') or hasRole('SCHOOL') or hasRole('STUDENT')")
//    public Student update(@PathVariable Long id, @RequestBody Student student) {
//        return service.update(id, student);
//    }

    // ✅ NEW: ENDPOINT TO ACTIVATE PASS (Called after Payment)
    @PutMapping("/{id}/activate-pass")
    @PreAuthorize("hasRole('STUDENT') or hasRole('SCHOOL')") 
    public ResponseEntity<?> activatePass(@PathVariable Long id) {
        service.activatePass(id);
        return ResponseEntity.ok("Pass Activated Successfully");
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