package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.model.User;
import com.duy.shopping.service.MailService;
import com.duy.shopping.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private UserRepository userRepository;

    private Map<String, String> otpMap = new HashMap<String, String>();

    @Override
    public void sendOTPMail(String to) {
        String otp = generateOTP();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Xác thực OTP");
        message.setText("Vui lòng không chia sẻ mã này với bất cứ ai, mã OTP là: " + otp);
        otpMap.put(to, otp);
        try {
            javaMailSender.send(message);
        } catch (Exception e) {
            System.out.println("error:" + e);
        }
    }

    @Override
    public ResponseEntity<?> verifyOTP(String email, String otp) {
        String codeOTP = otpMap.get(email);
        if (codeOTP != null && codeOTP.equals(otp)) {
            otpMap.remove(email);
            User user = userRepository.findByEmail(email);
            user.setActiveEmail(true);
            userRepository.save(user);
            return ResponseEntity.ok("Verify OTP success");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verify OTP failed");
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
