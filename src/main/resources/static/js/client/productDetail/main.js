// Product Detail Main Initialization
// ===================================

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM loaded, starting initialization...');
  
  // Test basic functionality
  testBasicFunctionality();
  
  // Preload images ngay lập tức
  preloadImages();
  
  // Khởi tạo giỏ hàng
  initCartCount();

  // Thêm event listener cho nút "THÊM VÀO GIỎ HÀNG"
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", handleAddToCart);
  }

  // Load product data ngay lập tức
  console.log('Starting to load product data...');
  loadProductData().then((product) => {
    console.log('Product loaded successfully:', product);
    
    // Show loading state for related products only
    showGlobalLoading();

    // Tối ưu hóa loading - không chờ related products
    Promise.all([
      // Wait for Swiper to be available
      waitForSwiper(1000)
    ]).then(() => {
      // Initialize Swiper after everything is loaded
      initializeSwiper();

      // Hide loading state
      hideGlobalLoading();
      
      // Load related products sau khi main content đã sẵn sàng
      setTimeout(() => {
        loadRelatedProducts().catch(error => {
          console.log('Related products failed to load:', error);
        });
      }, 500);
    });
  }).catch((error) => {
    console.error('Failed to load product data:', error);
    // Error handling đã được xử lý trong loadProductData()
  });
});
