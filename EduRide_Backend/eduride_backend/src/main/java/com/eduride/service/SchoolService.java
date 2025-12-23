package com.eduride.service;

import com.eduride.entity.School;
import com.eduride.repository.SchoolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public SchoolService(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    public School save(School school) {
        return schoolRepository.save(school);
    }

    public List<School> findAll() {
        return schoolRepository.findAll();
    }

    public School findById(Long id) {
        return schoolRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        schoolRepository.deleteById(id);
    }
    
    
    public School login(String email, String password) {
        return schoolRepository.findByEmail(email)
                .filter(s -> s.getPassword().equals(password))
                .orElse(null);
    }
    
}
