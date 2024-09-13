package com.duy.shopping.controller;

import com.duy.shopping.constant.CreateNotification;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.config.ConfigVnPay;
import com.duy.shopping.dto.PaymentRestDTO;
import com.duy.shopping.dto.TransferDto;
import com.duy.shopping.model.HistoryWallet;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.User;
import com.duy.shopping.service.WalletService;
import com.duy.shopping.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.duy.shopping.constant.Constant.NOTI_DEPOSIT_SUCCESS;
import static com.duy.shopping.constant.Constant.URL_ORIGIN;
import static com.duy.shopping.config.ConfigVnPay.vnp_Command;
import static com.duy.shopping.config.ConfigVnPay.vnp_ReturnUrl;
import static com.duy.shopping.config.ConfigVnPay.vnp_TmnCode;
import static com.duy.shopping.config.ConfigVnPay.vnp_Version;

@RestController
@CrossOrigin(URL_ORIGIN)
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private HttpServletRequest req;
    @Autowired
    private OrderService orderService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CreateNotification createNotification;
    @Autowired
    private WalletService walletService;

    @PostMapping("/create_payment")
    public ResponseEntity<?> createPayment(@RequestBody List<Long> listIdOrder) throws UnsupportedEncodingException {

//        String orderType = "other";
        List<OrderInfo> listOrder = orderService.getOrders(listIdOrder);
        int amount = 0;
        for (OrderInfo orderInfo : listOrder) {
            amount += orderInfo.getTotalOrder();
        }
        String vnp_TxnRef = ConfigVnPay.getRandomNumber(8);
        String vnp_IpAddr = ConfigVnPay.getIpAddress(req);


        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        if (listOrder.size() == 1) {
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + listOrder.get(0).getCode());
        } else {
            String codeOrders = "";
            for (OrderInfo orderInfo : listOrder) {
                codeOrders += orderInfo.getCode() + " ";
            }
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + codeOrders);
        }
        vnp_Params.put("vnp_OrderType", "100");
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = ConfigVnPay.hmacSHA512(ConfigVnPay.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = ConfigVnPay.vnp_PayUrl + "?" + queryUrl;

        PaymentRestDTO paymentRestDTO = new PaymentRestDTO();
        paymentRestDTO.setStatus("ok");
        paymentRestDTO.setMessage("Successfully");
        paymentRestDTO.setURL(paymentUrl);

        return ResponseEntity.status(HttpStatus.OK).body(paymentRestDTO);
    }

    @PostMapping("/payment-response-info")
    public ResponseEntity<?> paymentOrderInfo(
            @RequestParam String vnp_OrderInfo,
            @RequestParam String vnp_ResponseCode
    ) {
        if (vnp_ResponseCode.equals("00")) {
            String[] parts = vnp_OrderInfo.split(":")[1].trim().split("\\s+");
            // Lọc để chỉ lấy các phần tử có độ dài 10
            String[] arrayOrderCode = Arrays.stream(parts)
                    .filter(part -> part.length() == 10)
                    .toArray(String[]::new);
            orderService.paySuccess(arrayOrderCode);
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestParam int money, @RequestParam long idUser) throws UnsupportedEncodingException {
        User user = userRepository.findById(idUser);

        String vnp_TxnRef = ConfigVnPay.getRandomNumber(8);
        String vnp_IpAddr = ConfigVnPay.getIpAddress(req);


        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Nap tien vao tai khoan: " + user.getUsername());
        vnp_Params.put("vnp_OrderType", "100");
        vnp_Params.put("vnp_Amount", String.valueOf(money * 100));
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:3000/deposit-response-info");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = ConfigVnPay.hmacSHA512(ConfigVnPay.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = ConfigVnPay.vnp_PayUrl + "?" + queryUrl;

        PaymentRestDTO paymentRestDTO = new PaymentRestDTO();
        paymentRestDTO.setStatus("ok");
        paymentRestDTO.setMessage("Successfully");
        paymentRestDTO.setURL(paymentUrl);

        return ResponseEntity.status(HttpStatus.OK).body(paymentRestDTO);
    }

    @PostMapping("/deposit-response-info")
    public ResponseEntity<?> depositInfo(
            @RequestParam String vnp_OrderInfo,
            @RequestParam int vnp_Amount,
            @RequestParam String vnp_ResponseCode
    ) {
        if (vnp_ResponseCode.equals("00")) {
            String username = vnp_OrderInfo.split(":")[1].trim();
            User user = userRepository.findByUsername(username);
            user.setWallet(user.getWallet() + vnp_Amount / 100);
            userRepository.save(user);
            // tạo noti
            createNotification.createNotification(user.getId(), "../images/icon/deposit.png", NOTI_DEPOSIT_SUCCESS, "Nhấn để xem chi tiết", "/user/wallet");
            // tạo lịch sử giao dịch
            HistoryWallet historyWallet=new HistoryWallet();
            historyWallet.setUser(user);
            historyWallet.setTitle("Nạp tiền");
            historyWallet.setStatus("DEPOSIT");
            historyWallet.setMoney(vnp_Amount/100);
            historyWallet.setNewBalance(user.getWallet());
            historyWallet.setDate(new Date());
            walletService.addHistoryWallet(historyWallet);
            //
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferWallet(@RequestBody TransferDto transferDto) {
        return null;
    }
}
