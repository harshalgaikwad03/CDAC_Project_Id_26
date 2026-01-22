package com.eduride.service;

import com.eduride.entity.Agency;
import com.eduride.entity.Driver;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.AgencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgencyService {

    private final AgencyRepository repo;

    public AgencyService(AgencyRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Agency create(Agency agency) {
        return repo.save(agency);
    }

    // READ ALL
    public List<Agency> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Agency findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found"));
    }

    // UPDATE
    public Agency update(Long id, Agency updated) {
        Agency existing = findById(id);

        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());
        existing.setPassword(updated.getPassword());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }
    
 // LOGIN
    public Agency login(String email, String password) {
        return repo.findByEmail(email)
                .filter(driver -> driver.getPassword().equals(password)) // demo: plain-text
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
    }
}
