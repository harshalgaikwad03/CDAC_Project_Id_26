package com.eduride.dto;

import lombok.Data;

@Data
public class HelperStudentStatusDTO {
	private Long studentId;

 private Long id;
 private String name;
 private String rollNo;
 private String className;
 private String phone;
 private String busNumber;

 private String pickupStatus; // 👈 TODAY’s status

 // getters & setters
}

