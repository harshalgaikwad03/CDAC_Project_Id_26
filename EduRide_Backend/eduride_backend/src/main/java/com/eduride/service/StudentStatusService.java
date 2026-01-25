package com.eduride.service;

import com.eduride.entity.StudentStatus;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.StudentStatusRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StudentStatusService {

    private final StudentStatusRepository repo;

    public StudentStatusService(StudentStatusRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public StudentStatus create(StudentStatus status) {
        status.setDate(LocalDate.now());   // auto set current date
        return repo.save(status);
    }

    // READ ALL
    public List<StudentStatus> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public StudentStatus findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student status not found with id: " + id));
    }

    // UPDATE
    public StudentStatus update(Long id, StudentStatus updated) {
        StudentStatus existing = findById(id);

        existing.setPickupStatus(updated.getPickupStatus());
        existing.setStudent(updated.getStudent());
        existing.setUpdatedBy(updated.getUpdatedBy());
        // You might want to update date or other fields depending on your business rules

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Student status not found with id: " + id);
        }
        repo.deleteById(id);
    }

    // Find all statuses for a student
    public List<StudentStatus> findByStudent(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    // NEW: Get today's status for a student (returns null if not found)
    public StudentStatus findTodayStatusForStudent(Long studentId) {
        LocalDate today = LocalDate.now();
        Optional<StudentStatus> status = repo.findByStudentIdAndDate(studentId, today);
        return status.orElse(null);
    }
}