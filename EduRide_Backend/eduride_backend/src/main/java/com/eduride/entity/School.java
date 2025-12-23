package com.eduride.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "school")
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String contact;
    private String email;

main
    @Column(nullable = false)
    private String password;

 master
    @ManyToOne
    @JoinColumn(name = "agency_id")
    private Agency agency;

 main
    // Getters & Setters

    // getters & setters
 master
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

 main
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }


 master
    public Agency getAgency() { return agency; }
    public void setAgency(Agency agency) { this.agency = agency; }
}
