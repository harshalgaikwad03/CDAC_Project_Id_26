package com.eduride.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eduride.dto.SchoolSummaryDTO;
import com.eduride.dto.dashboard.SchoolDashboardSummaryDTO;
import com.eduride.entity.Agency;
import com.eduride.entity.Bus;
import com.eduride.entity.Role;
import com.eduride.entity.School;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.AgencyRepository;
import com.eduride.repository.BusRepository;
import com.eduride.repository.SchoolRepository;
import com.eduride.repository.StudentRepository;
import com.eduride.repository.StudentStatusRepository;

import jakarta.transaction.Transactional;

@Service
public class SchoolService {

    private final SchoolRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final BusRepository busRepository;
    private final StudentStatusRepository studentStatusRepository;
    private final AgencyRepository agencyRepository;


    public SchoolService(
            SchoolRepository repo,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository,
            BusRepository busRepository,
            StudentStatusRepository studentStatusRepository, 
            AgencyRepository agencyRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.busRepository = busRepository;
        this.studentStatusRepository = studentStatusRepository;
		this.agencyRepository = agencyRepository;
    }

    public School create(School school) {
        school.setRole(Role.SCHOOL);
        school.setPassword(passwordEncoder.encode(school.getPassword()));
        return repo.save(school);
    }

    public List<School> findAll() {
        return repo.findAll();
    }

    public School findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + id));
    }

    public Optional<School> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public School update(Long id, School updated) {
        School existing = findById(id);

        // ✅ Allow basic profile updates
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());

        // 🔐 AGENCY RULE (IMPORTANT)
        // Agency can be assigned ONLY ONCE (when currently null)
        if (existing.getAgency() == null && updated.getAgency() != null) {

            Long agencyId = updated.getAgency().getId();

            Agency agency = agencyRepository.findById(agencyId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Agency not found with id: " + agencyId));

            existing.setAgency(agency);
        }

        // ✅ Password update (optional)
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        return repo.save(existing);
    }


    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("School not found with id: " + id);
        }
        repo.deleteById(id);
    }

    
    
    
    
    public List<School> findByAgency(Long agencyId) {
        return repo.findByAgencyId(agencyId);
    }
    

    public SchoolDashboardSummaryDTO getSchoolDashboardSummary(String currentEmail) {
        School school = findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated school not found"));

        Long schoolId = school.getId();
        LocalDate today = LocalDate.now();

        long totalStudents = studentRepository.countBySchoolId(schoolId);
        long totalBuses = busRepository.countBySchoolId(schoolId);

        long presentCount =
                studentStatusRepository.countByStudent_School_IdAndDateAndPickupStatus(
                        schoolId, today, "PICKED"
                );

        long absentCount = totalStudents - presentCount;
        if (absentCount < 0) absentCount = 0;

        double attendancePercentage =
                totalStudents > 0 ? (presentCount * 100.0) / totalStudents : 0.0;

        return new SchoolDashboardSummaryDTO(
                school.getName(),
                totalStudents,
                totalBuses,
                presentCount,
                absentCount,
                attendancePercentage
        );
    }
    
    
    
    public List<SchoolSummaryDTO> getSchoolsForAgency(Long agencyId) {
        return repo.findSchoolsByAgencyWithCounts(agencyId);
    }

    @Transactional
    public void releaseSchoolFromAgency(Long schoolId, Long agencyId) {

        School school = repo.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found with id: " + schoolId));

        if (school.getAgency() == null ||
            !school.getAgency().getId().equals(agencyId)) {
            throw new SecurityException("Unauthorized release attempt");
        }

        // Unassign buses
        List<Bus> buses = busRepository.findBySchoolId(schoolId);
        for (Bus bus : buses) {
            bus.setSchool(null);
        }
        busRepository.saveAll(buses);

        // Release school
        school.setAgency(null);
        repo.save(school);
    }



}