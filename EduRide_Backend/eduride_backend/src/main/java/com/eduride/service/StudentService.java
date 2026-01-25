package com.eduride.service;

import com.eduride.entity.Role;
import com.eduride.entity.Student;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository repo;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE (SIGNUP)
    public Student create(Student student) {
        student.setRole(Role.STUDENT);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return repo.save(student);
    }

    // READ ALL
    public List<Student> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Student findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    // READ BY EMAIL – now returns Optional (recommended)
    public Optional<Student> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // UPDATE
    public Student update(Long id, Student updated) {
        Student existing = findById(id);

        // Inherited from User
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());

        // Student-specific
        existing.setClassName(updated.getClassName());
        existing.setRollNo(updated.getRollNo());
        existing.setAddress(updated.getAddress());
        existing.setPassStatus(updated.getPassStatus());
        existing.setSchool(updated.getSchool());
        existing.setAssignedBus(updated.getAssignedBus());

        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        repo.deleteById(id);
    }

    // CUSTOM QUERIES
    public List<Student> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId);
    }

    public List<Student> findByBus(Long busId) {
        return repo.findByAssignedBusId(busId);
    }
}