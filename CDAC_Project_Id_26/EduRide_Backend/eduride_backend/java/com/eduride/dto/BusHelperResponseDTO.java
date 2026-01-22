package com.eduride.dto;

public class BusHelperResponseDTO {

    private Long id;
    private String name;
    private String phone;
    private String email;

    public BusHelperResponseDTO(Long id, String name,
                                String phone, String email) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    // getters only
}
