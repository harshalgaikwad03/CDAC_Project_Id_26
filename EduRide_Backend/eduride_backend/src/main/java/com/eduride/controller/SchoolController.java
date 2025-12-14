package com.eduride.controller;

import com.eduride.entity.School;
import com.eduride.service.SchoolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @PostMapping
    public School create(@RequestBody School school) {
        return schoolService.save(school);
    }

    @GetMapping
    public List<School> getAll() {
        return schoolService.findAll();
    }

    @GetMapping("/{id}")
    public School getById(@PathVariable Long id) {
        return schoolService.findById(id);
    }

    @PutMapping("/{id}")
    public School update(@PathVariable Long id, @RequestBody School school) {
        school.setId(id);
        return schoolService.save(school);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        schoolService.delete(id);
    }
}
