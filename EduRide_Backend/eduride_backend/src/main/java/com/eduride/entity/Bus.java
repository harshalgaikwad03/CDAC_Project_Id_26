package com.eduride.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bus")
@Getter
@Setter
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @Column(nullable = false)
    private int capacity;

    // ❗ Agency is ALWAYS set from JWT (never from frontend)
    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonIgnore
    private Agency agency;

    // ✅ MUST NOT be JsonIgnore (needed for POST request)
    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    // ✅ MUST NOT be JsonIgnore (needed for POST request)
    @OneToOne
    @JoinColumn(name = "driver_id", unique = true)
    private Driver driver;

    @OneToMany(mappedBy = "assignedBus", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<BusHelper> busHelpers;
}
