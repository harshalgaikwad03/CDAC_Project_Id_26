package com.eduride.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bus_helper")
@Getter
@Setter

public class BusHelper extends BaseUserEntity{

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne
    @JoinColumn(name = "assigned_bus_id")
    private Bus assignedBus;

   
}
