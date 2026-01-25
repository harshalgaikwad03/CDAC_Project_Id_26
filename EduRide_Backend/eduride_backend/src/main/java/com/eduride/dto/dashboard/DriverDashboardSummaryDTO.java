// com.eduride.dto.dashboard/DriverDashboardSummaryDTO.java
package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverDashboardSummaryDTO {
    private String busNumber;
    private String routeName;           // e.g. "Morning School Route"
    private String status;              // "On Time", "Delayed", etc.
    private int totalStudentsToday;
    private int pickedUpCount;
}