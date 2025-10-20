package com.example.spring_boot.controllers.pages;

import com.example.spring_boot.domains.products.Product;
import com.example.spring_boot.services.products.ProductService;
import com.example.spring_boot.services.products.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller("productPagesController")
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    @GetMapping
    public String getProducts() {
        return "clients/products"; // resolves to src/main/resources/views/clients/products.html
    }

    @GetMapping("detail/{id}")
    public String getProductDetail(@PathVariable String id, Model model) {
        try {
            // Lấy thông tin sản phẩm
            Product product = productService.getById(id);
            if (product == null) {
                model.addAttribute("error", "Sản phẩm không tồn tại");
                return "clients/product-detail";
            }

            // Lấy hình ảnh của sản phẩm
            List<Map<String, Object>> images = productImageService.getByProductId(id).stream()
                    .map(image -> {
                        Map<String, Object> imageMap = new HashMap<>();
                        imageMap.put("id", image.getId());
                        imageMap.put("imageUrl", image.getImageUrl());
                        imageMap.put("isPrimary", image.getIsPrimary());
                        imageMap.put("createdAt", image.getCreatedAt());
                        return imageMap;
                    })
                    .collect(Collectors.toList());

            // Merge sản phẩm và hình ảnh
            Map<String, Object> productWithImages = new HashMap<>();
            productWithImages.put("id", product.getId());
            productWithImages.put("name", product.getName());
            productWithImages.put("price", product.getPrice());
            productWithImages.put("stock", product.getStock());
            productWithImages.put("description", product.getDescription());
            productWithImages.put("category", product.getCategory());
            productWithImages.put("createdAt", product.getCreatedAt());
            productWithImages.put("updatedAt", product.getUpdatedAt());
            productWithImages.put("images", images);

            model.addAttribute("product", productWithImages);
            return "clients/product-detail";
        } catch (Exception e) {
            model.addAttribute("error", "Có lỗi xảy ra khi tải sản phẩm: " + e.getMessage());
            return "clients/product-detail";
        }
    }

    @GetMapping("wishlist")
    public String getWishlist() {
        return "clients/wishlist";
    }
}
