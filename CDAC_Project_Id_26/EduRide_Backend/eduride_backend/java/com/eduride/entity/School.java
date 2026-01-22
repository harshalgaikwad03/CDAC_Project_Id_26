package com.eduride.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="school")
@Getter
@Setter

@AttributeOverride(
	    name = "phone",
	    column = @Column(name = "contact")
	)
public class School extends BaseUserEntity {
	
	private String address;
	
	@ManyToOne
	@JoinColumn(name = "agency_id")
	private Agency agency;
	
	 public String getContact() { return phone; }
	 public void setContact(String phone) { this.phone = phone; }

}
