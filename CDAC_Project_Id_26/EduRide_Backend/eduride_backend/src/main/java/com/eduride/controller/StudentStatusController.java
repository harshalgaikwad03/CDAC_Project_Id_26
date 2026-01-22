package com.eduride.controller;

import com.eduride.entity.StudentStatus;
import com.eduride.service.StudentStatusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-status")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentStatusController {

    private final StudentStatusService service;

    public StudentStatusController(StudentStatusService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public StudentStatus create(@RequestBody StudentStatus status) {
        return service.create(status);
    }

    // READ ALL
    @GetMapping
    public List<StudentStatus> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public StudentStatus getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public StudentStatus update(@PathVariable Long id,
                                @RequestBody StudentStatus status) {
        return service.update(id, status);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    
    @GetMapping("/student/{studentId}")
    public List<StudentStatus> getByStudent(@PathVariable Long studentId) {
        return service.findByStudent(studentId);
    }
}
