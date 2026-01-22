package com.eduride.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "agency")
@Getter
@Setter

@AttributeOverride(
	    name = "phone",
	    column = @Column(name = "contact", nullable = false, length = 15)
	)
public class Agency extends BaseUserEntity {
	
	private String address;

	 public String getContact() { return phone; }
	    public void setContact(String phone) { this.phone = phone; }

	
}
