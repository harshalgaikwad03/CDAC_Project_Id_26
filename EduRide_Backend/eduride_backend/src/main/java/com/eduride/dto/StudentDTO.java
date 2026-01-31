package com.eduride.dto;

public record StudentDTO(
	    Long id,
	    String name,
	    String email,
	    String rollNo,
	    String className,
	    String phone,
	    String address,
	    String passStatus,

	    // School info
	    Long schoolId,
	    String schoolName,

	    // Assigned bus info
	    Long assignedBusId,
	    String assignedBusNumber
	) {}

