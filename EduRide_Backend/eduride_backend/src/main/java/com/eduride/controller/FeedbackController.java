package com.eduride.controller;

import com.eduride.entity.Feedback;
import com.eduride.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Feedback create(@RequestBody Feedback feedback) {
        return service.create(feedback);
    }

    // READ ALL
    @GetMapping
    public List<Feedback> getAll() {
        return service.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Feedback getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Feedback update(@PathVariable Long id,
                           @RequestBody Feedback feedback) {
        return service.update(id, feedback);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    
    @GetMapping("/bus/{busId}")
    public List<Feedback> getByBus(@PathVariable Long busId) {
        return service.findByBus(busId);
    }

    @GetMapping("/driver/{driverId}")
    public List<Feedback> getByDriver(@PathVariable Long driverId) {
        return service.findByDriver(driverId);
    }

    @GetMapping("/helper/{helperId}")
    public List<Feedback> getByHelper(@PathVariable Long helperId) {
        return service.findByHelper(helperId);
    }
}
