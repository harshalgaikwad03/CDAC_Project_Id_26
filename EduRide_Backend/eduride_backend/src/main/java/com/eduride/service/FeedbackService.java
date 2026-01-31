package com.eduride.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.eduride.entity.*;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.*;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;
    private final StudentRepository studentRepo;
    private final DriverRepository driverRepo;
    private final BusHelperRepository helperRepo;
    private final SchoolRepository schoolRepo;
    private final AgencyRepository agencyRepo;

    public FeedbackService(
            FeedbackRepository repo,
            StudentRepository studentRepo,
            DriverRepository driverRepo,
            BusHelperRepository helperRepo,
            SchoolRepository schoolRepo,
            AgencyRepository agencyRepo
    ) {
        this.repo = repo;
        this.studentRepo = studentRepo;
        this.driverRepo = driverRepo;
        this.helperRepo = helperRepo;
        this.schoolRepo = schoolRepo;
        this.agencyRepo = agencyRepo;
    }

    // ✅ CREATE SYSTEM FEEDBACK
    public void create(Feedback feedback) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        String role = auth.getAuthorities().iterator().next().getAuthority();

        feedback.setCreatedAt(LocalDateTime.now());

        switch (role) {
            case "ROLE_STUDENT" ->
                    feedback.setStudent(studentRepo.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("Student not found")));

            case "ROLE_DRIVER" ->
                    feedback.setDriver(driverRepo.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("Driver not found")));

            case "ROLE_HELPER" ->
                    feedback.setBusHelper(helperRepo.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("Helper not found")));

            case "ROLE_SCHOOL" ->
                    feedback.setSchool(schoolRepo.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("School not found")));

            case "ROLE_AGENCY" ->
                    feedback.setAgency(agencyRepo.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("Agency not found")));

            default -> throw new RuntimeException("Unsupported role");
        }

        repo.save(feedback);
    }

    public List<Feedback> findAll() {
        return repo.findAll();
    }

    public Feedback findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
    }
}
