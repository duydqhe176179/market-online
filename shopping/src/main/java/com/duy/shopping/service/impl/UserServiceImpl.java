package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.*;
import com.duy.shopping.dto.ReportAccountDto;
import com.duy.shopping.dto.ReportProductDto;
import com.duy.shopping.model.Notification;
import com.duy.shopping.model.ReportAccount;
import com.duy.shopping.model.ReportProduct;
import com.duy.shopping.model.User;
import com.duy.shopping.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

import static com.duy.shopping.Constant.Constant.*;
import static com.duy.shopping.Constant.Constant.UNREAD;

import com.duy.shopping.Constant.CreateNotification;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ReportAccountRepository reportAccountRepository;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ReportProductRepository reportProductRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CreateNotification createNotification;

    @Override
    public ResponseEntity<?> updateUser(User newUser) {
        User u = userRepository.findById(newUser.getId()).get();
        u.setUsername(newUser.getUsername());
        u.setPassword(newUser.getPassword());
        u.setName(newUser.getName());
        u.setEmail(newUser.getEmail());
        u.setPhone(newUser.getPhone());
        u.setAddress(newUser.getAddress());
        u.setPickupAddress(newUser.getPickupAddress());
        u.setAvatar(newUser.getAvatar());
        u.setBirthday(newUser.getBirthday());

        userRepository.save(u);
        return ResponseEntity.ok().body("Cập nhật thành công");
    }

    @Override
    public ResponseEntity<?> changePassword(long idUser, String oldPassword, String newPassword, String confirmPassword) {
        User user = userRepository.findById(idUser);
        if (user == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy người dùng");
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng");
        }
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Xác nhận mật khẩu mới không khớp");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @Override
    public User reloadUser(long idUser) {
        return userRepository.findById(idUser);
    }

    @Override
    public ResponseEntity<?> changeStatusAccount(long idUser) {
        User user = userRepository.findById(idUser);
        if (user == null) {
            return null;
        }
        if (user.getStatus() == 0) {
            user.setStatus(1);
        } else user.setStatus(0);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> resetPassword(long idUser) {
        User user = userRepository.findById(idUser);
        if (user == null) {
            return null;
        }
        user.setPassword(passwordEncoder.encode(NEW_PASSWORD));
        userRepository.save(user);
        return ResponseEntity.ok().body("Mật khẩu mới là " + NEW_PASSWORD);
    }

    @Override
    public ResponseEntity<?> reportAccount(ReportAccountDto reportAccountDto) {
        ReportAccount reportAccount = new ReportAccount();
        User accuser = userRepository.findById(reportAccountDto.getIdAccuser());
        User accused = userRepository.findById(reportAccountDto.getIdAccused());

        reportAccount.setAccuser(accuser);
        reportAccount.setAccused(accused);
        reportAccount.setTitle(reportAccountDto.getTitle());
        reportAccount.setContent(reportAccountDto.getContent());
        reportAccount.setDateSend(new Date());
        reportAccount.setStatus(PENDING_REPORT);
        reportAccountRepository.save(reportAccount);

        createNotification.createNotification(10L, accuser.getAvatar(), "Tố cáo tài khoản", NOTI_ADMIN_NEW_REPORT_ACCOUNT, "/admin/reports");

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> reportProduct(ReportProductDto reportProductDto) {
        ReportProduct reportProduct = new ReportProduct();
        User accuser = userRepository.findById(reportProductDto.getIdAccuser());
        reportProduct.setAccuser(accuser);
        reportProduct.setProduct(productRepository.findByIdProduct(reportProductDto.getIdProduct()).get());
        reportProduct.setTitle(reportProductDto.getTitle());
        reportProduct.setContent(reportProductDto.getContent());
        reportProduct.setDateSend(new Date());
        reportProduct.setStatus(PENDING_REPORT);

        reportProductRepository.save(reportProduct);
        createNotification.createNotification(10L,accuser.getAvatar(),"Tố cáo sản phẩm",NOTI_ADMIN_NEW_REPORT_PRODUCT, "/admin/reports");
        return ResponseEntity.ok().build();
    }


}
