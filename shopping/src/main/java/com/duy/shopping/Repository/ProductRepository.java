package com.duy.shopping.Repository;

import com.duy.shopping.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    public Optional<Product> findByIdProduct(long idProduct);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :id")
    public List<Product> findByIdShop(@Param("id") long idShop);
}
