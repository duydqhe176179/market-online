package com.duy.shopping.service.impl;

import com.duy.shopping.constant.CreateNotification;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.repository.OrderInfoRepo;
import com.duy.shopping.repository.OrderItemRepo;
import com.duy.shopping.repository.ProductRepository;
import com.duy.shopping.repository.ReportAccountRepository;
import com.duy.shopping.repository.ReportProductRepository;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.ReportAccount;
import com.duy.shopping.model.ReportProduct;
import com.duy.shopping.model.User;
import com.duy.shopping.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.duy.shopping.constant.Constant.ACCEPT_REPORT;
import static com.duy.shopping.constant.Constant.ICON_NOTI_BLOCKED_ACCOUNT;
import static com.duy.shopping.constant.Constant.NOTI_HANDLE_REPORT;
import static com.duy.shopping.constant.Constant.NOTI_LOCKED_PRODUCT;
import static com.duy.shopping.constant.Constant.NOTI_SHOP_ACCEPT_PRODUCT;
import static com.duy.shopping.constant.Constant.NOTI_SHOP_REJECT_PRODUCT;
import static com.duy.shopping.constant.Constant.NOTI_THANKS_REPORT;
import static com.duy.shopping.constant.Constant.REJECT_REPORT;

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
    @Autowired
    private CreateNotification createNotification;
    @Autowired
    private OrderInfoRepo orderInfoRepo;
    @Autowired
    private OrderItemRepo orderItemRepo;

    @Override
    public ResponseEntity<?> agreeProduct(long idProduct) {
        Product product = productRepository.findByIdProduct(idProduct).get();
        product.setStatus("ok");
        productRepository.save(product);
        createNotification.createNotification(product.getShop().getId(),product.getImage().get(0),NOTI_SHOP_ACCEPT_PRODUCT,NOTI_SHOP_ACCEPT_PRODUCT,"/seller");
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> rejectProduct(long idProduct, String reasonReject) {
        Product product = productRepository.findByIdProduct(idProduct).get();
        product.setStatus("Từ chối");
        product.setReasonReject(reasonReject);
        productRepository.save(product);

        createNotification.createNotification(product.getShop().getId(),product.getImage().get(0),NOTI_SHOP_REJECT_PRODUCT,"Sản phẩm của bạn không đạt đủ yêu cầu của chúng tôi, vui lòng thử lại sau.","/seller");
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> rejectReportAccount(long idReport, String reasonReject) {
        ReportAccount reportAccount = reportAccountRepository.findById(idReport);
        reportAccount.setStatus(REJECT_REPORT);
        reportAccount.setReasonReject(reasonReject);

        reportAccountRepository.save(reportAccount);
        createNotification.createNotification(reportAccount.getAccuser().getId(), reportAccount.getAccused().getAvatar(), NOTI_HANDLE_REPORT, reasonReject + NOTI_THANKS_REPORT, null);
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
        if(timeLockAccount != 0){
            reportAccount.setContent(reportAccount.getContent()+" Khóa tài khoản "+timeLockAccount+" ngày");
        }else{
            reportAccount.setContent(reportAccount.getContent()+" Khóa vĩnh viễn");
        }
        reportAccount.setStatus(ACCEPT_REPORT);
        reportAccountRepository.save(reportAccount);

        User accused = userRepository.findById(idUser);
        //khóa account sau 2h nữa
        autoUnlockAccount.scheduleLock(idUser);

        // tạo noti
        createNotification.createNotification(reportAccount.getAccuser().getId(), reportAccount.getAccused().getAvatar(), NOTI_HANDLE_REPORT, "Chúng tôi đã khóa tài khoản này. " + NOTI_THANKS_REPORT, null);
        createNotification.createNotification(reportAccount.getAccused().getId(), ICON_NOTI_BLOCKED_ACCOUNT, NOTI_HANDLE_REPORT, "Tài khoản của bạn sẽ bị khóa trong " + timeLockAccount + " ngày sau 2 giờ nữa", null);

        // nếu có timeLockAccount thì mở khóa sau timeLockAccount ngày, nếu ko thì khóa vĩnh viễn
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
        createNotification.createNotification(reportProduct.getAccuser().getId(), reportProduct.getProduct().getImage().get(0), NOTI_HANDLE_REPORT, reasonReject + NOTI_THANKS_REPORT, null);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> acceptReportProduct(long idReportAccount) {
        ReportProduct reportProduct = reportProductRepository.findById(idReportAccount);
        reportProduct.setStatus(ACCEPT_REPORT);
        reportProductRepository.save(reportProduct);

        Product lockProduct = reportProduct.getProduct();
        // tạo noti cho người tố cáo
        createNotification.createNotification(reportProduct.getAccuser().getId(), lockProduct.getImage().get(0), NOTI_HANDLE_REPORT, "Chúng tôi đã khóa sản phẩm này. " + NOTI_THANKS_REPORT, null);
        //tạo noti cho người có sản phẩm bị khóa
        createNotification.createNotification(lockProduct.getShop().getId(), lockProduct.getImage().get(0), NOTI_LOCKED_PRODUCT, "Sản phẩm này bị khóa vì chúng tôi tìm thấy lý do sau: " + reportProduct.getTitle(), "/seller");
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getAllOrder() {
        List<OrderInfo> list = orderInfoRepo.findAll();
        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<?> getAllOrderItem() {
        List<OrderItem> list = orderItemRepo.findAll();
        return ResponseEntity.ok(list);
    }
}
