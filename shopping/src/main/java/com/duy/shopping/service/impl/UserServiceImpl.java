package com.duy.shopping.service.impl;

import com.duy.shopping.repository.ProductRepository;
import com.duy.shopping.repository.ReportAccountRepository;
import com.duy.shopping.repository.ReportProductRepository;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.dto.ReportAccountDto;
import com.duy.shopping.dto.ReportProductDto;
import com.duy.shopping.model.ReportAccount;
import com.duy.shopping.model.ReportProduct;
import com.duy.shopping.model.User;
import com.duy.shopping.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static com.duy.shopping.constant.Constant.NEW_PASSWORD;
import static com.duy.shopping.constant.Constant.NOTI_ADMIN_NEW_REPORT_ACCOUNT;
import static com.duy.shopping.constant.Constant.NOTI_ADMIN_NEW_REPORT_PRODUCT;
import static com.duy.shopping.constant.Constant.PASSWORD;
import static com.duy.shopping.constant.Constant.PENDING_REPORT;

import com.duy.shopping.constant.CreateNotification;

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
    private CreateNotification createNotification;

    @Override
    public ResponseEntity<?> updateUser(User newUser) {
        User u = userRepository.findById(newUser.getId()).get();

        u.setPhone(newUser.getPhone());
        u.setUsername(newUser.getUsername());
        u.setPassword(newUser.getPassword());
        u.setName(newUser.getName());
        u.setEmail(newUser.getEmail());
        u.setAddress(newUser.getAddress());
        u.setPickupAddress(newUser.getPickupAddress());
        u.setAvatar(newUser.getAvatar());
        u.setBirthday(newUser.getBirthday());

        userRepository.save(u);
        return ResponseEntity.ok().body("Cập nhật thành công");
    }

    @Override
    public ResponseEntity<?> updatePhone(User newUser) {
        User u = userRepository.findById(newUser.getId()).get();
        if (userRepository.findByPhone(newUser.getPhone()) != null) {
            return ResponseEntity.badRequest().body("Số điện thoại đã được sử dụng");
        }
        u.setPhone(newUser.getPhone());

        userRepository.save(u);
        return ResponseEntity.ok().body("Cập nhật thành công");
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
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
        if (!PASSWORD.matcher(newPassword).matches()) {
            return ResponseEntity.badRequest().body("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ số và có độ dài tối thiểu 8 ký tự");
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
    public ResponseEntity<?> getUserByPhone(String phone) {
        User user = userRepository.findByPhone(phone);
        if (user == null) {
            ResponseEntity.badRequest().body("Không tìm thấy tài khoản");
        }
        return ResponseEntity.ok().body(user);
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
        createNotification.createNotification(10L, accuser.getAvatar(), "Tố cáo sản phẩm", NOTI_ADMIN_NEW_REPORT_PRODUCT, "/admin/reports");
        return ResponseEntity.ok().build();
    }


}
