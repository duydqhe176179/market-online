package com.duy.shopping.repository;

import com.duy.shopping.model.HistoryWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HistoryWalletRepository extends JpaRepository<HistoryWallet, Long> {
    @Query("SELECT h FROM HistoryWallet h WHERE h.user.id = :idUser")
    List<HistoryWallet> findByIdUser(long idUser);

    @Query("SELECT h FROM HistoryWallet h WHERE h.code = :code")
    HistoryWallet findByCode(String code);
}
