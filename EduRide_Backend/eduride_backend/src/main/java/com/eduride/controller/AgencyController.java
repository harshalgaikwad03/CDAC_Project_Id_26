package com.eduride.controller;

import com.eduride.entity.Agency;
import com.eduride.service.AgencyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
public class AgencyController {

    private final AgencyService agencyService;

    public AgencyController(AgencyService agencyService) {
        this.agencyService = agencyService;
    }

    @PostMapping
    public Agency create(@RequestBody Agency agency) {
        return agencyService.save(agency);
    }

    @GetMapping
    public List<Agency> getAll() {
        return agencyService.findAll();
    }

    @GetMapping("/{id}")
    public Agency getById(@PathVariable Long id) {
        return agencyService.findById(id);
    }

    @PutMapping("/{id}")
    public Agency update(@PathVariable Long id, @RequestBody Agency agency) {
        agency.setId(id);
        return agencyService.save(agency);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        agencyService.delete(id);
    }
}
