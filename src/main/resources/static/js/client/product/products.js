// Products page JavaScript - Main entry point
let productManager;

// Load products khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page DOM loaded, initializing...');
    
    // Khởi tạo Product Manager
    productManager = new ProductManager();
    productManager.init();
    
    // Expose productManager ra global để các modules khác có thể sử dụng
    window.productManager = productManager;
    
    console.log('ProductManager initialized:', productManager);
    console.log('Global addToCart function:', typeof window.addToCart);
});

// Legacy functions - kept for backward compatibility
// These will be handled by ProductManager now

// Global functions for HTML onclick events
// These are set up by ProductManager.setupGlobalFunctions()

// Note: All functionality has been moved to modules:
// - productApi.js: API calls
// - productUI.js: UI rendering and pagination
// - productGallery.js: Image gallery functionality
// - productUtils.js: Utility functions
// - productManager.js: Main controller