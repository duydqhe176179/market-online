package com.duy.shopping.service;

import org.springframework.http.ResponseEntity;

public interface MailService {
    public void sendOTPMail(String to);

    public void sendMail(String to, String subject, String text);

    public ResponseEntity<?> verifyOTP(String email, String otp);

    public ResponseEntity<?> verifyResetPassword(String username,String email, String otp);
}
