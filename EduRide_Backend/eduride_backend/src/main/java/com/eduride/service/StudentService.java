package com.eduride.service;

import com.eduride.entity.Role;
import com.eduride.entity.School;
import com.eduride.entity.Student;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusRepository;
import com.eduride.repository.SchoolRepository;
import com.eduride.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.eduride.dto.StudentDTO;
import com.eduride.dto.StudentSignupDTO;
import com.eduride.mapper.StudentMapper;


import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository repo;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final BusRepository busRepository;

    public StudentService(
            StudentRepository repo,
            SchoolRepository schoolRepository,
            PasswordEncoder passwordEncoder, BusRepository busRepository
    ) {
        this.repo = repo;
        this.schoolRepository = schoolRepository;
        this.passwordEncoder = passwordEncoder;
		this.busRepository = busRepository;
    }

    // CREATE
    public Student create(Student student) {
        student.setRole(Role.STUDENT);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return repo.save(student);
    }

    // READ ALL
    public List<Student> findAll() {
        return repo.findAll();
    }

    // READ BY ID
    public Student findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found with id: " + id));
    }

    // READ BY EMAIL
    public Optional<Student> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // ONLY STUDENTS OF LOGGED-IN SCHOOL
    public List<Student> findByLoggedInSchool(String schoolEmail) {
        School school = schoolRepository.findByEmail(schoolEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "School not found"
                ));

        return repo.findBySchoolId(school.getId());
    }
    
    
    
    
    public Student createFromSignup(StudentSignupDTO dto) {

//        if (repo.existsByEmail(dto.email())) {
//            throw new ResponseStatusException(
//                HttpStatus.CONFLICT,
//                "Email already registered"
//            );
//        }

        School school = schoolRepository.findById(dto.schoolId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "School not found"
            ));

        Student student = new Student();
        student.setName(dto.name());
        student.setEmail(dto.email());
        student.setPassword(passwordEncoder.encode(dto.password()));
        student.setPhone(dto.phone());
        student.setRollNo(dto.rollNo());
        student.setClassName(dto.className());
        student.setAddress(dto.address());

        // 🔐 SECURITY-CONTROLLED FIELDS
        student.setRole(Role.STUDENT);
        student.setPassStatus("INACTIVE"); // payment-controlled
        student.setSchool(school);

        if (dto.busId() != null) {
            student.setAssignedBus(
                busRepository.findById(dto.busId())
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bus not found"
                    ))
            );
        }

        return repo.save(student);
    }

    
    
    
    
    
    
    

    // UPDATE
//    public Student update(Long id, Student updated) {
//        Student existing = findById(id);
//
//        String currentEmail = SecurityContextHolder.getContext()
//                .getAuthentication().getName();
//
//        String role = SecurityContextHolder.getContext()
//                .getAuthentication()
//                .getAuthorities()
//                .iterator()
//                .next()
//                .getAuthority();
//
//        if ("ROLE_STUDENT".equals(role)) {
//            if (!existing.getEmail().equals(currentEmail)) {
//                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
//            }
//        }
//
//        if ("ROLE_SCHOOL".equals(role)) {
//            if (existing.getSchool() == null ||
//                !existing.getSchool().getEmail().equals(currentEmail)) {
//                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
//            }
//        }
//
//        existing.setName(updated.getName());
//        existing.setRollNo(updated.getRollNo());
//        existing.setClassName(updated.getClassName());
//        existing.setPhone(updated.getPhone());
//        existing.setAddress(updated.getAddress());
//        existing.setPassStatus(updated.getPassStatus());
//        existing.setAssignedBus(updated.getAssignedBus());
//
//        return repo.save(existing);
//    }
    
    
    

    public StudentDTO update(Long id, Student updated) {

        Student existing = findById(id);

        String currentEmail = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if ("ROLE_STUDENT".equals(role)) {
            if (!existing.getEmail().equals(currentEmail)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }

        if ("ROLE_SCHOOL".equals(role)) {
            if (existing.getSchool() == null ||
                !existing.getSchool().getEmail().equals(currentEmail)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }

        existing.setName(updated.getName());
        existing.setRollNo(updated.getRollNo());
        existing.setClassName(updated.getClassName());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setPassStatus(updated.getPassStatus());
        existing.setAssignedBus(updated.getAssignedBus());

        Student saved = repo.save(existing);

        return StudentMapper.toDTO(saved);
    }

    
    public List<StudentDTO> findDTOsByLoggedInSchool(String schoolEmail) {
        School school = schoolRepository.findByEmail(schoolEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "School not found"
                ));

        return repo.findBySchoolId(school.getId())
                   .stream()
                   .map(StudentMapper::toDTO)
                   .toList();
    }

    
    
    
    
    
    

    // DELETE
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        repo.deleteById(id);
    }

    public List<Student> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId);
    }

    public List<Student> findByBus(Long busId) {
        return repo.findByAssignedBusId(busId);
    }

    // ✅ NEW: METHOD TO ACTIVATE PASS
    public void activatePass(Long id) {
        Student student = findById(id);
        student.setPassStatus("ACTIVE");
        repo.save(student);
    }

    
    public List<Student> findStudentsByHelperEmail(String email) {
        return repo.findByAssignedBusBusHelpersEmail(email);
    }


}

