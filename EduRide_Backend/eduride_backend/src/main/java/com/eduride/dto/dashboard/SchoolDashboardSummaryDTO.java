// com.eduride.dto.dashboard/SchoolDashboardSummaryDTO.java
package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolDashboardSummaryDTO {
    private long totalStudents;
    private long assignedBuses;
    private double todayAttendancePercentage; // e.g. 92.5
}