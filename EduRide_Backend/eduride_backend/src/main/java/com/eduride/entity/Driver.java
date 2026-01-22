package com.eduride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name="driver")
@Setter
@Getter
public class Driver extends BaseUserEntity {

	
	@Column(name="license_number")
	private String licenseNumber;
	
	@ManyToOne
	@JoinColumn(name="agency_id")
	private Agency agency;
	
	
}
