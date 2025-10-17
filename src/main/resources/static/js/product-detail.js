// Swiper init with thumbs + dynamic rendering
document.addEventListener("DOMContentLoaded", function () {
    try {
        const images = [
            "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
            "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
            "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s",
            "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yDva6T0UfL4OacdxCrZqErvd8FIxZNbf0A&s",
            "https://pos.nvncdn.com/4e732c-26/art/artCT/20210510_LQurOt2vEZXrgsRaG9WqNnyQ.jpg",
            "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-4.jpg",
        ];
        // Render slides
        const mainWrap = document.getElementById("pdMainWrapper");
        const thumbWrap = document.getElementById("pdThumbsWrapper");
        if (mainWrap && thumbWrap) {
            mainWrap.innerHTML = images
                .map((src) => `<div class="swiper-slide"><img src="${src}" alt="slide" class="block w-full h-full object-contain"/></div>`)
                .join("");
            thumbWrap.innerHTML = images
                .map(
                    (src) => `<div class="swiper-slide"><img src="${src}" class="w-full h-full object-cover rounded-lg border border-gray-200"/></div>`
                )
                .join("");
        }

        var thumbs = new Swiper(".pd-thumbs", {
            spaceBetween: 12,
            slidesPerView: 5,
            freeMode: true,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            breakpoints: { 0: { slidesPerView: 3 }, 640: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } },
        });
        const main = new Swiper(".pd-main", {
            loop: true,
            spaceBetween: 10,
            autoplay: { delay: 2500, disableOnInteraction: false },
            thumbs: {
                swiper: thumbs,
            },
        });
    } catch (e) { }
});

// Simple star rating for review form
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var wrap = document.getElementById("rvStars");
        if (!wrap) return;
        var current = 0;
        function paint(n) {
            Array.from(wrap.querySelectorAll("i")).forEach(function (el) {
                var v = parseInt(el.getAttribute("data-v") || "0", 10);
                el.classList.toggle("text-yellow-400", v <= n);
                el.classList.toggle("text-gray-300", v > n);
            });
        }
        wrap.addEventListener("mousemove", function (e) {
            var t = e.target.closest("i");
            if (!t) return;
            paint(parseInt(t.getAttribute("data-v"), 10));
        });
        wrap.addEventListener("mouseleave", function () {
            paint(current);
        });
        wrap.addEventListener("click", function (e) {
            var t = e.target.closest("i");
            if (!t) return;
            current = parseInt(t.getAttribute("data-v"), 10);
            paint(current);
        });
        paint(0);
    });
})();

function chgQty(delta) {
    const i = document.getElementById("qty");
    let v = parseInt(i.value || 1, 10) + delta;
    if (v < 1) v = 1;
    i.value = v;
}
function showTab(name) {
    // Hide all tab contents
    document.getElementById("tab-desc").classList.toggle("hidden", name !== "desc");
    document.getElementById("tab-info").classList.toggle("hidden", name !== "info");
    document.getElementById("tab-review").classList.toggle("hidden", name !== "review");

    // Update tab button styles
    const buttons = document.querySelectorAll('[onclick^="showTab"]');
    buttons.forEach((btn) => {
        btn.classList.remove("text-[#cb5439]", "border-[#cb5439]");
        btn.classList.add("text-gray-600", "border-b-2", "border-transparent");
    });

    // Set active tab
    const activeBtn = document.querySelector(`[onclick="showTab('${name}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove("text-gray-600", "border-transparent");
        activeBtn.classList.add("font-bold", "text-[#cb5439]", "border-b-2", "border-[#cb5439]");
    }
}

// Related products (mock)
const rel = [
    {
        id: 1,
        name: "Áo Thun Nam Cotton",
        price: 189000,
        img: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg",
        available: 8,
        sold: 15,
        progress: 65,
        rating: 5,
    },
    {
        id: 2,
        name: "Quần Jeans Nữ Lưng Cao",
        price: 399000,
        img: "https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg",
        available: 12,
        sold: 9,
        progress: 45,
        rating: 4,
    },
    {
        id: 3,
        name: "Áo Sơ Mi Trắng Classic",
        price: 329000,
        img: "https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png",
        available: 5,
        sold: 20,
        progress: 80,
        rating: 4,
    },
    {
        id: 4,
        name: "Váy Công Sở Thanh Lịch",
        price: 459000,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s",
        available: 20,
        sold: 11,
        progress: 55,
        rating: 5,
    },
    {
        id: 5,
        name: "Áo Khoác Denim",
        price: 489000,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yDva6T0UfL4OacdxCrZqErvd8FIxZNbf0A&s",
        available: 14,
        sold: 7,
        progress: 40,
        rating: 5,
    },
];
function fmtPrice(v) {
    return v.toLocaleString("vi-VN") + " đ";
}
function stars(n) {
    let s = "";
    for (let i = 1; i <= 5; i++) {
        s += `<i class="fa-solid fa-star ${i <= n ? "text-yellow-400" : "text-gray-300"}"></i>`;
    }
    return s;
}
const host = document.getElementById("relatedProducts");
if (host)
    host.innerHTML = rel
        .map(
            (p) => `
    <article class="rp-card overflow-hidden">
      <a class="block aspect-[4/3] overflow-hidden" href="/products/detail/${p.id}">
        <img src="${p.img}" class="w-full h-full object-cover" alt="${p.name}">
      </a>
      <div class="p-4">
        <h4 class="rp-title text-sm mb-1"><a href="/products/detail/${p.id}" class="hover:text-[#cb5439]">${p.name}</a></h4>
        <div class="flex items-center gap-1 mb-2">${stars(p.rating)}</div>
        <div class="flex items-center justify-between mb-3">
          <div class="rp-price">${fmtPrice(p.price)}</div>
          <button class="rp-cart"><i class="fa-solid fa-basket-shopping"></i></button>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1"><span>Có sẵn: ${p.available}</span><span>Đã bán: ${p.sold
                }</span></div>
        <div class="rp-progress"><span style="width:${p.progress}%"></span></div>
      </div>
    </article>
  `
        )
        .join("");
