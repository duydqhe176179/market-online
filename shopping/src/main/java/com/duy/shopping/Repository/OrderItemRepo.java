package com.duy.shopping.repository;

import com.duy.shopping.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
    Optional<OrderItem> findById(Long itemId);
}
