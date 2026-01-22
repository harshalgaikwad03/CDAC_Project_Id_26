package com.eduride.service;

import com.eduride.entity.Driver;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository repo;

    public DriverService(DriverRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Driver create(Driver driver) {
        return repo.save(driver);
    }

    // READ ALL
    public List<Driver> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Driver findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
    }

    // UPDATE
    public Driver update(Long id, Driver updated) {
        Driver existing = findById(id);

        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setLicenseNumber(updated.getLicenseNumber());
        existing.setEmail(updated.getEmail());
        existing.setPassword(updated.getPassword());
        existing.setAgency(updated.getAgency());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // CUSTOM APIs
    public List<Driver> findByAgency(Long agencyId) {
        return repo.findByAgencyId(agencyId);
    }
    
    // LOGIN
    public Driver login(String email, String password) {
        return repo.findByEmail(email)
                .filter(driver -> driver.getPassword().equals(password)) // demo: plain-text
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
    }

}
