package com.eduride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonIgnore // ✅ ADD THIS
    private Agency agency;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = true)
    @JsonIgnore // ✅ ADD THIS
    private School school;

    @OneToOne
    @JoinColumn(name = "driver_id", unique = true)
    @JsonIgnore // ✅ ADD THIS
    private Driver driver;

    
    @OneToMany(mappedBy = "assignedBus", fetch = FetchType.LAZY)
    @JsonIgnore // ✅ ADD THIS
    private List<BusHelper> busHelpers;

}
