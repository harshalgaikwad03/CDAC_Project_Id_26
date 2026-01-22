package com.eduride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="student")
@Setter
@Getter
public class Student extends BaseUserEntity{
	
	@Column(name="class_name")
	private String className;
	
	@Column(name="roll_no")
	private String rollNo;
	
	private String address;
	
	@Column(name="pass_status")
	private String passStatus;
	
	@ManyToOne
	@JoinColumn(name="school_id")
	private School school;
	
	@ManyToOne
	@JoinColumn(name="assigned_bus_id")
	private Bus assignedBus;
}
