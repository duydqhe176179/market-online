package com.duy.shopping.service.impl;

import com.duy.shopping.constant.CreateHistoryWallet;
import com.duy.shopping.constant.CreateNotification;
import com.duy.shopping.repository.HistoryWalletRepository;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.dto.TransferDto;
import com.duy.shopping.model.HistoryWallet;
import com.duy.shopping.model.User;
import com.duy.shopping.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WalletServiceImpl implements WalletService {
    @Autowired
    private HistoryWalletRepository historyWalletRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CreateNotification createNotification;
    @Autowired
    private CreateHistoryWallet createHistoryWallet;


    @Override
    public List<HistoryWallet> getHistoryWallet(long idUser) {
        return historyWalletRepository.findByIdUser(idUser);
    }

    @Override
    public void addHistoryWallet(HistoryWallet historyWallet) {
        historyWalletRepository.save(historyWallet);
    }

    @Override
    public ResponseEntity<?> transferWallet(TransferDto transferDto) {
        User user = userRepository.findById(transferDto.getIdUser());
        if (!passwordEncoder.matches(transferDto.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu không đúng");
        }
        User receiver = userRepository.findByPhone(transferDto.getPhoneReceiveMoney());
        if (receiver == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy người nhận");
        }
        if(user.getWallet()< transferDto.getMoney()){
            return ResponseEntity.badRequest().body("Không đủ số dư tài khoản");
        }
        //người gửi
        user.setWallet(user.getWallet() - transferDto.getMoney());
        userRepository.save(user);
        //tạo noti
        createNotification.createNotification(user.getId(), "../images/icon/transfer.png", "Chuyển tiền", "Nhấn để xem chi tiết", "/user/wallet");
        // tạo lịch sử giao dịch
        createHistoryWallet.createHistoryWallet(user.getId(), "Chuyển tiền", "TRANSFER", transferDto.getMoney(), user.getWallet());

        //người nhận
        receiver.setWallet(receiver.getWallet() + transferDto.getMoney());
        userRepository.save(receiver);
        //tạo noti
        createNotification.createNotification(receiver.getId(), "../images/icon/deposit.png", "Nhận tiền", "Nhấn để xem chi tiết", "/user/wallet");
        // tạo lịch sử giao dịch
        createHistoryWallet.createHistoryWallet(receiver.getId(), "Nhận tiền", "RECEIVE", transferDto.getMoney(), receiver.getWallet());

        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getHistoryByCode(String code) {
        HistoryWallet historyWallet = historyWalletRepository.findByCode(code);
        if (historyWallet == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy giao dịch này");
        } else {
            return ResponseEntity.ok(historyWallet);
        }
    }
}
