package com.duy.shopping.controller;

import com.duy.shopping.repository.CartRepository;
import com.duy.shopping.dto.CartDto;
import com.duy.shopping.model.Cart;
import com.duy.shopping.service.CartService;
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

import static com.duy.shopping.constant.Constant.URL_ORIGIN;


@RestController
@CrossOrigin(URL_ORIGIN)
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/saveCart")
    public ResponseEntity<Cart> saveCart(@RequestBody CartDto cartDTO) {
        Cart savedCart = cartService.addCart(cartDTO);
        return ResponseEntity.ok(savedCart);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCartsByIdUser(@PathVariable long id) {
        return cartService.getCartByIdUser(id);
    }

    @PostMapping("/handleQuantity")
    public ResponseEntity<?> increaseCart(@RequestParam("idCart") long idCart, @RequestParam("quantity") int quantity) {
        return cartService.handleQuantity(idCart, quantity);
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteCart(@RequestParam("idCart") long idCart) {
        return cartService.deleteCart(idCart);
    }

    @PostMapping("/deleteAll")
    public ResponseEntity<?> deleteAllCart(@RequestParam long idUser) {
        return cartService.deleteAllCart(idUser);
    }
}
