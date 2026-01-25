// com.eduride.dto.dashboard/BusHelperDashboardSummaryDTO.java
package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusHelperDashboardSummaryDTO {
    private String busNumber;
    private String routeName;
    private int totalStudentsAssigned;
    private int checkedInCount;
}