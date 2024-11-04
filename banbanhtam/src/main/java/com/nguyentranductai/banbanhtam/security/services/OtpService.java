package com.nguyentranductai.banbanhtam.security.services;

import com.nguyentranductai.banbanhtam.model.OtpToken;
import com.nguyentranductai.banbanhtam.repository.OtpTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpTokenRepository otpTokenRepository;

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpToken otpToken = new OtpToken(email, otp, LocalDateTime.now().plusMinutes(5));
        otpTokenRepository.save(otpToken);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        Optional<OtpToken> otpToken = otpTokenRepository.findByEmailAndOtp(email, otp);
        return otpToken.isPresent() && otpToken.get().getExpirationTime().isAfter(LocalDateTime.now());
    }
}