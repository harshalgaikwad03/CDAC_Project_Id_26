package com.eduride.controller;

import com.eduride.dto.ChangePasswordRequest;
import com.eduride.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String email = authentication.getName(); // extracted from JWT
        userService.changePassword(email, request);

        return ResponseEntity.ok("Password changed successfully");
    }
}
