package com.eduride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "agency")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id") // Agency ID will match User ID
public class Agency extends User { // <--- NOW EXTENDS USER

    @Column(nullable = false)
    private String address;

	public Object getAgencyName() {
		// TODO Auto-generated method stub
		return null;
	}
    
    // It inherits name, phone, email, password, role from User automatically!
}