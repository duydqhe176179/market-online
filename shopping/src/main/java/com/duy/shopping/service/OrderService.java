package com.duy.shopping.service;

import com.duy.shopping.dto.OrderDto;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderService {
    ResponseEntity<?> createOrder(OrderDto orderDto);

    ResponseEntity<?> getAllOrdersInfo(long idUser);

    ResponseEntity<?> getAllItemFromOrderOfUser(long idUser);

    ResponseEntity<?> getOrderInfo(long orderId);

    ResponseEntity<?> getItemsOfOrder(long orderId);

    List<OrderItem> getAllItemOfOrder(List<Long> idOrder);

    ResponseEntity<?> changeStatusOrder(long idOrder, String status);

    ResponseEntity<?> cancelOrder(long idOrder);

    List<OrderInfo> getOrders(List<Long> idOrder);

    ResponseEntity<?> paySuccess(String[] idOrder);
    List<OrderInfo> getAllOrderOfShop(long idShop);
}
