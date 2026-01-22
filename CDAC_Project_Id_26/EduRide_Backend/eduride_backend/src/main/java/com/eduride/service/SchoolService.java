package com.eduride.service;

import com.eduride.entity.Driver;
import com.eduride.entity.School;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.SchoolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolService {

    private final SchoolRepository repo;

    public SchoolService(SchoolRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public School create(School school) {
        return repo.save(school);
    }

    // READ ALL
    public List<School> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public School findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School not found"));
    }

    // UPDATE
    public School update(Long id, School updated) {
        School existing = findById(id);

        existing.setName(updated.getName());
        existing.setAddress(updated.getAddress());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setPassword(updated.getPassword());
        existing.setAgency(updated.getAgency());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // CUSTOM API
    public List<School> findByAgency(Long agencyId) {
        return repo.findByAgencyId(agencyId);
    }
    
 // LOGIN
    public School login(String email, String password) {
        return repo.findByEmail(email)
                .filter(driver -> driver.getPassword().equals(password)) // demo: plain-text
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
    }
}
