package com.nguyentranductai.banbanhtam.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nguyentranductai.banbanhtam.entity.Cart;
import com.nguyentranductai.banbanhtam.repository.CartRepository;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart getCartById(int id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart addCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart updateCart(int id, Cart cart) {
        cart.setId(id);
        return cartRepository.save(cart);
    }

    public void deleteCart(int id) {
        cartRepository.deleteById(id);
    }

    // Có thể thêm các phương thức tìm kiếm cart theo userId nếu cần
}
