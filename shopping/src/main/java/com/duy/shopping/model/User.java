package com.duy.shopping.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @NotBlank
    private String password;

    private String name;
    private String email;
    private String phone;
    private String address;
    private String pickupAddress; //địa chỉ lấy hàng
    private String avatar;
    private String role;
    private String token;
    private boolean isActiveEmail;
    private Date dateSignup;
    private LocalDate birthday;
    private int status;
}
