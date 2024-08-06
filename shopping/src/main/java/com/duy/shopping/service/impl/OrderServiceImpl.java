package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.*;
import com.duy.shopping.dto.OrderDto;
import com.duy.shopping.dto.OrderItemDto;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.model.Product;
import com.duy.shopping.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.duy.shopping.Constant.Constant.*;
import static com.duy.shopping.config.createCode.createCode;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderInfoRepo orderInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepo orderItemRepository;


    @Override
    public ResponseEntity<?> createOrder(OrderDto orderDto) {
        long userId = orderDto.getUserId();
        List<OrderItemDto> orderItems = orderDto.getOrderItems();
        Set<Long> uniqueIdShops = orderItems.stream()
                .map(OrderItemDto::getShopId) // Extract idShop from each order
                .collect(Collectors.toSet()); // Collect into a set to ensure uniqueness

        // Convert the set back to a list (optional)
        List<Long> uniqueIdShopList = new ArrayList<>(uniqueIdShops);
        for (Long shopId : uniqueIdShopList) {
            OrderInfo orderInfo = new OrderInfo();
            orderInfo.setUser(userRepository.findById(userId));
            orderInfo.setShop(userRepository.findById(shopId).get());
            orderInfo.setStatus(WAIT_FOR_CONFIRM_ORDER);
            orderInfo.setCreateDate(new Date());
            orderInfo.setPayMethod(orderDto.getPayMethod());
            long priceInit = 0;
            for (OrderItemDto orderItem : orderItems) {
                if (orderItem.getShopId().equals(shopId)) {
                    priceInit += orderItem.getPrice();
                }
            }
            orderInfo.setTotalOrder(priceInit);
            orderInfo.setCode(createCode(10));
            OrderInfo savedOrderInfo = orderInfoRepository.save(orderInfo);
            for (OrderItemDto orderItemDto : orderItems) {
                Optional<Product> productOptional = productRepository.findByIdProduct(orderItemDto.getProductId());
                if (!productOptional.isPresent()) {
                    return ResponseEntity.notFound().build();
                }
                Product product = productOptional.get();
                if (product.getShop().getId() == shopId) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrderInfo);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(orderItemDto.getQuantity());
                    orderItemRepository.save(orderItem);

                    product.setRemain(product.getRemain() - orderItemDto.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        return ResponseEntity.ok().body("order success");
    }

    @Override
    public List<OrderItem> getAllItemOfOrder(List<Long> idOrder) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (Long idorder : idOrder) {
            orderItems.addAll(orderItemRepository.findByOrderId(idorder));
        }
        return orderItems;
    }

    @Override
    public ResponseEntity<?> changeStatusOrder(long idOrder,String status) {
        OrderInfo order = orderInfoRepository.findById((idOrder)).get();
        if (order.getStatus().equals(WAIT_FOR_CONFIRM_ORDER)) {
            order.setStatus(PREPARING_ORDER);
            orderInfoRepository.save(order);
            return ResponseEntity.ok().build();
        } else if (order.getStatus().equals(PREPARING_ORDER)) {
            order.setStatus(SHIPPING);
            orderInfoRepository.save(order);
            return ResponseEntity.ok().build();
        }else if (order.getStatus().equals(SHIPPING)) {
            order.setStatus(COMPLETED);
            orderInfoRepository.save(order);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
