package com.duy.shopping.Repository;

import com.duy.shopping.model.ReportAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportAccountRepository extends JpaRepository<ReportAccount, Long> {
    ReportAccount findById(long id);
}
