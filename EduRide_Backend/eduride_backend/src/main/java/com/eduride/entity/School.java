package com.eduride.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "school")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id")
public class School extends User {

    @Column(nullable = false)
    private String address;

    // Accepts agency on WRITE, hides it on READ
    @ManyToOne
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Agency agency;
}
