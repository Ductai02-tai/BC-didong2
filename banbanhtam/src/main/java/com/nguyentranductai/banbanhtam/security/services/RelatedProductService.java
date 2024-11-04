package com.nguyentranductai.banbanhtam.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nguyentranductai.banbanhtam.entity.RelatedProduct;
import com.nguyentranductai.banbanhtam.repository.RelatedProductRepository;
import java.util.List;

@Service
public class RelatedProductService {
    @Autowired
    private RelatedProductRepository relatedProductRepository;

    // Sửa đổi phương thức này
    public List<RelatedProduct> getRelatedProducts(Integer productId) {
        return relatedProductRepository.findByProductId(productId); // Thay đổi ở đây
    }
}
