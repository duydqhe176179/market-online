package com.duy.shopping.Controller;

import com.duy.shopping.Repository.OrderInfoRepo;
import com.duy.shopping.Repository.OrderItemRepo;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.model.ReportAccount;
import com.duy.shopping.service.AdminService;
import com.duy.shopping.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private OrderInfoRepo orderInfoRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @PostMapping("/admin/changeStatusAccount")
    ResponseEntity<?> changeStatusAccount(@RequestParam long idUser) {
        return userService.changeStatusAccount(idUser);
    }

    @PostMapping("/admin/resetPassword")
    ResponseEntity<?> resetPassword(@RequestParam long idUser) {
        return userService.resetPassword(idUser);
    }

    @PostMapping("/admin/agreeProduct")
    ResponseEntity<?> agreeProduct(@RequestParam long idProduct) {
        return adminService.agreeProduct(idProduct);
    }

    @PostMapping("/admin/rejectProduct")
    ResponseEntity<?> rejectProduct(@RequestParam long idProduct, @RequestParam String reasonReject) {
        return adminService.rejectProduct(idProduct, reasonReject);
    }

    @GetMapping("/admin/allOrder")
    ResponseEntity<?> getAllOrder() {
        List<OrderInfo> list = orderInfoRepo.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/admin/allOrderItem")
    ResponseEntity<?> getAllOrderItem() {
        List<OrderItem> list = orderItemRepo.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/admin/allReportAccount")
    ResponseEntity<?> getAllReportAccount() {
        return adminService.getAllReportAccount();
    }

    @PostMapping("/admin/acceptReportAccount")
    ResponseEntity<?> acceptReportAccount(@RequestParam long idReportAccount, @RequestParam long idUser, @RequestParam int timeLockAccount) {
        return adminService.acceptReportAccount(idReportAccount, idUser, timeLockAccount);
    }

    @PostMapping("/admin/rejectReportAccount")
    ResponseEntity<?> rejectReport(@RequestParam long idReport, @RequestParam String reasonReject) {
        return adminService.rejectReportAccount(idReport, reasonReject);
    }

    @GetMapping("/admin/allReportProduct")
    ResponseEntity<?> getAllReportProduct() {
        return adminService.getAllReportProduct();
    }

    @PostMapping("/admin/rejectReportProduct")
    ResponseEntity<?> rejectReportProduct(@RequestParam long idReport, @RequestParam String reasonReject) {
        return adminService.rejectReportProduct(idReport, reasonReject);
    }

}
