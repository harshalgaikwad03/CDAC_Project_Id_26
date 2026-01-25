package com.eduride.controller;

import com.eduride.dto.LoginRequestDTO;
import com.eduride.entity.*;
import com.eduride.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.eduride.service.AgencyService agencyService;

    @Autowired
    private com.eduride.service.SchoolService schoolService;

    @Autowired
    private com.eduride.service.StudentService studentService;

    @Autowired
    private com.eduride.service.DriverService driverService;

    @Autowired
    private com.eduride.service.BusHelperService busHelperService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO req) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        // Keep full authority name (ROLE_XXXXX)
        String fullAuthority = userDetails.getAuthorities().iterator().next().getAuthority();

        // Generate token with full authority (ROLE_STUDENT, ROLE_AGENCY, etc.)
        String token = jwtUtil.generateToken(email, fullAuthority);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);

        // For frontend convenience - send clean role name without ROLE_
        String cleanRole = fullAuthority.replace("ROLE_", "");
        response.put("role", cleanRole);
        response.put("email", email);

        // AGENCY
        Optional<Agency> agencyOpt = agencyService.findByEmail(email);
        if (agencyOpt.isPresent()) {
            Agency agency = agencyOpt.get();
            response.put("name", agency.getName() != null ? agency.getName() : agency.getAgencyName());
            response.put("id", agency.getId());
            return ResponseEntity.ok(response);
        }

        // STUDENT
        Optional<Student> studentOpt = studentService.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            response.put("name", student.getName());
            response.put("id", student.getId());
            return ResponseEntity.ok(response);
        }

        // DRIVER
        Optional<Driver> driverOpt = driverService.findByEmail(email);
        if (driverOpt.isPresent()) {
            Driver driver = driverOpt.get();
            response.put("name", driver.getName());
            response.put("id", driver.getId());
            return ResponseEntity.ok(response);
        }

        // SCHOOL
        Optional<School> schoolOpt = schoolService.findByEmail(email);
        if (schoolOpt.isPresent()) {
            School school = schoolOpt.get();
            response.put("name", school.getName() != null ? school.getName() : school.getSchoolName());
            response.put("id", school.getId());
            return ResponseEntity.ok(response);
        }

        // BUS HELPER
        Optional<BusHelper> helperOpt = busHelperService.findByEmail(email);
        if (helperOpt.isPresent()) {
            BusHelper helper = helperOpt.get();
            response.put("name", helper.getName());
            response.put("id", helper.getId());
            return ResponseEntity.ok(response);
        }

        // Fallback
        response.put("name", "Unknown User");
        response.put("id", null);
        return ResponseEntity.ok(response);
    }
}