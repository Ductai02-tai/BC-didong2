package com.nguyentranductai.banbanhtam.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nguyentranductai.banbanhtam.entity.RelatedProduct;

public interface RelatedProductRepository extends JpaRepository<RelatedProduct, Integer> {
    List<RelatedProduct> findByProductId(Integer productId);
}
