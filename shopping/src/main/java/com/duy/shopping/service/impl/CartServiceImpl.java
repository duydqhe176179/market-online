package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.CartRepository;
import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.dto.CartDto;
import com.duy.shopping.model.Cart;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.User;
import com.duy.shopping.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartRepository cartRepository;

    @Override
    public Cart addCart(CartDto cartDto) {
        System.out.println(cartDto);
        Cart cart = cartRepository.findCartByIdUserAndIdProduct(cartDto.getIdUser(), cartDto.getIdProduct());
        if (cart == null) {
            cart = new Cart();
            User user = userRepository.findById(cartDto.getIdUser())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + cartDto.getIdUser()));

            // Retrieve product and handle if not found
            Product product = productRepository.findByIdProduct(cartDto.getIdProduct())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + cartDto.getIdProduct()));

            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(cartDto.getQuantity());
        } else {
            cart.setQuantity(cartDto.getQuantity() + cart.getQuantity());
        }
        cartRepository.save(cart);
        return cart;
    }
}
