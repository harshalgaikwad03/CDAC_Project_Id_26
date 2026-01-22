package com.eduride.controller;

import com.eduride.entity.Bus;
import com.eduride.service.BusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:5173")
public class BusController {

    private final BusService service;

    public BusController(BusService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Bus create(@RequestBody Bus bus) {
        return service.create(bus);
    }

    // READ ALL
    @GetMapping
    public List<Bus> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Bus getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Bus update(@PathVariable Long id, @RequestBody Bus bus) {
        return service.update(id, bus);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    
    @GetMapping("/school/{schoolId}")
    public List<Bus> getBySchool(@PathVariable Long schoolId) {
        return service.findBySchool(schoolId);
    }

    @GetMapping("/agency/{agencyId}")
    public List<Bus> getByAgency(@PathVariable Long agencyId) {
        return service.findByAgency(agencyId);
    }
    
    
}
