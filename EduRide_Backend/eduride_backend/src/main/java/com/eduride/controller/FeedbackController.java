package com.eduride.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.eduride.entity.Feedback;
import com.eduride.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public void create(@RequestBody Feedback feedback) {
        service.create(feedback);
    }

    @GetMapping
    public List<Feedback> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Feedback getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
