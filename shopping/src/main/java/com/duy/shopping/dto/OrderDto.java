package com.duy.shopping.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderDto {
    private Long userId;
    private List<OrderItemDto> orderItems;
    private Long totalOrder;
    private String payMethod ;
}
