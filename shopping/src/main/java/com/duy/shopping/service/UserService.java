package com.duy.shopping.service;

import com.duy.shopping.dto.ReportAccountDto;
import com.duy.shopping.dto.ReportProductDto;
import com.duy.shopping.model.User;
import org.springframework.http.ResponseEntity;


public interface UserService {
    ResponseEntity<?> updateUser(User user);

    ResponseEntity<?> changePassword(long idUser, String oldPassword, String newPassword, String confirmPassword);

    User reloadUser(long idUser);

    ResponseEntity<?> changeStatusAccount(long idUser);

    ResponseEntity<?> resetPassword(long idUser);

    ResponseEntity<?> reportAccount(ReportAccountDto reportAccountDto);

    ResponseEntity<?> reportProduct(ReportProductDto reportProductDto);

}
