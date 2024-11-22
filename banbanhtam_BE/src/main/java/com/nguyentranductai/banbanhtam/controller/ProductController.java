package com.nguyentranductai.banbanhtam.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.nguyentranductai.banbanhtam.entity.Product;
import com.nguyentranductai.banbanhtam.entity.RelatedProduct;
import com.nguyentranductai.banbanhtam.security.services.ProductService;
import com.nguyentranductai.banbanhtam.security.services.RelatedProductService;

import java.io.IOException;
import java.util.List;
@RestController
//@CrossOrigin
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
        
    @Autowired
    private ProductService services;
    @Autowired
    private RelatedProductService relatedProductService;
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return new ResponseEntity<>(services.getAllProducts(), HttpStatus.OK);
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable int id) {
        Product product = services.getProductById(id);
        if (product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = services.getProductsByCategoryId(categoryId);
        if (products != null && !products.isEmpty()) {
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        try {
            System.out.println(product);
            Product product1 = services.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId) {
        Product product = services.getProductById(productId);
        byte[] imageFile = product.getImageDate();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType("")))
                .body(imageFile);
    }
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id,
            @RequestPart Product product,
            @RequestPart MultipartFile imageFile) {
        Product product1 = null;
        try {
            product1 = services.updateProduct(id, product, imageFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if (product1 != null)
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        else
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        Product product = services.getProductById(id);
        if (product != null) {
            services.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        System.out.println("searching with " + keyword);
        List<Product> products = services.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    //
   
    // Phương thức để lấy sản phẩm liên quan
    @GetMapping("/product/{productId}/related")
    public ResponseEntity<List<RelatedProduct>> getRelatedProducts(@PathVariable Integer productId) {
        List<RelatedProduct> relatedProducts = relatedProductService.getRelatedProducts(productId);
        if (relatedProducts != null && !relatedProducts.isEmpty()) {
            return new ResponseEntity<>(relatedProducts, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
//

}
