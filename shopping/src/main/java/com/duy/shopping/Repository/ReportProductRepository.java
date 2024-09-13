package com.duy.shopping.repository;

import com.duy.shopping.model.ReportProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportProductRepository extends JpaRepository<ReportProduct, Long> {
    ReportProduct findById(long id);
}
