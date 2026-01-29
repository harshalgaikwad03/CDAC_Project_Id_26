package com.ms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ms.entities.PaymentDetails;
import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentDetails, Long> {
    // Custom method to find all payments for a specific student
    List<PaymentDetails> findByStudentId(Long studentId);
}