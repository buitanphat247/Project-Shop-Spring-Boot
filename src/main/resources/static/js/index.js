// Products data array (fashion)
const products = [
  {
    id: 1,
    name: "Áo Thun Nam Cotton",
    price: "189.000 ₫",
    originalPrice: "259.000 ₫",
    discount: "-27%",
    rating: 5,
    image: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
    buttonType: "cart",
    colorVariants: ["bg-black", "bg-gray-400", "bg-red-500"],
    outOfStock: false,
  },
  {
    id: 2,
    name: "Quần Jeans Nữ Lưng Cao",
    price: "399.000 ₫",
    originalPrice: null,
    discount: null,
    rating: 4,
    image: "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
    buttonType: "cart",
    colorVariants: ["bg-blue-800", "bg-gray-600"],
    outOfStock: false,
  },
  {
    id: 3,
    name: "Áo Sơ Mi Trắng Classic",
    price: "329.000 ₫",
    originalPrice: "420.000 ₫",
    discount: "-22%",
    rating: 4,
    image: "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
    buttonType: "cart",
    colorVariants: ["bg-white", "bg-black"],
    outOfStock: false,
  },
  {
    id: 4,
    name: "Váy Công Sở Thanh Lịch",
    price: "459.000 ₫",
    originalPrice: "560.000 ₫",
    discount: "-18%",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s",
    buttonType: "cart",
    colorVariants: ["bg-pink-300", "bg-gray-200"],
    outOfStock: false,
  },
  {
    id: 5,
    name: "Giày Sneaker Trắng",
    price: "599.000 ₫",
    originalPrice: null,
    discount: null,
    rating: 4,
    image: "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
    buttonType: "cart",
    colorVariants: ["bg-white", "bg-black"],
    outOfStock: false,
  },
  {
    id: 6,
    name: "Áo Khoác Denim",
    price: "489.000 ₫",
    originalPrice: "649.000 ₫",
    discount: "-25%",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yDva6T0UfL4OacdxCrZqErvd8FIxZNbf0A&s",
    buttonType: "cart",
    colorVariants: ["bg-blue-700", "bg-gray-700"],
    outOfStock: false,
  },
  {
    id: 7,
    name: "Quần Short Kaki",
    price: "259.000 ₫",
    originalPrice: null,
    discount: null,
    rating: 4,
    image: "https://pos.nvncdn.com/4e732c-26/art/artCT/20210510_LQurOt2vEZXrgsRaG9WqNnyQ.jpg",
    buttonType: "cart",
    colorVariants: ["bg-yellow-600", "bg-gray-500"],
    outOfStock: false,
  },
  {
    id: 8,
    name: "Set Phụ Kiện Thời Trang",
    price: "199.000 ₫",
    originalPrice: "249.000 ₫",
    discount: "-20%",
    rating: 4,
    image: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-4.jpg",
    buttonType: "cart",
    colorVariants: ["bg-black", "bg-gray-300"],
    outOfStock: false,
  },
];

// New Products data array (fashion)
const newProducts = [
  {
    id: 1,
    name: "Đầm Hoa Mùa Thu",
    price: "529.000 ₫",
    originalPrice: null,
    discount: "MỚI",
    rating: 0,
    image: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
    buttonType: "cart",
    colorVariants: ["bg-pink-300", "bg-yellow-200"],
    outOfStock: false,
  },
  {
    id: 2,
    name: "Áo Polo Nam",
    price: "299.000 ₫",
    originalPrice: null,
    discount: "MỚI",
    rating: 0,
    image: "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
    buttonType: "cart",
    colorVariants: ["bg-blue-700", "bg-gray-400"],
    outOfStock: false,
  },
  {
    id: 3,
    name: "Chân Váy Chữ A",
    price: "349.000 ₫",
    originalPrice: null,
    discount: "MỚI",
    rating: 0,
    image: "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
    buttonType: "cart",
    colorVariants: ["bg-black", "bg-gray-200"],
    outOfStock: false,
  },
  {
    id: 4,
    name: "Áo Hoodie Unisex",
    price: "459.000 ₫",
    originalPrice: null,
    discount: "MỚI",
    rating: 0,
    image: "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
    buttonType: "cart",
    colorVariants: ["bg-gray-700", "bg-black"],
    outOfStock: false,
  },
];

// Best Selling Products data array (fashion)
const bestSellingProducts = [
  {
    id: 1,
    name: "Áo Thun Nam Cotton",
    price: "189.000 ₫",
    rating: 5,
    image: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
    available: 3,
    sold: 12,
    outOfStock: false,
  },
  {
    id: 2,
    name: "Quần Jeans Nữ Lưng Cao",
    price: "399.000 ₫",
    rating: 4,
    image: "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
    available: 8,
    sold: 15,
    outOfStock: false,
  },
  {
    id: 3,
    name: "Áo Sơ Mi Trắng Classic",
    price: "329.000 ₫",
    rating: 4,
    image: "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
    available: 5,
    sold: 10,
    outOfStock: false,
  },
  {
    id: 4,
    name: "Váy Công Sở Thanh Lịch",
    price: "459.000 ₫",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s",
    available: 6,
    sold: 9,
    outOfStock: false,
  },
  {
    id: 5,
    name: "Giày Sneaker Trắng",
    price: "599.000 ₫",
    rating: 4,
    image: "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
    available: 4,
    sold: 11,
    outOfStock: false,
  },
];

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
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
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
            <button class="${product.outOfStock ? "bg-gray-400" : "bg-[#2f604a]"
      } text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1e3d2e] transition-colors">
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
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
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
          <button class="bg-[#2f604a] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1e3d2e] transition-colors">
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
    productsGrid.innerHTML = products.map((product) => renderProductCard(product)).join("");
  }
}

// Render new products
function renderNewProducts() {
  const newProductsGrid = document.getElementById("new-products-grid");
  if (newProductsGrid) {
    newProductsGrid.innerHTML = newProducts.map((product) => renderProductCard(product)).join("");
  }
}

// Render best selling products
function renderBestSellingProducts() {
  const bestSellingGrid = document.getElementById("best-selling-grid");
  if (bestSellingGrid) {
    bestSellingGrid.innerHTML = bestSellingProducts.map((product) => renderBestSellingCard(product)).join("");
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

// Knowledge Articles data + renderer (fashion)
const articles = [
  {
    image: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
    alt: "Mix & Match áo thun",
    date: { day: "08", month: "TH3" },
    author: "Monamedia — Fashion, Lifestyle",
    title: "5 Cách Phối Áo Thun Chuẩn Trend",
    excerpt: "Biến áo thun cơ bản thành set đồ cá tính cho nhiều hoàn cảnh khác nhau..."
  },
  {
    image: "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
    alt: "Jeans lưng cao",
    date: { day: "25", month: "TH2" },
    author: "Monamedia — Fashion, Lifestyle",
    title: "Chọn Quần Jeans Phù Hợp Dáng Người",
    excerpt: "Mẹo chọn jeans tôn dáng, thoải mái và dễ phối đồ cho nàng..."
  },
  {
    image: "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
    alt: "Áo sơ mi trắng",
    date: { day: "25", month: "TH2" },
    author: "Monamedia — Fashion, Lifestyle",
    title: "Sơ Mi Trắng: Item Không Thể Thiếu",
    excerpt: "Tại sao sơ mi trắng luôn là món đồ must-have trong tủ áo của bạn..."
  },
  {
    image: "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
    alt: "Phụ kiện thời trang",
    date: { day: "25", month: "TH2" },
    author: "Monamedia — Fashion",
    title: "Phụ Kiện: Điểm Nhấn Cho Outfit",
    excerpt: "Cách chọn phụ kiện giúp outfit của bạn nổi bật mà vẫn tinh tế..."
  }
];

function renderArticles() {
  const host = document.getElementById("articles-grid");
  if (!host) return;
  host.innerHTML = articles
    .map((a) => `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="relative">
        <img src="${a.image}" alt="${a.alt}" class="w-full h-48 object-cover" />
        <div class="absolute top-3 left-3 bg-[#cd5d4a] text-white px-3 py-1 rounded text-sm font-bold">
          <div class="text-center">
            <div class="text-xs">${a.date.month}</div>
            <div class="text-lg font-bold">${a.date.day}</div>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-center text-sm text-gray-500 mb-3">
          <i class="fas fa-user mr-2"></i>
          <i class="fas fa-tag mr-2"></i>
          <span>${a.author}</span>
        </div>
        <h3 class="font-bold text-lg text-gray-800 mb-3">${a.title}</h3>
        <p class="text-gray-600 text-sm mb-4">${a.excerpt}</p>
        <button class="bg-[#2f604a] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#1e3d2e] transition-colors">
          XEM THÊM
        </button>
      </div>
    </div>
  `)
    .join("");
}

// Initialize products when page loads
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  renderNewProducts();
  renderBestSellingProducts();
  renderPromoCards();
  renderReviews();
  renderArticles();
});
