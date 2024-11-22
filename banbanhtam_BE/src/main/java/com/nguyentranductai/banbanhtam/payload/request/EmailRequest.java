package com.nguyentranductai.banbanhtam.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmailRequest {
    @NotBlank
    @Email
    private String email;

    // Getters và Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
