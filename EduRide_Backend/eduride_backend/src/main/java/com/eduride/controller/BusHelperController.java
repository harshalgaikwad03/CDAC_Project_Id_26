package com.eduride.controller;

import com.eduride.entity.BusHelper;
import com.eduride.entity.Driver;
import com.eduride.service.BusHelperService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bus-helpers")
@CrossOrigin(origins = "http://localhost:5173")
public class BusHelperController {

    private final BusHelperService service;

    public BusHelperController(BusHelperService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public BusHelper create(@RequestBody BusHelper helper) {
        return service.create(helper);
    }

    // READ ALL
    @GetMapping
    public List<BusHelper> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public BusHelper getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public BusHelper update(@PathVariable Long id, @RequestBody BusHelper helper) {
        return service.update(id, helper);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    
    @GetMapping("/school/{schoolId}")
    public List<BusHelper> getBySchool(@PathVariable Long schoolId) {
        return service.findBySchool(schoolId);
    }

    @GetMapping("/bus/{busId}")
    public List<BusHelper> getByBus(@PathVariable Long busId) {
        return service.findByBus(busId);
    }
    
 // LOGIN
    @PostMapping("/login")
    public BusHelper login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return service.login(email, password);
    }
}
