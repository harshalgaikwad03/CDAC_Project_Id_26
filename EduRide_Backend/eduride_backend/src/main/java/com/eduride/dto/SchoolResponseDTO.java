package com.eduride.dto;

public class SchoolResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;

    public SchoolResponseDTO(Long id, String name, String email, String contact, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = contact;
        this.address = address;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContact() { return phone; }
    public String getAddress() { return address; }
}
