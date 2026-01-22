package com.eduride.dto;

public class StudentResponseDTO {

    private Long id;
    private String name;
    private String className;
    private String rollNo;
    private String email;
    private String address;
    private String passStatus;

    public StudentResponseDTO(Long id, String name, String className,
                              String rollNo, String email,
                              String address, String passStatus) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.rollNo = rollNo;
        this.email = email;
        this.address = address;
        this.passStatus = passStatus;
    }

    // getters only
}
