package com.eduride.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "school")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class School extends User {

    @Column(nullable = false)
    private String address;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agency_id", nullable = true)
    @JsonIgnoreProperties({ "schools", "hibernateLazyInitializer", "handler" })
    private Agency agency;
}

