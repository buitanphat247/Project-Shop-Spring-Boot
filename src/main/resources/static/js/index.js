// Products data array (will be loaded from API)
let products = [];
let bestSellingProducts = [];
let newProducts = [];

// API functions to load data
async function loadProducts() {
  try {
    showLoadingState('products-grid');
    const response = await fetch('api/products/paged?page=1&size=20');
    const data = await response.json();
    
    if (data.success && data.data && data.data.items) {
      products = data.data.items.map(product => ({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price) + ' ₫',
        originalPrice: null, // API không có originalPrice
        discount: null, // API không có discount
        rating: 4, // Default rating
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg',
        buttonType: "cart",
        colorVariants: ["bg-gray-400", "bg-blue-500", "bg-red-500"], // Default color variants
        outOfStock: product.stock <= 0,
      }));
      renderProducts();
    } else {
      throw new Error(data.message || 'Lỗi khi tải sản phẩm');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showErrorState('products-grid', 'Không thể tải sản phẩm');
  }
}

async function loadBestSellingProducts() {
  try {
    showLoadingState('best-selling-grid');
    const response = await fetch('api/products/best-selling?limit=5');
    const data = await response.json();
    
    if (data.success && data.data) {
      bestSellingProducts = data.data.map(product => ({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price) + ' ₫',
        rating: 4, // Default rating
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg',
        available: product.stock || 0,
        sold: Math.floor(Math.random() * 50) + 10, // Random sold count for demo
        outOfStock: product.stock <= 0,
      }));
      renderBestSellingProducts();
    } else {
      throw new Error(data.message || 'Lỗi khi tải sản phẩm bán chạy');
    }
  } catch (error) {
    console.error('Error loading best selling products:', error);
    showErrorState('best-selling-grid', 'Không thể tải sản phẩm bán chạy');
  }
}

async function loadNewProducts() {
  try {
    showLoadingState('new-products-grid');
    const response = await fetch('api/products/new?limit=4');
    const data = await response.json();
    
    if (data.success && data.data) {
      newProducts = data.data.map(product => ({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price) + ' ₫',
        originalPrice: null,
        discount: "MỚI",
        rating: 0,
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg',
        buttonType: "cart",
        colorVariants: ["bg-pink-300", "bg-yellow-200", "bg-blue-300"], // Default color variants
        outOfStock: product.stock <= 0,
      }));
      renderNewProducts();
    } else {
      throw new Error(data.message || 'Lỗi khi tải sản phẩm mới');
    }
  } catch (error) {
    console.error('Error loading new products:', error);
    showErrorState('new-products-grid', 'Không thể tải sản phẩm mới');
  }
}

// Helper functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price);
}

function showLoadingState(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16">
        <div class="relative w-16 h-16 mb-4">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 0.8s;"></div>
          </div>
        </div>
        <div class="text-gray-600 text-lg font-medium">Đang tải sản phẩm...</div>
      </div>
    `;
  }
}

function showErrorState(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="col-span-full flex items-center justify-center py-8">
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">${message}</p>
          <button onclick="location.reload()" class="mt-4 bg-[#2f604a] text-white px-4 py-2 rounded hover:bg-[#1e3d2e] transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    `;
  }
}

// Function to render stars
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

// Function to render color variants
function renderColorVariants(variants) {
  if (!variants) return "";
  return variants.map((color) => `<div class="w-3 h-3 ${color} rounded-full"></div>`).join("");
}

// Function to render product card
function renderProductCard(product) {
  const opacityClass = product.outOfStock ? "opacity-75" : "";
  const priceColor = product.outOfStock ? "text-gray-400" : "text-[#cd5d4a]";
  const available = Math.floor(Math.random() * 8) + 2; // Random available stock 2-9
  const sold = Math.floor(Math.random() * 8) + 2; // Random sold stock 2-9
  const totalStock = available + sold;
  const soldPercentage = (sold / totalStock) * 100;

  return `
    <div class="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${opacityClass}">
      <div class="relative">
        <a href="products/detail/${product.id}" class="block">
          <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" 
                 onerror="this.src='https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg'" />
          </div>
        </a>
        ${product.discount
      ? `
          <div class="absolute top-3 left-3 ${product.outOfStock ? "bg-gray-400" : "bg-[#cd5d4a]"
      } text-white px-2 py-1 rounded text-sm font-bold">
            ${product.discount}
          </div>
        `
      : ""
    }
        <!-- Wishlist Button (appears on hover) -->
        <button class="absolute top-3 right-3 bg-white text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg">
          <i class="fas fa-heart text-sm"></i>
        </button>
        ${product.colorVariants
      ? `
          <div class="absolute bottom-3 left-3 flex space-x-1">
            ${renderColorVariants(product.colorVariants)}
          </div>
        `
      : ""
    }
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg text-[#2f604a] mb-2">
          <a href="products/detail/${product.id}" class="hover:text-[#cd5d4a] transition-colors">${product.name}</a>
        </h3>
        <div class="flex items-center mb-2">
          <div class="flex text-yellow-400">
            ${renderStars(product.rating)}
          </div>
        </div>
        <div class="flex items-center justify-between mb-3">
          ${product.originalPrice
      ? `
                    <div>
                <span class="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                <span class="text-2xl font-bold ${priceColor} ml-2">${product.price}</span>
              </div>
            `
      : `
            <span class="text-2xl font-bold ${priceColor}">${product.price}</span>
          `
    }
          ${product.buttonType
      ? `
            <button onclick="addToCart(${product.id}, '${product.name}', ${parseInt(product.price.replace(/[^\d]/g, ''))})" 
                    class="${product.outOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-[#2f604a] hover:bg-[#1e3d2e]"
      } text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    ${product.outOfStock ? "disabled" : ""}>
              <i class="fas fa-shopping-cart text-sm"></i>
            </button>
          `
      : ""
    }
                  </div>
        <!-- Availability Bar -->
        <div class="mb-2">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Có sẵn: ${available}</span>
            <span>Đã bán: ${sold}</span>
                  </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-[#cd5d4a] to-gray-400 h-2 rounded-full" style="width: ${soldPercentage}%"></div>
                  </div>
                  </div>
              </div>
          </div>
  `;
}

// Function to render best selling product card
function renderBestSellingCard(product) {
  const opacityClass = product.outOfStock ? "opacity-75" : "";
  const priceColor = product.outOfStock ? "text-gray-400" : "text-[#cd5d4a]";
  const totalStock = product.available + product.sold;
  const soldPercentage = (product.sold / totalStock) * 100;

  return `
    <div class="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${opacityClass}">
      <div class="relative">
        <a href="products/detail/${product.id}" class="block">
          <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" 
                 onerror="this.src='https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg'" />
          </div>
        </a>
        ${product.outOfStock
      ? `
          <div class="absolute top-3 left-3 bg-gray-400 text-white px-2 py-1 rounded text-sm font-bold">
            HẾT HÀNG
          </div>
        `
      : ""
    }
        <!-- Wishlist Button (appears on hover) -->
        <button class="absolute top-3 right-3 bg-white text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg">
          <i class="fas fa-heart text-sm"></i>
        </button>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg text-[#2f604a] mb-2">
          <a href="products/detail/${product.id}" class="hover:text-[#cd5d4a] transition-colors">${product.name}</a>
        </h3>
        <div class="flex items-center mb-2">
          <div class="flex text-yellow-400">
            ${renderStars(product.rating)}
          </div>
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-2xl font-bold ${priceColor}">${product.price}</span>
          <button onclick="addToCart(${product.id}, '${product.name}', ${parseInt(product.price.replace(/[^\d]/g, ''))})" 
                  class="${product.outOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-[#2f604a] hover:bg-[#1e3d2e]"} text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  ${product.outOfStock ? "disabled" : ""}>
            <i class="fas fa-shopping-cart text-sm"></i>
          </button>
        </div>
        <!-- Availability Bar -->
        <div class="mb-2">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Có sẵn: ${product.available}</span>
            <span>Đã bán: ${product.sold}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-[#cd5d4a] to-gray-400 h-2 rounded-full" style="width: ${soldPercentage}%"></div>
          </div>
        </div>
    </div>
</div>
  `;
}

// Render all products
function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  if (productsGrid) {
    // Chỉ hiển thị 8 sản phẩm đầu tiên
    const limitedProducts = products.slice(0, 8);
    productsGrid.innerHTML = limitedProducts.map((product) => renderProductCard(product)).join("");
  }
}

// Render new products
function renderNewProducts() {
  const newProductsGrid = document.getElementById("new-products-grid");
  if (newProductsGrid) {
    // Chỉ hiển thị 4 sản phẩm mới đầu tiên
    const limitedNewProducts = newProducts.slice(0, 4);
    newProductsGrid.innerHTML = limitedNewProducts.map((product) => renderProductCard(product)).join("");
  }
}

// Render best selling products
function renderBestSellingProducts() {
  const bestSellingGrid = document.getElementById("best-selling-grid");
  if (bestSellingGrid) {
    // Chỉ hiển thị 5 sản phẩm bán chạy đầu tiên
    const limitedBestSelling = bestSellingProducts.slice(0, 5);
    bestSellingGrid.innerHTML = limitedBestSelling.map((product) => renderBestSellingCard(product)).join("");
  }
}

// Promo cards data + renderer (fashion)
const promoCards = [
  {
    bg: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
    overlay: "bg-black bg-opacity-50",
    badge: { text: "BỘ SƯU TẬP MỚI", cls: "bg-orange-500" },
    title: ["THU 2025"],
    desc: "Phong cách tối giản, chất liệu cao cấp cho ngày mới tự tin",
    btnCls: "bg-[#d9624a] hover:bg-[#b8544a]",
    deco: [
      { cls: "w-12 h-12 bg-white rounded-full opacity-20", style: "top:1rem;right:1rem" },
      { cls: "w-6 h-6 bg-white rounded-full opacity-10", style: "top:2rem;right:2rem" },
    ],
  },
  {
    bg: "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
    overlay: "bg-black bg-opacity-40",
    badge: { text: "GIẢM NGAY 30%", cls: "bg-green-700" },
    title: ["OUTFIT HÀNG NGÀY"],
    desc: "Đơn giản – thoải mái – dễ phối cho mọi hoạt động",
    btnCls: "bg-green-700 hover:bg-green-800",
    deco: [
      { cls: "w-3 h-3 bg-white rounded-full opacity-40", style: "top:1.5rem;right:1.5rem" },
      { cls: "w-2 h-2 bg-white rounded-full opacity-30", style: "top:2.5rem;right:2.5rem" },
    ],
  },
  {
    bg: "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
    overlay: "bg-pink-900 bg-opacity-40",
    badge: { text: "FLASH SALE", cls: "bg-[#cd5d4a]" },
    title: ["PHỤ KIỆN", "GIẢM ĐẾN 50%"],
    desc: "Hoàn thiện set đồ với phụ kiện bắt mắt",
    btnCls: "bg-[#d9624a] hover:bg-[#b8544a]",
    deco: [
      { cls: "w-8 h-8 bg-orange-200 rounded-full opacity-40", style: "top:1.5rem;right:1.5rem" },
      { cls: "w-4 h-4 bg-pink-200 rounded-full opacity-40", style: "top:2.5rem;right:2.5rem" },
    ],
  },
];

function renderPromoCards() {
  const host = document.getElementById("promo-cards");
  if (!host) return;
  host.innerHTML = promoCards
    .map((c) => `
    <div class="group rounded-3xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style="background-image:url('${c.bg}');background-size:cover;background-position:center;">
      <div class="absolute inset-0 ${c.overlay} rounded-3xl"></div>
      <div class="relative z-10">
        <div class="inline-block ${c.badge.cls} text-white px-4 py-2 rounded-full text-sm font-bold mb-4">${c.badge.text}</div>
        ${c.title.map(t => `<h3 class="text-white text-3xl font-bold mb-1">${t}</h3>`).join('')}
        <p class="text-white text-opacity-90 mb-6">${c.desc}</p>
        <button class="${c.btnCls} text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">XEM NGAY</button>
      </div>
      ${c.deco.map(d => `<div class="absolute ${d.cls}" style="${d.style}"></div>`).join('')}
    </div>
  `)
    .join("");
}

// Customer Reviews data + renderer (fashion)
const reviews = [
  {
    name: "Minh Anh",
    initial: "M",
    bgColor: "bg-[#2f604a]",
    rating: 5,
    comment: "Áo thun cotton mềm, thấm hút tốt. Form vừa người, giao hàng nhanh. Sẽ mua lại!",
    time: "2 ngày trước"
  },
  {
    name: "Thu Hà",
    initial: "T",
    bgColor: "bg-[#cd5d4a]",
    rating: 5,
    comment: "Quần jeans đẹp, chất dày dặn, mặc thoải mái. Màu ít phai sau khi giặt.",
    time: "1 tuần trước"
  },
  {
    name: "Lan Anh",
    initial: "L",
    bgColor: "bg-green-500",
    rating: 4,
    comment: "Áo sơ mi form chuẩn, đường may chắc chắn. Giá hợp lý, tư vấn nhiệt tình.",
    time: "3 ngày trước"
  },
  {
    name: "Hồng Nhung",
    initial: "H",
    bgColor: "bg-purple-500",
    rating: 5,
    comment: "Váy công sở tôn dáng, chất mát, mặc cả ngày không khó chịu. Đóng gói đẹp.",
    time: "5 ngày trước"
  },
  {
    name: "Đức Minh",
    initial: "D",
    bgColor: "bg-blue-500",
    rating: 5,
    comment: "Áo khoác denim cá tính, đường chỉ đẹp. Mặc lên form rất ổn.",
    time: "1 tuần trước"
  },
  {
    name: "Ngọc Trinh",
    initial: "N",
    bgColor: "bg-orange-500",
    rating: 4,
    comment: "Giày sneaker nhẹ, êm chân. Đi nhiều không bị đau. Sẽ quay lại.",
    time: "4 ngày trước"
  }
];

function renderReviews() {
  const host = document.getElementById("reviews-grid");
  if (!host) return;
  host.innerHTML = reviews
    .map((r) => `
    <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 ${r.bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg">${r.initial}</div>
        <div class="ml-4">
          <h4 class="font-bold text-gray-800">${r.name}</h4>
          <div class="flex text-yellow-400">
            ${renderStars(r.rating)}
          </div>
        </div>
      </div>
      <p class="text-gray-600 mb-4">"${r.comment}"</p>
      <div class="text-sm text-gray-500">${r.time}</div>
    </div>
  `)
    .join("");
}


// Add to cart function
async function addToCart(productId, productName, price) {
  try {
    // Show loading state
    const button = event.target.closest('button');
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Check if CartAPI is available
    if (window.CartAPI) {
      const cartAPI = new window.CartAPI();
      const result = await cartAPI.addToCart(productId, 1);
      
      if (result.success) {
        showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
      } else {
        showNotification('Lỗi khi thêm vào giỏ hàng: ' + result.message, 'error');
      }
    } else {
      // Fallback to localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId: productId,
          productName: productName,
          price: price,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('Lỗi khi thêm vào giỏ hàng: ' + error.message, 'error');
  } finally {
    // Reset button state
    button.innerHTML = originalContent;
    button.disabled = false;
  }
}

// Show notification
function showNotification(message, type = 'success') {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
  toast.innerHTML = `<i class="fas ${icon} mr-2"></i>${message}`;
  
  document.body.appendChild(toast);
  
  // Show animation
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Load all products simultaneously
async function loadAllProducts() {
  try {
    // Show loading state for all sections
    showLoadingState('products-grid');
    showLoadingState('best-selling-grid');
    showLoadingState('new-products-grid');
    
    // Load all data simultaneously using Promise.all
    const [productsData, bestSellingData, newProductsData] = await Promise.all([
      fetch('api/products/paged?page=1&size=20').then(res => res.json()),
      fetch('api/products/best-selling?limit=5').then(res => res.json()),
      fetch('api/products/new?limit=4').then(res => res.json())
    ]);
    
    // Process products data
    if (productsData.success && productsData.data && productsData.data.items) {
      products = productsData.data.items.map(product => ({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price) + ' ₫',
        originalPrice: null,
        discount: null,
        rating: 4,
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg',
        buttonType: "cart",
        colorVariants: ["bg-gray-400", "bg-blue-500", "bg-red-500"],
        outOfStock: product.stock <= 0,
      }));
    }
    
    // Process best selling data
    if (bestSellingData.success && bestSellingData.data) {
      bestSellingProducts = bestSellingData.data.map(product => ({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price) + ' ₫',
        rating: 4,
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg',
        available: product.stock || 0,
        sold: Math.floor(Math.random() * 50) + 10,
        outOfStock: product.stock <= 0,
      }));
    }
    
    // Process new products data
    if (newProductsData.success && newProductsData.data) {
      newProducts = newProductsData.data.map(product => ({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price) + ' ₫',
        originalPrice: null,
        discount: "MỚI",
        rating: 0,
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg',
        buttonType: "cart",
        colorVariants: ["bg-pink-300", "bg-yellow-200", "bg-blue-300"],
        outOfStock: product.stock <= 0,
      }));
    }
    
    // Render all sections simultaneously
    renderProducts();
    renderBestSellingProducts();
    renderNewProducts();
    
  } catch (error) {
    console.error('Error loading products:', error);
    showErrorState('products-grid', 'Không thể tải sản phẩm');
    showErrorState('best-selling-grid', 'Không thể tải sản phẩm bán chạy');
    showErrorState('new-products-grid', 'Không thể tải sản phẩm mới');
  }
}

// Initialize products when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Load all data from API simultaneously
  loadAllProducts();
  
  // Render static content
  renderPromoCards();
  renderReviews();
});
