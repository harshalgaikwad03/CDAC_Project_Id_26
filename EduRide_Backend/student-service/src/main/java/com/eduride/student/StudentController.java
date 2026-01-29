package com.eduride.student;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping("/{id}")
    public String getStudent(@PathVariable Long id) {
        // Simulating a database lookup
        return "Verified Student: Harshal (ID: " + id + ")";
    }
}