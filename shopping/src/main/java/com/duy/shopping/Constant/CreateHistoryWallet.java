package com.duy.shopping.constant;

import com.duy.shopping.repository.HistoryWalletRepository;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.model.HistoryWallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Random;

@Service
public class CreateHistoryWallet {
    private static final String CHARACTERS="0123456789";
    private static final Random RANDOM = new SecureRandom();
    @Autowired
    private HistoryWalletRepository historyWalletRepository;
    @Autowired
    private UserRepository userRepository;

    public final void createHistoryWallet(Long idUser, String title, String status, int money, int newBalance) {
        HistoryWallet historyWallet = new HistoryWallet();
        historyWallet.setUser(userRepository.findById(idUser).get());
        historyWallet.setCode(createCode(12));
        historyWallet.setTitle(title);
        historyWallet.setStatus(status);
        historyWallet.setMoney(money);
        historyWallet.setNewBalance(newBalance);
        historyWallet.setDate(new Date());
        historyWalletRepository.save(historyWallet);
    }

    public String createCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }
}
