package com.duy.shopping.Controller;

import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.model.User;
import com.duy.shopping.service.AuthService;
import com.duy.shopping.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class UserController {
    @Autowired
    private UserRepository repo;

    @Autowired
    private AuthService authService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MailService mailService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        return authService.signup(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return repo.findAll();
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestHeader(value = "Authorization") String headerData) {
        return authService.signin(headerData);
    }

    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestParam String email,@RequestParam String otp) {
        System.out.println(email);
        System.out.println(otp);
        return mailService.verifyOTP(email,otp);
    }

    @PostMapping("/sendOTP")
    public ResponseEntity<?> sendOTP(@RequestParam String email) {
        try {
            mailService.sendOTPMail(email);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
