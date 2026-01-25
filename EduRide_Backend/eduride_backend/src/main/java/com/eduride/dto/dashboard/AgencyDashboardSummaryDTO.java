// com.eduride.dto.dashboard/AgencyDashboardSummaryDTO.java
package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgencyDashboardSummaryDTO {
    private long totalBuses;
    private long totalDrivers;
    private long totalStudents;
    private long totalSchools;
}