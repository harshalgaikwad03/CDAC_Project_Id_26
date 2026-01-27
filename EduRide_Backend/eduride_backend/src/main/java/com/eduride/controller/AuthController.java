package com.eduride.controller;

import com.eduride.dto.LoginRequestDTO;
import com.eduride.entity.*;
import com.eduride.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        System.out.println("DEBUG: Login attempt for email: " + req.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();

            // Get full authority (should be "ROLE_SCHOOL", "ROLE_AGENCY", etc.)
            String fullAuthority = userDetails.getAuthorities().iterator().next().getAuthority();
            System.out.println("DEBUG: Full authority from UserDetails: " + fullAuthority);

            // Generate token (pass fullAuthority with ROLE_ prefix)
            String token = jwtUtil.generateToken(email, fullAuthority);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            // Clean role for frontend (without ROLE_, lowercase for consistency)
            String cleanRole = fullAuthority.replace("ROLE_", "").toLowerCase();
            response.put("role", cleanRole);
            response.put("email", email);

            // ─────────────────────────────────────────────────────────────
            // Find user entity and add name + id
            // ─────────────────────────────────────────────────────────────

            // AGENCY
            Optional<Agency> agencyOpt = agencyService.findByEmail(email);
            if (agencyOpt.isPresent()) {
                Agency agency = agencyOpt.get();
                response.put("name", agency.getName() != null ? agency.getName() : "Agency User");
                response.put("id", agency.getId());
                System.out.println("DEBUG: Logged in as AGENCY - ID: " + agency.getId());
                return ResponseEntity.ok(response);
            }

            // STUDENT
            Optional<Student> studentOpt = studentService.findByEmail(email);
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                response.put("name", student.getName() != null ? student.getName() : "Student");
                response.put("id", student.getId());
                System.out.println("DEBUG: Logged in as STUDENT - ID: " + student.getId());
                return ResponseEntity.ok(response);
            }

            // DRIVER
            Optional<Driver> driverOpt = driverService.findByEmail(email);
            if (driverOpt.isPresent()) {
                Driver driver = driverOpt.get();
                response.put("name", driver.getName() != null ? driver.getName() : "Driver");
                response.put("id", driver.getId());
                System.out.println("DEBUG: Logged in as DRIVER - ID: " + driver.getId());
                return ResponseEntity.ok(response);
            }

            // SCHOOL
            Optional<School> schoolOpt = schoolService.findByEmail(email);
            if (schoolOpt.isPresent()) {
                School school = schoolOpt.get();
                // Only 'name' exists (inherited from User) - remove schoolName reference
                response.put("name", school.getName() != null ? school.getName() : "School");
                response.put("id", school.getId());
                System.out.println("DEBUG: Logged in as SCHOOL - ID: " + school.getId());
                return ResponseEntity.ok(response);
            }

            // BUS HELPER
            Optional<BusHelper> helperOpt = busHelperService.findByEmail(email);
            if (helperOpt.isPresent()) {
                BusHelper helper = helperOpt.get();
                response.put("name", helper.getName() != null ? helper.getName() : "Bus Helper");
                response.put("id", helper.getId());
                System.out.println("DEBUG: Logged in as BUS HELPER - ID: " + helper.getId());
                return ResponseEntity.ok(response);
            }

            // Fallback (should not reach here)
            System.out.println("WARN: No entity found for email: " + email);
            response.put("name", "Unknown User");
            response.put("id", null);
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.out.println("DEBUG: Invalid credentials for: " + req.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            System.out.println("ERROR: Login failed - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed"));
        }
    }
}