package com.eduride.entity;

import java.time.LocalDate;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="student_status")
@Getter
@Setter
public class StudentStatus {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private LocalDate date;
	
	@Column(name="pickup_status")
	private String pickupStatus; // PENDING / PICKED / DROPPED
	
	@ManyToOne
	@JoinColumn(name="student_id")
	private Student student;
	
	 @ManyToOne
	 @JoinColumn(name = "updated_by", nullable = false)
	private BusHelper updatedBy;
	
	
}
