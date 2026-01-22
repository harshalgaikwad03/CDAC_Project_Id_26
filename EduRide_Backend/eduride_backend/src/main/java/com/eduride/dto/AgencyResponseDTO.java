package com.eduride.dto;

public class AgencyResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String contact;
    private String address;

    public AgencyResponseDTO(Long id, String name, String email, String contact, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.address = address;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContact() { return contact; }
    public String getAddress() { return address; }
}
