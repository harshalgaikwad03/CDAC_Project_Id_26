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
@Table(name = "driver")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id") // ✅ Links Driver ID to User ID
public class Driver extends User { // ✅ Now extends User

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;

    // Inherits name, email, phone, password, role from User
}