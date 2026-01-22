package com.eduride.controller;

import com.eduride.entity.Driver;
import com.eduride.entity.Student;
import com.eduride.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Student create(@RequestBody Student student) {
        return service.create(student);
    }

    // READ ALL
    @GetMapping
    public List<Student> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student student) {
        return service.update(id, student);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    
    @GetMapping("/school/{schoolId}")
    public List<Student> getBySchool(@PathVariable Long schoolId) {
        return service.findBySchool(schoolId);
    }

    @GetMapping("/bus/{busId}")
    public List<Student> getByBus(@PathVariable Long busId) {
        return service.findByBus(busId);
    }
    
 // LOGIN
    @PostMapping("/login")
    public Student login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return service.login(email, password);
    }
}
