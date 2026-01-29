package com.eduride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BusDTO {

    private Long id;
    private String busNumber;
    private Integer capacity;

    // ✅ SCHOOL
    private Long schoolId;
    private String schoolName;

    // ✅ DRIVER (THIS WAS MISSING)
    private Long driverId;
    private String driverName;
    private String driverPhone;

    // ✅ HELPER
    private String helperName;
    private String helperPhone;
}
