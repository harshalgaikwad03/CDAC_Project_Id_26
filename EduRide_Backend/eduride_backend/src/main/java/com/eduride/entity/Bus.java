package com.eduride.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    // ✅ Needed for StudentList
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonIgnoreProperties({ "password", "role" })
    private Agency agency;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id" , nullable = true)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private School school;


    // ❌ THIS IS THE CRITICAL FIX
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", unique = true)
    @JsonIgnoreProperties(
        value = {
            "password",
            "agency",

            // ✅ ADD THESE (CRITICAL)
            "hibernateLazyInitializer",
            "handler"
        },
        allowSetters = true
    )
    private Driver driver;


    // ✅ Needed for StudentList
    @OneToMany(mappedBy = "assignedBus", fetch = FetchType.EAGER)
    @JsonIgnoreProperties({ "assignedBus", "school" })
    private List<BusHelper> busHelpers;
}
