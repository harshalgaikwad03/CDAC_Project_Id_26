package com.eduride.controller;

import com.eduride.entity.Driver;
import com.eduride.service.DriverService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {

    private final DriverService service;

    public DriverController(DriverService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Driver create(@RequestBody Driver driver) {
        return service.create(driver);
    }

    // READ ALL
    @GetMapping
    public List<Driver> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Driver getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Driver update(@PathVariable Long id, @RequestBody Driver driver) {
        return service.update(id, driver);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    
    @GetMapping("/agency/{agencyId}")
    public List<Driver> getByAgency(@PathVariable Long agencyId) {
        return service.findByAgency(agencyId);
    }
    
    // LOGIN
    @PostMapping("/login")
    public Driver login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return service.login(email, password);
    }
}
