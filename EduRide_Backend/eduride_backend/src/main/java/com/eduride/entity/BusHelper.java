package com.eduride.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bus_helper")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id") // ✅ Links Helper ID to User ID
public class BusHelper extends User { // ✅ Now extends User

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne
    @JoinColumn(name = "assigned_bus_id")
    private Bus assignedBus;
    
    // Inherits name, phone, email, password, role from User
}