package com.duy.shopping.controller;

import com.duy.shopping.repository.OrderInfoRepo;
import com.duy.shopping.repository.OrderItemRepo;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.service.AdminService;
import com.duy.shopping.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.duy.shopping.constant.Constant.URL_ORIGIN;

@RestController
@CrossOrigin(URL_ORIGIN)
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/changeStatusAccount")
    ResponseEntity<?> changeStatusAccount(@RequestParam long idUser) {
        return userService.changeStatusAccount(idUser);
    }

    @PostMapping("/resetPassword")
    ResponseEntity<?> resetPassword(@RequestParam long idUser) {
        return userService.resetPassword(idUser);
    }

    @PostMapping("/agreeProduct")
    ResponseEntity<?> agreeProduct(@RequestParam long idProduct) {
        return adminService.agreeProduct(idProduct);
    }

    @PostMapping("/rejectProduct")
    ResponseEntity<?> rejectProduct(@RequestParam long idProduct, @RequestParam String reasonReject) {
        return adminService.rejectProduct(idProduct, reasonReject);
    }

    @GetMapping("/allOrder")
    ResponseEntity<?> getAllOrder() {
        return adminService.getAllOrder();
    }

    @GetMapping("/allOrderItem")
    ResponseEntity<?> getAllOrderItem() {
        return adminService.getAllOrderItem();
    }

    @GetMapping("/allReportAccount")
    ResponseEntity<?> getAllReportAccount() {
        return adminService.getAllReportAccount();
    }

    @PostMapping("/acceptReportAccount")
    ResponseEntity<?> acceptReportAccount(@RequestParam long idReportAccount, @RequestParam long idUser, @RequestParam int timeLockAccount) {
        return adminService.acceptReportAccount(idReportAccount, idUser, timeLockAccount);
    }

    @PostMapping("/rejectReportAccount")
    ResponseEntity<?> rejectReport(@RequestParam long idReport, @RequestParam String reasonReject) {
        return adminService.rejectReportAccount(idReport, reasonReject);
    }

    @GetMapping("/allReportProduct")
    ResponseEntity<?> getAllReportProduct() {
        return adminService.getAllReportProduct();
    }

    @PostMapping("/acceptReportProduct")
    ResponseEntity<?> acceptReportProduct(@RequestParam long idReportProduct) {
        return adminService.acceptReportProduct(idReportProduct);
    }

    @PostMapping("/rejectReportProduct")
    ResponseEntity<?> rejectReportProduct(@RequestParam long idReport, @RequestParam String reasonReject) {
        return adminService.rejectReportProduct(idReport, reasonReject);
    }

}
