package com.eduride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "school")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id")
public class School extends User {

    @Column(nullable = false)
    private String address;

    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonIgnore // ✅ ADD THIS
    private Agency agency;
}
