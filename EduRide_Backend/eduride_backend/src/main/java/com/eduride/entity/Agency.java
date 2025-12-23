package com.eduride.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "agency")
public class Agency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contact;
    private String email;
    private String address;

main
    @Column(nullable = false)
    private String password;

    // Getters & Setters

    // getters & setters
 master
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
 main

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
 master
}
