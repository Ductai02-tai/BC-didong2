package com.nguyentranductai.banbanhtam.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nguyentranductai.banbanhtam.entity.Product;
import com.nguyentranductai.banbanhtam.repository.ProductRepository;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        product.setImageDate(imageFile.getBytes());
        product.setImageName(imageFile.getOriginalFilename());
        product.getImageType(imageFile.getContentType());
        return repo.save(product);
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        try {
            List<Product> products = repo.searchProducts(keyword);
            System.out.println("Number of products found: " + products.size());
            return products;
        } catch (Exception e) {
            System.err.println("Error in searchProducts: " + e.getMessage());
            throw new RuntimeException("Search failed", e);
        }
    }
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return repo.findByCategoryId(categoryId);
    }
    
}