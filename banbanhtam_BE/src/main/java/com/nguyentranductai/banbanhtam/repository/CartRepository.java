package com.nguyentranductai.banbanhtam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nguyentranductai.banbanhtam.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    // Có thể thêm các phương thức tìm kiếm tùy chỉnh tại đây nếu cần
}
