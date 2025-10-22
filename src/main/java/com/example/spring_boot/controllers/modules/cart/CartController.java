package com.example.spring_boot.controllers.modules.cart;

import com.example.spring_boot.domains.cart.Cart;
import com.example.spring_boot.services.cart.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    /**
     * Lấy giỏ hàng
     */
    @GetMapping("/{userIdOrSessionId}")
    public ResponseEntity<Map<String, Object>> getCart(@PathVariable String userIdOrSessionId) {
        try {
            Optional<Cart> cart = cartService.getCart(userIdOrSessionId);
            
            Map<String, Object> response = new HashMap<>();
            if (cart.isPresent()) {
                response.put("success", true);
                response.put("data", cart.get());
                response.put("message", "Lấy giỏ hàng thành công");
            } else {
                response.put("success", true);
                response.put("data", null);
                response.put("message", "Giỏ hàng trống");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam String userIdOrSessionId,
            @RequestParam String productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        try {
            Cart cart = cartService.addToCart(userIdOrSessionId, productId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", cart);
            response.put("message", "Thêm sản phẩm vào giỏ hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi thêm vào giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateCartItemQuantity(
            @RequestParam String userIdOrSessionId,
            @RequestParam String productId,
            @RequestParam Integer quantity) {
        try {
            Cart cart = cartService.updateCartItemQuantity(userIdOrSessionId, productId, quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", cart);
            response.put("message", "Cập nhật giỏ hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @RequestParam String userIdOrSessionId,
            @RequestParam String productId) {
        try {
            Cart cart = cartService.removeFromCart(userIdOrSessionId, productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", cart);
            response.put("message", "Xóa sản phẩm khỏi giỏ hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Làm trống giỏ hàng
     */
    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, Object>> clearCart(@RequestParam String userIdOrSessionId) {
        try {
            Cart cart = cartService.clearCart(userIdOrSessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", cart);
            response.put("message", "Làm trống giỏ hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi làm trống giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy tất cả giỏ hàng (Admin)
     */
    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> getAllCarts() {
        try {
            List<Cart> carts = cartService.getAllCarts();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", carts);
            response.put("message", "Lấy danh sách giỏ hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Xóa giỏ hàng (Admin)
     */
    @DeleteMapping("/admin/{cartId}")
    public ResponseEntity<Map<String, Object>> deleteCart(@PathVariable String cartId) {
        try {
            cartService.deleteCart(cartId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa giỏ hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa giỏ hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
