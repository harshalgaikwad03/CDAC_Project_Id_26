package com.eduride.controller;

import com.eduride.entity.Agency;
import com.eduride.entity.Driver;
import com.eduride.service.AgencyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = "http://localhost:5173")
public class AgencyController {

    private final AgencyService service;

    public AgencyController(AgencyService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Agency create(@RequestBody Agency agency) {
        return service.create(agency);
    }

    // READ ALL
    @GetMapping
    public List<Agency> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Agency getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Agency update(@PathVariable Long id, @RequestBody Agency agency) {
        return service.update(id, agency);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    
 // LOGIN
    @PostMapping("/login")
    public Agency login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return service.login(email, password);
    }
}
