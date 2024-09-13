package com.duy.shopping.controller;

import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.dto.ReportAccountDto;
import com.duy.shopping.dto.ReportProductDto;
import com.duy.shopping.model.User;
import com.duy.shopping.service.AuthService;
import com.duy.shopping.service.MailService;
import com.duy.shopping.service.NotificationService;
import com.duy.shopping.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.duy.shopping.constant.Constant.URL_ORIGIN;

@RestController
@CrossOrigin(URL_ORIGIN)
public class UserController {
    @Autowired
    private UserRepository repo;

    @Autowired
    private AuthService authService;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        return authService.signup(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/reloadUser")
    public ResponseEntity<?> reloadUser(@RequestParam long idUser) {
        return ResponseEntity.ok(userService.reloadUser(idUser));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestHeader(value = "Authorization") String headerData) {
        return authService.signin(headerData);
    }

    @PostMapping("/signinAdmin")
    public ResponseEntity<?> signinAdmin(@RequestHeader(value = "Authorization") String headerData) {
        return authService.signinAdmin(headerData);
    }

    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestParam String email, @RequestParam String otp) {
        System.out.println(email);
        System.out.println(otp);
        return mailService.verifyOTP(email, otp);
    }

    @PostMapping("/sendOtpToReset")
    public ResponseEntity<?> sendOtpToReset(@RequestParam String email) {
        try {
            authService.sendOtpToReset(email);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam String username, @RequestParam String email,@RequestParam String otp) {
        return mailService.verifyResetPassword(username,email,otp);
    }

    @PostMapping("/sendOTP")
    public ResponseEntity<?> sendOTP(@RequestParam String email) {
        try {
            mailService.sendOTPMail(email);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/user/updateUser")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser) {
        return userService.updateUser(updatedUser);
    }

    @PostMapping("/user/updatePhone")
    public ResponseEntity<?> updatePhone(@RequestBody User updatedUser) {
        return userService.updatePhone(updatedUser);
    }

    @GetMapping("/user/getUserByPhone")
    public ResponseEntity<?> getUserByPhone(@RequestParam String phone) {
        return userService.getUserByPhone(phone);
    }

    @PostMapping("/user/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody List<String> changePassword) {
        return userService.changePassword(Long.parseLong(changePassword.get(0)), changePassword.get(1), changePassword.get(2), changePassword.get(3));
    }

    @PostMapping("/reportAccount")
    public ResponseEntity<?> reportAccount(@RequestBody ReportAccountDto reportAccountDto) {
        return userService.reportAccount(reportAccountDto);
    }

    @PostMapping("/reportProduct")
    public ResponseEntity<?> reportProduct(@RequestBody ReportProductDto reportProductDto) {
        return userService.reportProduct(reportProductDto);
    }

    @PostMapping("/user/notification")
    public ResponseEntity<?> getAllNotifications(@RequestParam long idUser) {
        return notificationService.getNotificationsByUserId(idUser);
    }
}
