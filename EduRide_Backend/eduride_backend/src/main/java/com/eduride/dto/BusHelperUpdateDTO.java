package com.eduride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusHelperUpdateDTO {

    private String name;
    private String phone;
    private Long assignedBusId; // ← THIS IS KEY
}
