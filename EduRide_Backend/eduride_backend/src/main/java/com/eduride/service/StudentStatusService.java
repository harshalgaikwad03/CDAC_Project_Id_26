package com.eduride.service;

import com.eduride.entity.StudentStatus;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.StudentStatusRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StudentStatusService {

    private final StudentStatusRepository repo;

    public StudentStatusService(StudentStatusRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public StudentStatus create(StudentStatus status) {
        status.setDate(LocalDate.now());   // auto set date
        return repo.save(status);
    }

    // READ ALL
    public List<StudentStatus> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public StudentStatus findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student status not found"));
    }

    // UPDATE
    public StudentStatus update(Long id, StudentStatus updated) {
        StudentStatus existing = findById(id);

        existing.setPickupStatus(updated.getPickupStatus());
        existing.setStudent(updated.getStudent());
        existing.setUpdatedBy(updated.getUpdatedBy());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // REQUIRED API
    public List<StudentStatus> findByStudent(Long studentId) {
        return repo.findByStudentId(studentId);
    }
}
