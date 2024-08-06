package com.duy.shopping.Controller;

import com.duy.shopping.Repository.OrderInfoRepo;
import com.duy.shopping.Repository.OrderItemRepo;
import com.duy.shopping.dto.OrderDto;
import com.duy.shopping.dto.RateDto;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.service.OrderService;
import com.duy.shopping.service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderInfoRepo orderInfoRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private RateService rateService;

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto) {
        return orderService.createOrder(orderDto);
    }

    @GetMapping("/order")
    public ResponseEntity<?> getAllOrdersInfo(@RequestParam long idUser) {
        List<OrderInfo> list=orderInfoRepo.findByUserId(idUser);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/orderItems")
    public ResponseEntity<?> getAllItemFromOrderOfUser(@RequestParam long idUser) {
        List<OrderInfo> listOrder=orderInfoRepo.findByUserId(idUser);
        List<OrderItem> allItem=new ArrayList<>();
        for(OrderInfo orderInfo:listOrder){
            List<OrderItem> list=orderItemRepo.findByOrderId(orderInfo.getId());
            allItem.addAll(list);
        }
        return ResponseEntity.ok(allItem);
    }

    @PostMapping("/rateProduct")
    public ResponseEntity<?> rateProduct(@RequestBody RateDto rateDto) {
        return rateService.addRateProduct(rateDto);
    }
}
