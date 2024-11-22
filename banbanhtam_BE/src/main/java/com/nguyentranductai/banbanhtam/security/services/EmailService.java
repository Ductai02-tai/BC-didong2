package com.nguyentranductai.banbanhtam.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP đặt lại mật khẩu");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã này sẽ hết hạn sau 5 phút.");
        mailSender.send(message);
    }
}