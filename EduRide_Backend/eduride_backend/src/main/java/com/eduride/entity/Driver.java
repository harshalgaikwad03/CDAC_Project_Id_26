package com.eduride.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "driver")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id")
public class Driver extends User {

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    // Accepts agency on WRITE, hides it on READ
    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Agency agency;
}
