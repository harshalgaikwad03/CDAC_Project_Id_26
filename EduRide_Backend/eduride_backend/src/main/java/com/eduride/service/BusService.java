package com.eduride.service;

import com.eduride.entity.Bus;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusService {

    private final BusRepository repo;

    public BusService(BusRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Bus create(Bus bus) {
        return repo.save(bus);
    }

    // READ ALL
    public List<Bus> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Bus findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
    }

    // UPDATE
    public Bus update(Long id, Bus updated) {
        Bus existing = findById(id);

        existing.setBusNumber(updated.getBusNumber());
        existing.setCapacity(updated.getCapacity());
        existing.setAgency(updated.getAgency());
        existing.setSchool(updated.getSchool());
        existing.setDriver(updated.getDriver());

        return repo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // CUSTOM APIs
    public List<Bus> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId);
    }

    public List<Bus> findByAgency(Long agencyId) {
        return repo.findByAgencyId(agencyId);
    }
}
