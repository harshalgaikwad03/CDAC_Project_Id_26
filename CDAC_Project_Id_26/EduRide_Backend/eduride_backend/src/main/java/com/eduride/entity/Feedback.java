package com.eduride.entity;

import java.time.LocalDateTime;

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
@Table(name="feedback")
@Getter
@Setter
public class Feedback {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="feedback_text")
	private String feedbackText;
	
	private int rating;
	
	@Column(name="created_at")
	private LocalDateTime createdAt;
	
	@ManyToOne
	@JoinColumn(name="student_id")
	private Student student;
	
	@ManyToOne
	@JoinColumn(name="bus_id")
	private Bus bus;
	
	@ManyToOne
	@JoinColumn(name="driver_id")
	private Driver driver;
	
	@ManyToOne
	@JoinColumn(name="helper_id")
	private BusHelper busHelper;

	
}
