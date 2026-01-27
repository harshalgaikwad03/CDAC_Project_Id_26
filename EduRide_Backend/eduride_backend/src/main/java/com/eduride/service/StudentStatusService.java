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

    // ─── CREATE ───
    public StudentStatus create(StudentStatus status) {
        // Auto-set current date if not provided
        if (status.getDate() == null) {
            status.setDate(LocalDate.now());
        }
        return repo.save(status);
    }

    // ─── READ ALL ───
    public List<StudentStatus> findAll() {
        return repo.findAll();
    }

    // ─── READ ONE ───
    public StudentStatus findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student status not found with id: " + id));
    }

    // ─── UPDATE ───
    public StudentStatus update(Long id, StudentStatus updated) {
        StudentStatus existing = findById(id);

        // Update allowed fields
        if (updated.getPickupStatus() != null) {
            existing.setPickupStatus(updated.getPickupStatus());
        }
        if (updated.getStudent() != null) {
            existing.setStudent(updated.getStudent());
        }
        if (updated.getUpdatedBy() != null) {
            existing.setUpdatedBy(updated.getUpdatedBy());
        }
        // Date is usually not updated — keep original

        return repo.save(existing);
    }

    // ─── DELETE ───
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Student status not found with id: " + id);
        }
        repo.deleteById(id);
    }

    // ─── Find all statuses for a specific student ───
    public List<StudentStatus> findByStudent(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    // ─── Find today's status for a specific student ───
    public Optional<StudentStatus> findTodayStatusForStudent(Long studentId) {
        LocalDate today = LocalDate.now();
        return repo.findByStudentIdAndDate(studentId, today);
    }

    // ─── NEW: Find all statuses for a school on a specific date ───
    public List<StudentStatus> findBySchoolIdAndDate(Long schoolId, LocalDate date) {
        return repo.findByStudentSchoolIdAndDate(schoolId, date);
    }

    // ─── NEW: Count statuses for a school on a specific date ───
    public long countBySchoolIdAndDate(Long schoolId, LocalDate date) {
        return repo.countByStudentSchoolIdAndDate(schoolId, date);
    }

    // ─── NEW: Count present statuses for a school on a specific date ───
    public long countPresentBySchoolIdAndDate(Long schoolId, LocalDate date) {
        return repo.countByStudentSchoolIdAndDateAndPickupStatus(schoolId, date, "PRESENT");
        // Change "PRESENT" to your actual PickupStatus enum/string value if different
    }
}