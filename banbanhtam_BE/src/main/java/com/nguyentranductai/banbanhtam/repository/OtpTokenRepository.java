package com.nguyentranductai.banbanhtam.repository;

import com.nguyentranductai.banbanhtam.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findByEmailAndOtp(String email, String otp);
    void deleteByExpirationTimeBefore(LocalDateTime now);
}
