package com.eduride.service;

import com.eduride.entity.Feedback;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Feedback create(Feedback feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        return repo.save(feedback);
    }

    // READ ALL
    public List<Feedback> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Feedback findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
    }

    // UPDATE
    public Feedback update(Long id, Feedback updated) {
        Feedback existing = findById(id);

        existing.setFeedbackText(updated.getFeedbackText());
        existing.setRating(updated.getRating());
        existing.setStudent(updated.getStudent());
        existing.setBus(updated.getBus());
        existing.setDriver(updated.getDriver());
        existing.setBusHelper(updated.getBusHelper());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // REQUIRED APIs
    public List<Feedback> findByBus(Long busId) {
        return repo.findByBusId(busId);
    }

    public List<Feedback> findByDriver(Long driverId) {
        return repo.findByDriverId(driverId);
    }

    public List<Feedback> findByHelper(Long helperId) {
        return repo.findByBusHelper_Id(helperId);
    }
}
