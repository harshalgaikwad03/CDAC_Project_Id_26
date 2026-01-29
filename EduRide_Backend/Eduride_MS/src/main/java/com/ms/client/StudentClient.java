package com.ms.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// The name must match the application name in Eureka (STUDENT-SERVICE)
@FeignClient(name = "STUDENT-SERVICE")
public interface StudentClient {

    @GetMapping("/api/student/{id}")
    String getStudent(@PathVariable("id") Long id);
}