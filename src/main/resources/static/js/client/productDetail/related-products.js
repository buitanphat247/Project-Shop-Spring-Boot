// Product Detail Related Products Functions
// ==========================================

async function loadRelatedProducts() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Fetching 20 products from API...');
      const response = await fetch(`/api/products/paged?page=1&size=20`);
      const data = await response.json();
      console.log('API response:', data);

      if (data.success && data.data && data.data.items) {
        const products = data.data.items;
        console.log(`Found ${products.length} products`);
        
        renderRelatedProducts(products);
        resolve(products);
      } else {
        showRelatedProductsError();
        reject(new Error("No products found"));
      }
    } catch (error) {
      console.error("Error loading related products:", error);
      showRelatedProductsError();
      reject(error);
    }
  });
}

function renderRelatedProducts(products) {
  console.log(`Rendering ${products.length} related products:`, products);
  const container = document.getElementById("relatedProducts");

  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-5 flex justify-center items-center py-8">
        <p class="text-gray-500">Không có sản phẩm liên quan</p>
      </div>
    `;
    return;
  }

  const productsHTML = products
    .map((product, index) => {
      console.log(`Product ${index + 1}:`, {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        images: product.images ? product.images.length : 0,
        firstImage: product.images && product.images.length > 0 ? product.images[0].imageUrl : 'No image'
      });
      
      const price = formatPrice(product.price);
      const imageUrl =
        product.images && product.images.length > 0
          ? product.images[0].imageUrl
          : "https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg";

      return `
      <a href="/products/detail/${product.id}" class="block" id="related-product-${product.id}">
        <div class="product-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
          <div class="relative overflow-hidden">
            <img src="${imageUrl}"
                 alt="${product.name}"
                 class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500"
                      onclick="event.preventDefault(); event.stopPropagation(); addToWishlist('${product.id}', '${product.name}')">
                <i class="fas fa-heart text-sm"></i>
              </button>
            </div>
            ${
              product.images && product.images.length > 1
                ? `
              <div class="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                <i class="fas fa-images mr-1"></i>
                ${product.images.length}
              </div>
            `
                : ""
            }
          </div>

          <div class="p-4 flex flex-col justify-between">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-1" title="${product.name}">
                ${product.name}
              </h3>

              <div class="flex items-center justify-between mb-3">
                <span class="text-lg font-bold text-[#cb5439]">${price}₫</span>
                <span class="text-sm text-gray-500">Còn ${product.stock} sản phẩm</span>
              </div>

              <div class="flex items-center gap-2 mb-3">
                <div class="flex text-yellow-400">
                  ${generateStars(4.5)}
                </div>
                <span class="text-sm text-gray-500">(24 đánh giá)</span>
              </div>
            </div>

            <div>
              <button class="add-to-cart-btn w-full bg-[#2f604a] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1e4a3a] transition-all duration-300"
                      onclick="event.preventDefault(); event.stopPropagation(); addToCartFromDetail('${product.id}', '${product.name}', ${product.price}, 1)">
                <i class="fas fa-shopping-cart mr-2"></i>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </a>
    `;
    })
    .join("");

  container.innerHTML = productsHTML;
}

function showRelatedProductsError() {
  const container = document.getElementById("relatedProducts");
  container.innerHTML = `
    <div class="col-span-5 flex justify-center items-center py-8">
      <div class="text-center">
        <div class="text-red-500 mb-2">
          <i class="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <p class="text-gray-500">Không thể tải sản phẩm liên quan</p>
        <button onclick="loadRelatedProducts()" class="mt-2 text-[#cb5439] hover:underline text-sm">
          Thử lại
        </button>
      </div>
    </div>
  `;
}

// Make functions globally available
window.loadRelatedProducts = loadRelatedProducts;
window.renderRelatedProducts = renderRelatedProducts;
window.showRelatedProductsError = showRelatedProductsError;
