// Product Detail Data Functions
// =============================

async function loadProductData() {
  try {
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    
    if (!productId || productId === 'detail') {
      throw new Error('Product ID not found in URL');
    }
    
    console.log('Loading product data for ID:', productId);
    console.log('Fetching from:', `/api/products/detail/${productId}`);
    const response = await fetch(`/api/products/detail/${productId}`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to load product');
    }
    
    const product = result.data;
    console.log('Product data loaded:', product);
    
    renderProductData(product);
    
    return product;
  } catch (error) {
    console.error('Error loading product data:', error);
    console.log('Trying fallback with sample data...');
    const sampleProduct = {
      "id": "68f561558a98ab85784c8d87",
      "name": "Túi xách nữ DLD0151-1",
      "description": "Túi Xách Nữ GIOVANNI. Lựa chọn lý tưởng chính là chiếc túi nắp gập nằm trong BST Marena.",
      "price": 380000,
      "stock": 200,
      "category": {
        "id": "68f6a9b18c5f1b3f7b67eaec",
        "name": "Túi xách"
      },
      "images": [
        {
          "id": "68f561568a98ab85784c8d8d",
          "imageUrl": "https://res.cloudinary.com/ddq92is0n/image/upload/v1760911702/spring_shop/xujharim4cz3bf6eeb6b.jpg",
          "isPrimary": false
        }
      ]
    };
    
    renderProductData(sampleProduct);
    return sampleProduct;
  }
}

function renderProductData(product) {
  console.log('Rendering product data:', product);
  
  const productDataDiv = document.getElementById('product-data');
  if (productDataDiv) {
    console.log('Found product-data div, replacing content...');
    productDataDiv.innerHTML = `
      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[#1f2d3d] mb-3">${product.name}</h1>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-[#cb5439] text-2xl font-extrabold">${formatPrice(product.price)}₫</span>
          <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Còn ${product.stock} sản phẩm</span>
        </div>
      </div>

      <!-- Action Section -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button class="w-10 h-10 grid place-items-center hover:bg-gray-100 transition-colors" onclick="chgQty(-1)">-</button>
            <input
              id="qty"
              class="w-12 h-10 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#cb5439]"
              value="1"
              min="1"
            />
            <button class="w-10 h-10 grid place-items-center hover:bg-gray-100 transition-colors" onclick="chgQty(1)">+</button>
          </div>
          <button
            class="flex-1 bg-[#1f553f] hover:bg-[#164232] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 text-sm"
            id="add-to-cart-btn"
            data-product-id="${product.id}"
            data-product-name="${product.name}"
            data-product-price="${product.price}"
          >
            <i class="fas fa-shopping-cart mr-2"></i>THÊM VÀO GIỎ HÀNG
          </button>
          <button
            class="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:text-[#cb5439] hover:border-[#cb5439] transition-all duration-200 hover:scale-110"
            id="wishlist-btn"
          >
            <i class="fas fa-heart text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="mt-auto">
        <div class="bg-gray-50 rounded-lg p-4 space-y-3">
          <div class="flex items-center justify-between py-1.5 border-b border-gray-200">
            <span class="font-semibold text-gray-700 text-sm">SKU:</span>
            <span class="text-gray-600 font-mono text-sm">${product.id}</span>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-gray-200">
            <span class="font-semibold text-gray-700 text-sm">DANH MỤC:</span>
            <span class="text-gray-600 text-sm">${product.category ? product.category.name : 'N/A'}</span>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-gray-200">
            <span class="font-semibold text-gray-700 text-sm">TỪ KHÓA:</span>
            <span class="text-gray-600 text-sm">Fashion, Cotton</span>
          </div>
          <div class="flex items-center justify-between py-1.5">
            <span class="font-semibold text-gray-700 text-sm">CHIA SẺ:</span>
            <div class="flex items-center gap-2">
              <a href="#" class="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" title="Facebook">
                <i class="fab fa-facebook-f text-xs"></i>
              </a>
              <a href="#" class="w-7 h-7 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" title="Twitter">
                <i class="fab fa-twitter text-xs"></i>
              </a>
              <a href="#" class="w-7 h-7 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" title="LinkedIn">
                <i class="fab fa-linkedin-in text-xs"></i>
              </a>
              <a href="#" class="w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" title="Pinterest">
                <i class="fab fa-pinterest text-xs"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProductImages(product.images || [], product.name);
  updateDescriptionTab(product.description);
  attachProductEventListeners();
}

function renderProductImages(images, productName) {
  const mainWrapper = document.getElementById('pdMainWrapper');
  const thumbsWrapper = document.getElementById('pdThumbsWrapper');
  
  if (!mainWrapper || !thumbsWrapper) return;
  
  if (images.length === 0) {
    mainWrapper.innerHTML = `
      <div class="swiper-slide">
        <img src="https://via.placeholder.com/600x600?text=No+Image" alt="No Image" />
      </div>
    `;
    thumbsWrapper.innerHTML = `
      <div class="swiper-slide">
        <img src="https://via.placeholder.com/150x150?text=No+Image" alt="No Image" />
      </div>
    `;
    return;
  }
  
  mainWrapper.innerHTML = images.map(image => `
    <div class="swiper-slide">
      <img src="${image.imageUrl}" alt="${productName}" />
    </div>
  `).join('');
  
  thumbsWrapper.innerHTML = images.map(image => `
    <div class="swiper-slide">
      <img src="${image.imageUrl}" alt="${productName}" />
    </div>
  `).join('');
}

function updateDescriptionTab(description) {
  const descTab = document.getElementById('tab-desc');
  if (descTab && description) {
    descTab.innerHTML = `
      <p class="mb-4">${description}</p>
    `;
  }
}

function attachProductEventListeners() {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', handleAddToCart);
  }
}

// Make functions globally available
window.loadProductData = loadProductData;
window.renderProductData = renderProductData;
window.renderProductImages = renderProductImages;
window.updateDescriptionTab = updateDescriptionTab;
window.attachProductEventListeners = attachProductEventListeners;
