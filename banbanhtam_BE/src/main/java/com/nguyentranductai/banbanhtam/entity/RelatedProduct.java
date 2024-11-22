package com.nguyentranductai.banbanhtam.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "related_products")
public class RelatedProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "related_product_id", nullable = false)
    private Product relatedProduct;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Product getRelatedProduct() {
        return relatedProduct;
    }

    public void setRelatedProduct(Product relatedProduct) {
        this.relatedProduct = relatedProduct;
    }
}
