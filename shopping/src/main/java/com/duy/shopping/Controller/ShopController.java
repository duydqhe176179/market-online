package com.duy.shopping.Controller;

import com.duy.shopping.Repository.OrderInfoRepo;
import com.duy.shopping.Repository.OrderItemRepo;
import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.dto.ProductDto;
import com.duy.shopping.dto.ShopInfoDto;
import com.duy.shopping.model.*;
import com.duy.shopping.service.OrderService;
import com.duy.shopping.service.ProductService;
import com.duy.shopping.service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ShopController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RateService rateService;

    @Autowired
    private OrderInfoRepo orderInfoRepo;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @GetMapping("/shop/{id}")
    public Object getInfoShop(@PathVariable long id) {
        User shop = userRepository.findById(id);
        List<Product> products = productRepository.findByIdShop(id);
        List<RateProduct> allRate = rateService.getAllRates(id);
        return new ShopInfoDto(shop, products, allRate);
    }

    @GetMapping("/shop/allOrder")
    public List<OrderInfo> getAllOrderOfShop(@RequestParam long idShop) {
        return orderInfoRepo.findByIdShop(idShop);
    }

    @PostMapping("/shop/allOrderItem")
    public  List<OrderItem> getAllOrderItemOfShop(@RequestBody List<Long> idOrder) {
        return orderService.getAllItemOfOrder(idOrder);
    }

    @PostMapping("/shop/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody ProductDto productDto) {
        return productService.addProduct(productDto);
    }

    @PostMapping("/shop/changeStatusOrder")
    public ResponseEntity<?> changeStatusOrder(@RequestParam long idOrder,@RequestParam String status) {
        return orderService.changeStatusOrder(idOrder,status);
    }
}
