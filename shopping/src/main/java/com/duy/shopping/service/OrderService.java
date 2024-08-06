package com.duy.shopping.service;

import com.duy.shopping.dto.OrderDto;
import com.duy.shopping.model.OrderItem;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderService {
    ResponseEntity<?> createOrder(OrderDto orderDto);
    List<OrderItem> getAllItemOfOrder(List<Long> idOrder);
    ResponseEntity<?> changeStatusOrder(long idOrder,String status);
}
