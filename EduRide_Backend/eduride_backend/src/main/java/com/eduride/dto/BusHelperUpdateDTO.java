package com.eduride.dto;

import lombok.Data;

//com.eduride.dto.BusHelperUpdateDTO.java
@Data
public class BusHelperUpdateDTO {
 private String name;
 private String phone;
 private Long assignedBusId; // ← only ID
 // NO email, password, role, etc.
}