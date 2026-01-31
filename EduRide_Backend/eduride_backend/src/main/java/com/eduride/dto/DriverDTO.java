package com.eduride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DriverDTO {

    private Long id;
    private String name;
    private String phone;
    private String licenseNumber;

    // derived from Bus
    private Long busId;
    private String busNumber;

    private Long schoolId;
    private String schoolName;
}


