package com.eduride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusHelperEditDTO  {

	private Long id;
    private String name;
    private String phone;
    private Long schoolId;
    private Long assignedBusId;
}
