package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverDashboardSummaryDTO {

    private String busNumber;

    private int totalStudents;

    private int pickedHomeToSchool;
    private int droppedSchoolToHome;
}

