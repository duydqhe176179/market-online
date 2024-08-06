package com.duy.shopping.Repository;

import com.duy.shopping.model.ReportAccount;
import com.duy.shopping.model.ReportProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportProductRepository extends JpaRepository<ReportProduct, Long> {
    ReportProduct findById(long id);
}
