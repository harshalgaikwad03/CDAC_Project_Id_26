package com.eduride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SchoolSummaryDTO {

    private Long id;
    private String name;
    private Long totalStudents;
    private Long totalBuses;
}
