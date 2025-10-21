// Product Detail Utils
// ====================

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star text-sm"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt text-sm"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star text-sm"></i>';
  }

  return stars;
}

function showNotification(message, type = "success") {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
  toast.innerHTML = `<i class="fas ${icon} mr-2"></i>${message}`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-x-full");
  }, 100);

  setTimeout(() => {
    toast.classList.add("translate-x-full");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function preloadImages() {
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    if (img.src && !img.complete) {
      const preloadImg = new Image();
      preloadImg.src = img.src;
    }
  });
}

function testBasicFunctionality() {
  console.log("Testing basic functionality...");
  
  // Test DOM elements
  const productData = document.getElementById("product-data");
  const productGallery = document.getElementById("product-gallery");
  const relatedProducts = document.getElementById("relatedProducts");
  
  console.log("DOM elements found:", {
    productData: !!productData,
    productGallery: !!productGallery,
    relatedProducts: !!relatedProducts
  });
  
  // Test localStorage
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    console.log("localStorage is working");
  } catch (e) {
    console.error("localStorage not available:", e);
  }
  
  // Test fetch
  if (typeof fetch !== "undefined") {
    console.log("fetch API is available");
  } else {
    console.error("fetch API not available");
  }
  
  console.log("Basic functionality test completed");
}

// Make functions globally available
window.formatPrice = formatPrice;
window.generateStars = generateStars;
window.showNotification = showNotification;
window.preloadImages = preloadImages;
window.testBasicFunctionality = testBasicFunctionality;
