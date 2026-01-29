package com.ms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.ms.entities.PaymentDetails;
import com.ms.repository.PaymentRepository;
import com.ms.client.StudentClient; // Import your new client

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment") // Make sure this matches Gateway
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StudentClient studentClient; // <--- Inject the Feign Client

    @PostMapping("/pay")
    public PaymentDetails makePayment(@RequestParam Long studentId, @RequestParam Double amount) {
        
        // 1. COMMUNICATE: Verify student exists using Microservice call
        System.out.println("Contacting Student Service...");
        String studentInfo = studentClient.getStudent(studentId);
        System.out.println("Student Service Replied: " + studentInfo);
        
        // 2. LOGIC: Create transaction (using the info received)
        String transactionId = UUID.randomUUID().toString();
        
        // We save the "status" as the response from the student service for proof!
        PaymentDetails payment = new PaymentDetails(studentId, amount, "SUCCESS - " + studentInfo, transactionId);
        
        return paymentRepository.save(payment);
    }

    @GetMapping("/history/{studentId}")
    public List<PaymentDetails> getHistory(@PathVariable Long studentId) {
        return paymentRepository.findByStudentId(studentId);
    }
}