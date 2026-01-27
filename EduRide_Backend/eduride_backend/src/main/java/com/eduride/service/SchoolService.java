package com.eduride.service;

import com.eduride.dto.dashboard.SchoolDashboardSummaryDTO;
import com.eduride.entity.Role;
import com.eduride.entity.School;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusRepository;
import com.eduride.repository.SchoolRepository;
import com.eduride.repository.StudentRepository;
import com.eduride.repository.StudentStatusRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SchoolService {

    private final SchoolRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final BusRepository busRepository;
    private final StudentStatusRepository studentStatusRepository;

    public SchoolService(
            SchoolRepository repo,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository,
            BusRepository busRepository,
            StudentStatusRepository studentStatusRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.busRepository = busRepository;
        this.studentStatusRepository = studentStatusRepository;
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

        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());
        existing.setAgency(updated.getAgency());

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

        long presentCount = studentStatusRepository.countByStudentSchoolIdAndDateAndPickupStatus(
                schoolId, today, "PRESENT"   // ← IMPORTANT: change this string to match your actual PickupStatus value
        );

        long studentsWithStatusToday = studentStatusRepository.countByStudentSchoolIdAndDate(
                schoolId, today
        );
        long absentCount = studentsWithStatusToday - presentCount;

        double attendancePercentage = totalStudents > 0
                ? (presentCount * 100.0) / totalStudents
                : 0.0;

        // Use inherited getName() from User — no need for getSchoolName()
        String displayName = school.getName();
        if (displayName == null || displayName.trim().isEmpty()) {
            displayName = "Unnamed School";
        }

        return new SchoolDashboardSummaryDTO(
                displayName,
                totalStudents,
                totalBuses,
                presentCount,
                absentCount,
                attendancePercentage
        );
    }
}