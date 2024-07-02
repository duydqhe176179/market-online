package com.duy.shopping.service.impl;

import com.duy.shopping.Constant.Constant;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.dto.UserDto;
import com.duy.shopping.model.User;
import com.duy.shopping.service.AuthService;
import com.duy.shopping.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomeUserDetailServiceImpl customeUserDetailService;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MailServiceImpl mailService;

    @Override
    public ResponseEntity<?> signin(String headerData) {
        UserDto userDto = new UserDto();
        String[] data = headerData.split(" ");
        byte[] decoded = Base64.getDecoder().decode(data[1]);
        String decodedString = new String(decoded, StandardCharsets.UTF_8);
        data = decodedString.split(":");
        userDto.setUsername(data[0]);
        userDto.setPassword(data[1]);
        System.out.println(userDto.getUsername() + " " + userDto.getPassword());
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.ok("Tên đăng nhập hoặc mật khẩu không đúng");
        } catch (Exception e) {
            return ResponseEntity.ok("Xảy ra lỗi khi đăng nhập");
        }
        final UserDetails userDetails = customeUserDetailService.loadUserByUsername(userDto.getUsername());
        final String token = jwtUtil.generateToken(userDetails);
        System.out.println(token);
        User user = userRepository.findByUsername(userDto.getUsername());
        user.setToken(token);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<?> signup(User newUser) {
        if (newUser.getEmail() != null && !newUser.getEmail().isEmpty()) {
            if (userRepository.findByEmail(newUser.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email đã tồn tại, vui lòng chọn email khác");
            }
            try {
                mailService.sendOTPMail(newUser.getEmail());
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP email");
            }
        }
        newUser.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));
        newUser.setRole("USER");
        newUser.setActiveEmail(false);
        userRepository.save(newUser);
        return ResponseEntity.ok(newUser);
    }
}
