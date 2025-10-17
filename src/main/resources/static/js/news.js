const newsItems = [
  {
    date: '12/10/2025', category: 'Phong cách',
    title: 'Bí quyết phối áo thun và quần jean chuẩn trend',
    excerpt: 'Học cách phối áo thun basic cùng quần jean để tạo phong cách năng động, trẻ trung cho mọi dịp.',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '09/10/2025', category: 'Xu hướng',
    title: 'Top 5 mẫu áo sơ mi nữ thanh lịch 2025',
    excerpt: 'Cập nhật ngay các kiểu áo sơ mi được ưa chuộng nhất, giúp bạn tự tin trong mọi hoàn cảnh.',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '05/10/2025', category: 'Mẹo hay',
    title: 'Cách bảo quản quần áo để luôn như mới',
    excerpt: 'Giữ quần áo bền màu, không bai giãn với các mẹo giặt và phơi đơn giản mà hiệu quả.',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '03/10/2025', category: 'Thời trang nam',
    title: 'Phong cách tối giản cho phái mạnh – đơn giản mà cuốn hút',
    excerpt: 'Áo polo, sơ mi và quần kaki – công thức tạo nên phong thái lịch lãm cho các chàng trai hiện đại.',
    image: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '30/09/2025', category: 'Thời trang nữ',
    title: '5 gợi ý mix đồ công sở thanh lịch cho nàng',
    excerpt: 'Từ áo sơ mi trắng đến chân váy bút chì – phối thế nào để vừa thanh lịch vừa thoải mái?',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '27/09/2025', category: 'Mẹo mua sắm',
    title: 'Cách chọn size quần áo online không lo bị sai',
    excerpt: 'Những bí kíp giúp bạn đo chính xác và chọn size phù hợp khi mua hàng trực tuyến.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '25/09/2025', category: 'Bí quyết',
    title: 'Phân biệt chất liệu vải – cotton, linen và polyester',
    excerpt: 'Tìm hiểu đặc điểm từng loại vải để chọn trang phục phù hợp với thời tiết và phong cách.',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '22/09/2025', category: 'Xu hướng',
    title: 'Màu sắc chủ đạo trong thời trang thu đông 2025',
    excerpt: 'Khám phá bảng màu thời trang được dự đoán “lên ngôi” trong mùa thu đông năm nay.',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1500&auto=format&fit=crop'
  },
  {
    date: '20/09/2025', category: 'Khuyến mãi',
    title: 'Ưu đãi tháng 10: Giảm đến 40% cho bộ sưu tập Thu – Đông',
    excerpt: 'Cơ hội sở hữu những mẫu áo khoác, hoodie hot nhất với mức giá cực hấp dẫn.',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1500&auto=format&fit=crop'
  }
];

function newsCard(n) {
  return `
   <article class="news-card bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
<a href="/news/detail/1" class="block aspect-[4/3] overflow-hidden">
  <img
    class="w-full h-full object-cover"
   src="${n.image}" alt="${n.title}"
  />
</a>

<div class="p-4 flex flex-col flex-1">
  <div class="flex-1">
    <div class="text-xs text-gray-500 mb-1">${n.date} • ${n.category}</div>
    <h3 class="font-semibold text-[17px] text-[#1f2d3d] line-clamp-2">
    ${n.title}
    </h3>
    <p class="mt-2 text-sm text-gray-600 line-clamp-3">
    ${n.excerpt}
    </p>
  </div>
  <div class="mt-4">
    <a href="#" class="inline-flex items-center gap-2 text-[#cb5439] font-medium mt-auto">
      Đọc tiếp <i class="fas fa-arrow-right text-xs"></i>
    </a>
  </div>
</div>
</article>
`;
}

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('news-grid');
  if (grid) grid.innerHTML = newsItems.map(newsCard).join('');
});
