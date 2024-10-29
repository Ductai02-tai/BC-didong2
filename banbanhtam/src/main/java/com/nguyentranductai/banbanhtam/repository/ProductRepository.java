package com.nguyentranductai.banbanhtam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nguyentranductai.banbanhtam.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("SELECT p FROM Product p JOIN p.category c WHERE " +
    "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
List<Product> searchProducts(String keyword);
  
    
    List<Product> findByCategoryId(Long categoryId); // Phương thức tìm sản phẩm theo categoryId
}


