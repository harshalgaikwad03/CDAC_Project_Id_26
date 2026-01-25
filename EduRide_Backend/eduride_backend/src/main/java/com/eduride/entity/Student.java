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
@Table(name = "student")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id") // ✅ Links Student ID to User ID
public class Student extends User { // ✅ Now extends User (not BaseUserEntity)

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "roll_no", nullable = false)
    private String rollNo;

    @Column(nullable = false)
    private String address;

    @Column(name = "pass_status", nullable = false)
    private String passStatus;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne
    @JoinColumn(name = "assigned_bus_id")
    private Bus assignedBus;
    
    // Name, Email, Phone, Password, Role are inherited from User!
}