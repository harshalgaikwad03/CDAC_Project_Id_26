package com.eduride.controller;

import com.eduride.entity.Driver;
import com.eduride.entity.School;
import com.eduride.service.SchoolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolController {

    private final SchoolService service;

    public SchoolController(SchoolService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public School create(@RequestBody School school) {
        return service.create(school);
    }

    // READ ALL
    @GetMapping
    public List<School> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public School getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public School update(@PathVariable Long id, @RequestBody School school) {
        return service.update(id, school);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

   
    @GetMapping("/agency/{agencyId}")
    public List<School> getByAgency(@PathVariable Long agencyId) {
        return service.findByAgency(agencyId);
    }
 // LOGIN
    @PostMapping("/login")
    public School login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return service.login(email, password);
    }
}
