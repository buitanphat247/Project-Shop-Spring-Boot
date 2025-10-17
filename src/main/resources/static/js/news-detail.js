// Mock detail from query (?id=) or fallback
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';
const items = [
  { id: '1', date: '05/10/2025', cat: 'Thời trang', title: '5 cách phối áo thun để luôn đẹp mọi lúc', img: 'https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-3.jpg' },
  { id: '2', date: '12/10/2025', cat: 'Lookbook', title: 'Quần jeans lưng cao: tôn dáng và dễ phối', img: 'https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg' },
  { id: '3', date: '09/10/2025', cat: 'Thời trang', title: 'Sơ mi trắng – item không thể thiếu', img: 'https://lavenderstudio.com.vn/wp-content/uploads/2021/05/chup-hinh-san-pham-cho-shop2.png' },
  { id: '4', date: '07/10/2025', cat: 'Khuyến mãi', title: 'Váy công sở: thanh lịch nơi công sở', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s' },
  { id: '5', date: '04/10/2025', cat: 'Thời trang', title: 'Giày sneaker trắng: phù hợp mọi outfit', img: 'https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg' },
  { id: '6', date: '02/10/2025', cat: 'Lookbook', title: 'Áo khoác denim: cá tính và bền bỉ', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yDva6T0UfL4OacdxCrZqErvd8FIxZNbf0A&s' },
  { id: '7', date: '30/09/2025', cat: 'Thời trang', title: 'Quần short kaki: thoải mái cho ngày hè', img: 'https://pos.nvncdn.com/4e732c-26/art/artCT/20210510_LQurOt2vEZXrgsRaG9WqNnyQ.jpg' },
  { id: '8', date: '28/09/2025', cat: 'Phụ kiện', title: 'Phụ kiện nâng tầm set đồ của bạn', img: 'https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-4.jpg' }
];
const current = items.find(i => i.id === id) || items[0];
document.getElementById('cover').src = current.img;
document.getElementById('meta').textContent = `${current.date} • ${current.cat}`;
document.getElementById('title').textContent = current.title;

// related
const related = items.filter(i => i.id !== current.id).slice(0, 5);
const ul = document.getElementById('related');
if (ul) ul.innerHTML = related.map(r => `<li class="flex items-center gap-3">
    <img src="${r.img}" class="w-16 h-12 object-cover rounded" alt="${r.title}">
    <div>
      <div class="text-xs text-gray-500">${r.date} • ${r.cat}</div>
      <a href="/news/detail?id=${r.id}" class="text-sm font-semibold text-[#1f2d3d] hover:text-[#cb5439]">${r.title}</a>
    </div>
  </li>`).join('');

// categories mock
const cats = ['Thời trang', 'Lookbook', 'Khuyến mãi'];
const catEl = document.getElementById('cat-list');
if (catEl) catEl.innerHTML = cats.map(c => `<li class="py-3 flex items-center"><span class="w-1.5 h-1.5 bg-[#2f604a] rounded-full mr-3"></span><a href="#" class="hover:text-[#cb5439]">${c}</a></li>`).join('');

// latest posts (reuse items)
const latestEl = document.getElementById('latest');
if (latestEl) latestEl.innerHTML = items.slice(0, 3).map(p => `
  <a href="/news/detail?id=${p.id}" class="flex items-center gap-3">
    <img src="${p.img}" class="w-16 h-16 object-cover rounded" alt="${p.title}">
    <div>
      <div class="text-xs text-gray-500">${p.date}</div>
      <div class="text-sm font-semibold text-[#1f2d3d] line-clamp-2">${p.title}</div>
    </div>
  </a>
`).join('');

// demo submit
const form = document.getElementById('commentForm');
if (form) form.addEventListener('submit', function (e) {
  e.preventDefault();
  const msg = document.getElementById('commentSuccess');
  if (msg) { msg.classList.remove('hidden'); setTimeout(() => msg.classList.add('hidden'), 2500); }
  form.reset();
});

// related cards render (reuse 'related')
const relCards = document.getElementById('related-cards');
if (relCards) relCards.innerHTML = related.map(r => `
  <article class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <a href="/news/detail?id=${r.id}" class="block aspect-[4/3] overflow-hidden">
      <img class="w-full h-full object-cover" src="${r.img}" alt="${r.title}" />
    </a>
    <div class="p-4">
      <div class="text-xs text-gray-500">${r.date} • ${r.cat}</div>
      <h4 class="mt-1 font-semibold text-[#1f2d3d]">${r.title}</h4>
    </div>
  </article>
`).join('');
