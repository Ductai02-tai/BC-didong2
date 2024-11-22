package com.nguyentranductai.banbanhtam.security.services;

import java.util.List;

import com.nguyentranductai.banbanhtam.entity.Category;

public interface CategoryService {
    Category createCategory(Category category);

    Category getCategoryById(Long categoryId);

    List<Category> getAllCategories();

    Category updateCategory(Category category);

    void deleteCategory(Long categoryId);
}