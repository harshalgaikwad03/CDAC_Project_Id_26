package com.eduride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SchoolProfileDTO {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;

    // expose minimal agency info
    private AgencyDTO agency;

    @Data
    @AllArgsConstructor
    public static class AgencyDTO {
        private Long id;
        private String name;
    }
}
