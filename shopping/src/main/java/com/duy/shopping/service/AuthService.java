package com.duy.shopping.service;

import com.duy.shopping.model.User;
import org.springframework.http.ResponseEntity;



public interface AuthService {

    ResponseEntity<?> signin(String headerData);
    ResponseEntity<?> signinAdmin(String headerData);
    ResponseEntity<?> signup(User newUser);
    ResponseEntity<?> sendOtpToReset(String email);
}
