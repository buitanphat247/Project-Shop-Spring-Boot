package com.example.spring_boot.services.cart;

import com.example.spring_boot.domains.cart.Cart;
import com.example.spring_boot.domains.cart.CartItem;
import com.example.spring_boot.domains.products.Product;
import com.example.spring_boot.repository.cart.CartRepository;
import com.example.spring_boot.services.products.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductService productService;
    
    /**
     * Lấy giỏ hàng theo user ID hoặc session ID
     */
    public Optional<Cart> getCart(String userIdOrSessionId) {
        return cartRepository.findByUserIdOrSessionId(userIdOrSessionId);
    }
    
    /**
     * Tạo giỏ hàng mới
     */
    public Cart createCart(String userId, String sessionId) {
        Cart cart = new Cart(userId, sessionId);
        return cartRepository.save(cart);
    }
    
    /**
     * Lấy hoặc tạo giỏ hàng
     */
    public Cart getOrCreateCart(String userId, String sessionId) {
        Optional<Cart> existingCart = cartRepository.findByUserIdOrSessionId(userId != null ? userId : sessionId);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        return createCart(userId, sessionId);
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public Cart addToCart(String userIdOrSessionId, String productId, Integer quantity) {
        // Lấy thông tin sản phẩm
        Product product = productService.getById(productId);
        if (product == null) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        
        // Kiểm tra số lượng tồn kho
        if (product.getStock() < quantity) {
            throw new RuntimeException("Số lượng sản phẩm không đủ");
        }
        
        // Lấy hoặc tạo giỏ hàng
        Cart cart = getOrCreateCart(userIdOrSessionId, userIdOrSessionId);
        
        // Tạo cart item
        CartItem cartItem = new CartItem(
            productId,
            product.getName(),
            product.getPrice().doubleValue(),
            quantity
        );
        
        // Thêm vào giỏ hàng
        cart.addItem(cartItem);
        
        // Cập nhật stock
        product.setStock(product.getStock() - quantity);
        productService.update(productId, product);
        
        return cartRepository.save(cart);
    }
    
    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    public Cart updateCartItemQuantity(String userIdOrSessionId, String productId, Integer quantity) {
        Cart cart = getCart(userIdOrSessionId).orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        
        CartItem existingItem = cart.findItemByProductId(productId);
        if (existingItem == null) {
            throw new RuntimeException("Sản phẩm không có trong giỏ hàng");
        }
        
        // Lấy thông tin sản phẩm để kiểm tra stock
        Product product = productService.getById(productId);
        if (product == null) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        
        // Tính toán số lượng thay đổi
        int quantityChange = quantity - existingItem.getQuantity();
        
        // Kiểm tra stock
        if (product.getStock() < quantityChange) {
            throw new RuntimeException("Số lượng sản phẩm không đủ");
        }
        
        // Cập nhật số lượng
        cart.updateItemQuantity(productId, quantity);
        
        // Cập nhật stock
        if (quantityChange > 0) {
            product.setStock(product.getStock() - quantityChange);
        } else if (quantityChange < 0) {
            product.setStock(product.getStock() + (-quantityChange));
        }
        productService.update(productId, product);
        
        return cartRepository.save(cart);
    }
    
    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    public Cart removeFromCart(String userIdOrSessionId, String productId) {
        Cart cart = getCart(userIdOrSessionId).orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        
        CartItem item = cart.findItemByProductId(productId);
        if (item == null) {
            throw new RuntimeException("Sản phẩm không có trong giỏ hàng");
        }
        
        // Restore stock
        Product product = productService.getById(productId);
        if (product != null) {
            product.setStock(product.getStock() + item.getQuantity());
            productService.update(productId, product);
        }
        
        // Xóa khỏi giỏ hàng
        cart.removeItem(productId);
        
        return cartRepository.save(cart);
    }
    
    /**
     * Làm trống giỏ hàng
     */
    public Cart clearCart(String userIdOrSessionId) {
        Cart cart = getCart(userIdOrSessionId).orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        
        // Restore stock cho tất cả sản phẩm
        for (CartItem item : cart.getItems()) {
            Product product = productService.getById(item.getProductId());
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productService.update(item.getProductId(), product);
            }
        }
        
        cart.clear();
        return cartRepository.save(cart);
    }
    
    /**
     * Lấy tất cả giỏ hàng
     */
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }
    
    /**
     * Xóa giỏ hàng
     */
    public void deleteCart(String cartId) {
        cartRepository.deleteById(cartId);
    }
    
    /**
     * Xóa giỏ hàng theo user ID
     */
    public void deleteCartByUserId(String userId) {
        cartRepository.deleteByUserId(userId);
    }
    
    /**
     * Xóa giỏ hàng theo session ID
     */
    public void deleteCartBySessionId(String sessionId) {
        cartRepository.deleteBySessionId(sessionId);
    }
}
