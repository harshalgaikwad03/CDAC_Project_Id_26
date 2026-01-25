package com.eduride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "school")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id") // ✅ Links School ID to User ID
public class School extends User { // ✅ Now extends User (not BaseUserEntity)

    // REMOVED @AttributeOverride: We must use the standard 'phone' column from the User table.

    @Column(nullable = false)
    private String address;

    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;

	public Object getSchoolName() {
		// TODO Auto-generated method stub
		return null;
	}
    
    // Inherits name, email, phone, password, role, active from User
}