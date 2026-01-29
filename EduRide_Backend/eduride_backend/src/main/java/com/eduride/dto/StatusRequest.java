package com.eduride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusRequest {
    private Long studentId;
    private String pickupStatus;
}
