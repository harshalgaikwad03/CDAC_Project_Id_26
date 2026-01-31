package com.eduride.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eduride.dto.BusHelperEditDTO;
import com.eduride.dto.BusHelperResponseDTO;
import com.eduride.dto.dashboard.BusHelperDashboardSummaryDTO;
import com.eduride.entity.BusHelper;
import com.eduride.entity.Role;
import com.eduride.exception.ResourceNotFoundException;
import com.eduride.repository.BusHelperRepository;
import com.eduride.repository.BusRepository;
import com.eduride.repository.SchoolRepository;
import com.eduride.repository.StudentRepository;
import com.eduride.repository.StudentStatusRepository;

@Service
public class BusHelperService {

    private final BusHelperRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final BusRepository busRepository;
    private final SchoolRepository schoolRepository;
    private final StudentStatusRepository studentStatusRepository;
    
    public BusHelperService(
            BusHelperRepository repo,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository,
            BusRepository busRepository, 
            SchoolRepository schoolRepository, 
            StudentStatusRepository studentStatusRepository
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.busRepository = busRepository;
		this.schoolRepository = schoolRepository;
		this.studentStatusRepository = studentStatusRepository;
    }

    public BusHelper create(BusHelper helper) {
        helper.setRole(Role.HELPER);
        if (helper.getPassword() != null && !helper.getPassword().isBlank()) {
            helper.setPassword(passwordEncoder.encode(helper.getPassword()));
        }
        return repo.save(helper);
    }

    public List<BusHelper> findAll() {
        return repo.findAll();
    }

    public BusHelper findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("BusHelper not found with id: " + id));
    }

    // ✅ FIXED UPDATE (ONLY THIS PART CHANGED)
    public BusHelperEditDTO getForEdit(Long helperId) {
        BusHelper helper = repo.findById(helperId)
            .orElseThrow(() -> new ResourceNotFoundException("BusHelper not found"));

        BusHelperEditDTO dto = new BusHelperEditDTO();
        dto.setId(helper.getId());
        dto.setName(helper.getName());
        dto.setPhone(helper.getPhone());
        dto.setSchoolId(helper.getSchool().getId());
        dto.setAssignedBusId(
            helper.getAssignedBus() != null
                ? helper.getAssignedBus().getId()
                : null
        );

        return dto;
    }
    
    
    public void updateHelper(Long id, BusHelperEditDTO dto) {

        BusHelper helper = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("BusHelper not found"));

        helper.setName(dto.getName());
        helper.setPhone(dto.getPhone());

        if (dto.getAssignedBusId() != null) {
            helper.setAssignedBus(
                    busRepository.findById(dto.getAssignedBusId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException("Bus not found"))
            );
        } else {
            helper.setAssignedBus(null);
        }

        repo.save(helper);
    }


    public Long getSchoolIdByEmail(String email) {
        return schoolRepository.findByEmail(email)
                .orElseThrow(() ->
                    new ResourceNotFoundException("School not found for email: " + email)
                )
                .getId();
    }

    
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("BusHelper not found with id: " + id);
        }
        repo.deleteById(id);
    }

//    public List<BusHelper> findBySchool(Long schoolId) {
//        return repo.findBySchoolId(schoolId);
//    }
    
    public List<BusHelperResponseDTO> findBySchool(Long schoolId) {
        return repo.findBySchoolId(schoolId).stream().map(helper -> {
            BusHelperResponseDTO dto = new BusHelperResponseDTO();
            dto.setId(helper.getId());
            dto.setName(helper.getName());
            dto.setPhone(helper.getPhone());
            dto.setBusNumber(
                helper.getAssignedBus() != null
                    ? helper.getAssignedBus().getBusNumber()
                    : null
            );
            return dto;
        }).toList();
    }


    public List<BusHelper> findByBus(Long busId) {
        return repo.findByAssignedBusId(busId);
    }

    public Optional<BusHelper> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public BusHelperDashboardSummaryDTO getBusHelperDashboardSummary(String email) {

        BusHelper helper = findByEmail(email)
            .orElseThrow(() ->
                new ResourceNotFoundException("Bus Helper not found"));

        // 🟡 Helper not assigned to any bus
        if (helper.getAssignedBus() == null) {
            return new BusHelperDashboardSummaryDTO(
                "Not Assigned",
                "N/A",
                0, 0, 0, 0
            );
        }

        Long busId = helper.getAssignedBus().getId();

        // 🔹 Total students assigned to bus
        int totalStudents =
            studentRepository.findByAssignedBusId(busId).size();

        // 🔹 Status counts (STRING based)
        int picked =
            studentStatusRepository.countByBusAndStatus(busId, "PICKED");

        int dropped =
            studentStatusRepository.countByBusAndStatus(busId, "DROPPED");

        int pending = totalStudents - picked - dropped;

        return new BusHelperDashboardSummaryDTO(
            helper.getAssignedBus().getBusNumber(),
            "Home → School",
            totalStudents,
            picked,
            pending,
            dropped
        );
    }

    
    
    public BusHelperResponseDTO getProfile(String email) {
        BusHelper helper = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Helper not found"));

        BusHelperResponseDTO dto = new BusHelperResponseDTO();
        dto.setId(helper.getId());
        dto.setName(helper.getName());
        dto.setEmail(helper.getEmail());
        dto.setPhone(helper.getPhone());
        dto.setBusNumber(
                helper.getAssignedBus() != null
                        ? helper.getAssignedBus().getBusNumber()
                        : null
        );

        return dto;
    }
    
    
    
    
}
