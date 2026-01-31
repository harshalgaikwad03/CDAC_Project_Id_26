package com.eduride.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StudentSignupDTO(

    @NotBlank
    String name,

    @Email
    @NotBlank
    String email,

   // @Size(min = 8, message = "Password must be at least 8 characters")
    String password,

    @NotBlank
    String phone,

    @NotBlank
    String rollNo,

    @NotBlank
    String className,

    @NotBlank
    String address,

    @NotNull
    Long schoolId,

    Long busId   // optional
) {}
