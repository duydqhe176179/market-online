package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.ReportAccountRepository;
import com.duy.shopping.Repository.ReportProductRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.ReportAccount;
import com.duy.shopping.model.ReportProduct;
import com.duy.shopping.model.User;
import com.duy.shopping.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.duy.shopping.Constant.Constant.ACCEPT_REPORT;
import static com.duy.shopping.Constant.Constant.REJECT_REPORT;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ReportAccountRepository reportAccountRepository;
    @Autowired
    private ReportProductRepository reportProductRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AutoUnlockAccount autoUnlockAccount;

    @Override
    public ResponseEntity<?> agreeProduct(long idProduct) {
        Product product = productRepository.findByIdProduct(idProduct).get();
        product.setStatus("ok");
        productRepository.save(product);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> rejectProduct(long idProduct, String reasonReject) {
        Product product = productRepository.findByIdProduct(idProduct).get();
        product.setStatus("Từ chối");
        product.setReasonReject(reasonReject);
        productRepository.save(product);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> rejectReportAccount(long idReport, String reasonReject) {
        ReportAccount reportAccount = reportAccountRepository.findById(idReport);
        reportAccount.setStatus(REJECT_REPORT);
        reportAccount.setReasonReject(reasonReject);

        reportAccountRepository.save(reportAccount);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getAllReportAccount() {
        List<ReportAccount> list = reportAccountRepository.findAll();
        return ResponseEntity.ok().body(list);
    }

    @Override
    public ResponseEntity<?> getAllReportProduct() {
        List<ReportProduct> list = reportProductRepository.findAll();
        return ResponseEntity.ok().body(list);
    }

    @Override
    public ResponseEntity<?> acceptReportAccount(long idReportAccount, long idUser, int timeLockAccount) {
        ReportAccount reportAccount = reportAccountRepository.findById(idReportAccount);
        reportAccount.setStatus(ACCEPT_REPORT);
        reportAccountRepository.save(reportAccount);

        User accused = userRepository.findById(idUser);
        accused.setStatus(0);
        userRepository.save(accused);

        if (timeLockAccount != 0) {
            autoUnlockAccount.scheduleUnlock(idUser, timeLockAccount);
        }
        return ResponseEntity.ok().body("Tài khoản đã bị khóa trong " + timeLockAccount + " ngày");
    }

    @Override
    public ResponseEntity<?> rejectReportProduct(long idReportProduct, String reasonReject) {
        ReportProduct reportProduct = reportProductRepository.findById(idReportProduct);
        reportProduct.setStatus(REJECT_REPORT);
        reportProduct.setReasonReject(reasonReject);

        reportProductRepository.save(reportProduct);
        return ResponseEntity.ok().build();
    }
}
