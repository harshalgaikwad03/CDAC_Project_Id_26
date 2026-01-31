package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BusHelperDashboardSummaryDTO {

    private String busNumber;
    private String routeName;

    private int totalStudentsAssigned;
    private int pickedCount;
    private int pendingCount;
    private int droppedCount;
}
