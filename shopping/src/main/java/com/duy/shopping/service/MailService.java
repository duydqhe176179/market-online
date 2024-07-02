package com.duy.shopping.service;

import org.springframework.http.ResponseEntity;

public interface MailService {
    public void sendOTPMail(String to);
    public ResponseEntity<?> verifyOTP(String email,String otp);
}
