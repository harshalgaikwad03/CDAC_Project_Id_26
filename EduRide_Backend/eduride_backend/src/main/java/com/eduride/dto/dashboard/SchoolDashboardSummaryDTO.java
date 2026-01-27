package com.eduride.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolDashboardSummaryDTO {

    private String schoolName;
    private long totalStudents;
    private long totalBuses;
    private long presentToday;
    private long absentToday;
    private double attendancePercentage;

    // Optional: formatted percentage for easy frontend display
    public String getFormattedAttendance() {
        return String.format("%.1f%%", attendancePercentage);
    }

    // Optional: formatted counts with commas (e.g., 1,234)
    public String getFormattedTotalStudents() {
        return String.format("%,d", totalStudents);
    }

    public String getFormattedTotalBuses() {
        return String.format("%,d", totalBuses);
    }

    public String getFormattedPresentToday() {
        return String.format("%,d", presentToday);
    }

    public String getFormattedAbsentToday() {
        return String.format("%,d", absentToday);
    }
}