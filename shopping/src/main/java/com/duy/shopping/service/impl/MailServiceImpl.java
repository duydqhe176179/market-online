package com.duy.shopping.service.impl;

import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.model.User;
import com.duy.shopping.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private Map<String, String> otpMap = new HashMap<String, String>();
    private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Override
    public void sendOTPMail(String to) {
        String otp = generateOTP();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Xác thực OTP");
        message.setText("Vui lòng không chia sẻ mã này với bất cứ ai, mã sẽ hết hạn sau 5 phút, mã OTP là: " + otp);
        otpMap.put(to, otp);
        // xóa otp khỏi map sau 5 phút
        scheduler.schedule(() -> otpMap.remove(to), 5, TimeUnit.MINUTES);
        try {
            javaMailSender.send(message);
        } catch (Exception e) {
            System.out.println("error:" + e);
        }
    }

    @Override
    public void sendMail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            javaMailSender.send(message);
        } catch (Exception e) {
            System.out.println("error:" + e);
        }
    }

    @Override
    public ResponseEntity<?> verifyOTP(String email, String otp) {
        String codeOTP = otpMap.get(email);
        if (codeOTP == null) {
            return ResponseEntity.notFound().build();
        }
        if (codeOTP.equals(otp)) {
            otpMap.remove(email);
            User user = userRepository.findByEmail(email);
            user.setActiveEmail(true);
            userRepository.save(user);
            return ResponseEntity.ok("Verify OTP success");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verify OTP failed");
    }

    @Override
    public ResponseEntity<?> verifyResetPassword(String username, String email, String otp) {
        String codeOTP = otpMap.get(email);
        if (codeOTP == null) {
            return ResponseEntity.notFound().build();
        }
        if (codeOTP.equals(otp)) {
            otpMap.remove(email);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            if (!user.getUsername().equals(username)) {
                return ResponseEntity.notFound().build();
            }
            String newPassword = generateOTP();
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            userRepository.save(user);
            sendMail(email, "Đặt lại mật khẩu", "Mật khẩu mới cho tài khoản của bạn là: " + newPassword);
            return ResponseEntity.ok("Chúng tôi đã gửi mật khẩu mới đến email của bạn.");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verify OTP failed");
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
