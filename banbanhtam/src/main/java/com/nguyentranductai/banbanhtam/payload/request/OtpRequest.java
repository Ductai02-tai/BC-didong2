package com.nguyentranductai.banbanhtam.payload.request;

import jakarta.validation.constraints.NotBlank;

public class OtpRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String otp;

    // Getters và Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
