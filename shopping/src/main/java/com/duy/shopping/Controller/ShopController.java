package com.duy.shopping.controller;

import com.duy.shopping.repository.ProductRepository;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.dto.ProductDto;
import com.duy.shopping.dto.ShopInfoDto;
import com.duy.shopping.model.*;
import com.duy.shopping.service.OrderService;
import com.duy.shopping.service.ProductService;
import com.duy.shopping.service.RateService;
import com.duy.shopping.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import static com.duy.shopping.constant.Constant.URL_ORIGIN;

@RestController
@CrossOrigin(URL_ORIGIN)
@RequestMapping("/shop")
public class ShopController {
   @Autowired
   private ShopService shopService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;


    @GetMapping("/allOrder")
    public List<OrderInfo> getAllOrderOfShop(@RequestParam long idShop) {
        return orderService.getAllOrderOfShop(idShop);
    }

    @PostMapping("/allOrderItem")
    public  List<OrderItem> getAllOrderItemOfShop(@RequestBody List<Long> idOrder) {
        return orderService.getAllItemOfOrder(idOrder);
    }

    @GetMapping("/{id}")
    public Object getInfoShop(@PathVariable long id) {
        return shopService.getInfoShop(id);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody ProductDto productDto) {
        return productService.addProduct(productDto);
    }

    @PostMapping("/updateProduct")
    public ResponseEntity<?> updateProduct(@RequestBody ProductDto productDto) {
        return productService.updateProduct(productDto);
    }

    @PostMapping("/changeStatusOrder")
    public ResponseEntity<?> changeStatusOrder(@RequestParam long idOrder,@RequestParam String status) {
        return orderService.changeStatusOrder(idOrder,status);
    }
}
