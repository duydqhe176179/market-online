package com.duy.shopping.Repository;

import com.duy.shopping.model.RateProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RateRepository extends JpaRepository<RateProduct, Long> {
    @Query("SELECT r FROM RateProduct r WHERE r.product.idProduct = :id")
    List<RateProduct> findRateProductByIdProduct(@Param("id") long id);
}
