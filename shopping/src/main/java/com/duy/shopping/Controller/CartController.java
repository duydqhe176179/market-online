package com.duy.shopping.Controller;

import com.duy.shopping.Repository.CartRepository;
import com.duy.shopping.dto.CartDto;
import com.duy.shopping.model.Cart;
import com.duy.shopping.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("http://localhost:3000/")
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

    @GetMapping("/cart/{id}")
    public ResponseEntity<?> getCartsByIdUser(@PathVariable long id) {
        return ResponseEntity.ok(cartRepository.findCartsByIdUser(id));
    }

    @PostMapping("/cart/handleQuantity")
    public ResponseEntity<?> increaseCart(@RequestParam("idCart") long idCart, @RequestParam("quantity") int quantity) {
        Cart cart = cartRepository.findCartById(idCart);
        cart.setQuantity(cart.getQuantity() + quantity);
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/cart/delete")
    public ResponseEntity<?> deleteCart(@RequestParam("idCart") long idCart) {
        cartRepository.deleteById(idCart);
        return ResponseEntity.ok().build();
    }
}
