package com.eduride.dto;

import java.time.LocalDate;

import lombok.Data;


public record StudentStatusDTO(
	    String pickupStatus,
	    LocalDate date,
	    String updatedByName
	) {}

