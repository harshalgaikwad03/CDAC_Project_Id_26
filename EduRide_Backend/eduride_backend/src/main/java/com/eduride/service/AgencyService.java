package com.eduride.service;

import com.eduride.entity.Agency;
import com.eduride.repository.AgencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgencyService {

    private final AgencyRepository agencyRepository;

    public AgencyService(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    public Agency save(Agency agency) {
        return agencyRepository.save(agency);
    }

    public List<Agency> findAll() {
        return agencyRepository.findAll();
    }

    public Agency findById(Long id) {
        return agencyRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        agencyRepository.deleteById(id);
    }
    
    public Agency login(String email, String password) {
        return agencyRepository.findByEmail(email)
                .filter(a -> a.getPassword().equals(password))
                .orElse(null);
    }

}
