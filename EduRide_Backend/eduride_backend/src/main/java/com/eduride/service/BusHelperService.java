package com.eduride.service;

import com.eduride.entity.BusHelper;
import com.eduride.entity.Driver;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusHelperRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusHelperService {

    private final BusHelperRepository repo;

    public BusHelperService(BusHelperRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public BusHelper create(BusHelper helper) {
        return repo.save(helper);
    }

    // READ ALL
    public List<BusHelper> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public BusHelper findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BusHelper not found"));
    }

    // UPDATE
    public BusHelper update(Long id, BusHelper updated) {
        BusHelper existing = findById(id);

        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setPassword(updated.getPassword());
        existing.setSchool(updated.getSchool());
        existing.setAssignedBus(updated.getAssignedBus());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // CUSTOM APIs
    public List<BusHelper> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId);
    }

    public List<BusHelper> findByBus(Long busId) {
        return repo.findByAssignedBusId(busId);
    }
    
 // LOGIN
    public BusHelper login(String email, String password) {
        return repo.findByEmail(email)
                .filter(driver -> driver.getPassword().equals(password)) // demo: plain-text
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
    }
}
