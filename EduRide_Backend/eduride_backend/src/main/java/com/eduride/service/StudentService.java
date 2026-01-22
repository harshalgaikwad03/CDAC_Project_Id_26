package com.eduride.service;

import com.eduride.entity.Driver;
import com.eduride.entity.Student;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Student create(Student student) {
        return repo.save(student);
    }

    // READ ALL
    public List<Student> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Student findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    // UPDATE
    public Student update(Long id, Student updated) {
        Student existing = findById(id);

        existing.setName(updated.getName());
        existing.setClassName(updated.getClassName());
        existing.setRollNo(updated.getRollNo());
        existing.setEmail(updated.getEmail());
        existing.setPassword(updated.getPassword());
        existing.setAddress(updated.getAddress());
        existing.setPassStatus(updated.getPassStatus());
        existing.setSchool(updated.getSchool());
        existing.setAssignedBus(updated.getAssignedBus());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // CUSTOM APIs
    public List<Student> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId);
    }

    public List<Student> findByBus(Long busId) {
        return repo.findByAssignedBusId(busId);
    }
    
 // LOGIN
    public Student login(String email, String password) {
        return repo.findByEmail(email)
                .filter(driver -> driver.getPassword().equals(password)) // demo: plain-text
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
    }
}
