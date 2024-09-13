package com.duy.shopping.service;

import com.duy.shopping.dto.TransferDto;
import com.duy.shopping.model.HistoryWallet;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface WalletService {
    List<HistoryWallet> getHistoryWallet(long idUser);

    void addHistoryWallet(HistoryWallet historyWallet);

    ResponseEntity<?> transferWallet(TransferDto transferDto);

    ResponseEntity<?> getHistoryByCode(String code);
}
