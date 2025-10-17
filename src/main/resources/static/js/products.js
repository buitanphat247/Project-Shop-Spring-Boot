// Sample data (24 items - quần áo)
const clothesImages = [
  "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
  "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
  "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s",
  "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yDva6T0UfL4OacdxCrZqErvd8FIxZNbf0A&s",
  "https://pos.nvncdn.com/4e732c-26/art/artCT/20210510_LQurOt2vEZXrgsRaG9WqNnyQ.jpg",
  "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-4.jpg",
];

const products = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Áo Thun Nam Cotton Cổ Tròn",
    "Áo Sơ Mi Nữ Tay Dài Công Sở",
    "Quần Jean Nam Slim Fit",
    "Đầm Hoa Nữ Dáng Dài",
    "Áo Khoác Gió Unisex",
    "Chân Váy Jean Nữ Trẻ Trung",
    "Áo Polo Nam Thời Trang",
    "Áo Hoodie Nỉ Dày Ấm Áp",
  ][i % 8] + ` ${i + 1}`,
  price: [159000, 199000, 249000, 189000][i % 4],
  oldPrice: i % 3 === 0 ? 289000 : null,
  discount: i % 3 === 0 ? "-30%" : i % 4 === 1 ? "-15%" : "",
  available: [10, 7, 12, 5][i % 4],
  sold: [25, 18, 30, 20][i % 4],
  progress: [70, 55, 85, 60][i % 4],
  rating: 3 + (i % 3),
  img: clothesImages[i % clothesImages.length],
}));

const pageSize = 12;
let currentPage = 1;

function renderStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fas fa-star ${i <= rating ? "" : "text-gray-300"}" style="color:#ffb400"></i>`;
  }
  return html;
}

function formatPrice(n) {
  return n.toLocaleString("vi-VN") + " đ";
}

function renderGrid() {
  const grid = document.getElementById("product-grid");
  const start = (currentPage - 1) * pageSize;
  const slice = products.slice(start, start + pageSize);
  grid.innerHTML = slice
    .map(
      (p) => `
    <article class="product-card bg-white rounded-2xl shadow border border-gray-200 overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
      <div class="p-4">
        <div class="relative aspect-[4/3] bg-white rounded-xl overflow-hidden">
          <a href="/products/detail/${p.id}" class="block w-full h-full">
            <img src="${p.img}" alt="${p.name}" class="product-image w-full h-full object-cover" />
          </a>
          ${
            p.discount
              ? `<span class="absolute left-3 top-3 bg-[#e2553f] text-white text-xs font-semibold px-2 py-1 rounded-full">${p.discount}</span>`
              : ""
          }
        </div>
        <h4 class="mt-3 text-[15px] font-semibold text-[#1f2d3d]">
          <a href="/products/detail/${p.id}" class="hover:text-[#cb5439]">${p.name}</a>
        </h4>
        <div class="mt-2">${renderStars(p.rating)}</div>
        <div class="mt-2 flex items-center justify-between">
          <div class="text-[#cb5439] font-extrabold text-xl">${formatPrice(p.price)}</div>
          <button class="add-to-cart-btn w-10 h-10 rounded-full bg-[#2f604a] text-white grid place-items-center hover:bg-[#254d3b] transition-all duration-300 hover:transform hover:scale-110">
            <i class="fas fa-basket-shopping"></i>
          </button>
        </div>
        <div class="mt-3 flex items-center justify-between text-[13px] text-gray-600">
          <span>Có sẵn: ${p.available}</span>
          <span>Đã bán: ${p.sold}</span>
        </div>
        <div class="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-[#2f604a] rounded-full transition-all duration-300" style="width:${p.progress}%"></div>
        </div>
      </div>
    </article>
  `
    )
    .join("");
}

function renderPagination() {
  const totalPages = Math.ceil(products.length / pageSize);
  const container = document.getElementById("pagination");
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  function pageButton(num, label = num) {
    const active = num === currentPage ? "bg-[#cb5439] text-white" : "bg-white text-gray-700 hover:bg-gray-50";
    return `<button data-page="${num}" class="min-w-9 h-9 px-3 rounded-md border border-gray-300 ${active}">${label}</button>`;
  }

  let html = "";
  html += pageButton(Math.max(1, currentPage - 1), "&laquo;");
  for (let i = 1; i <= totalPages; i++) html += pageButton(i);
  html += pageButton(Math.min(totalPages, currentPage + 1), "&raquo;");
  container.innerHTML = html;

  container.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const num = parseInt(btn.getAttribute("data-page"));
      if (num !== currentPage) {
        currentPage = num;
        renderGrid();
        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  renderPagination();
});
