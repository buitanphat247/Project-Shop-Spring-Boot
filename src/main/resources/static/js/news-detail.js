// Mock detail from query (?id=) or fallback
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';
const items = [
  { id:'1', date:'05/10/2025', cat:'Lối sống', title:'Gợi ý bữa sáng healthy nhanh gọn cho dân văn phòng', img:'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1500&auto=format&fit=crop' },
  { id:'2', date:'12/10/2025', cat:'Dinh dưỡng', title:'Bí quyết chọn rau củ tươi ngon đúng mùa', img:'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1500&auto=format&fit=crop' },
  { id:'3', date:'09/10/2025', cat:'Công thức', title:'3 công thức nước ép detox giúp da sáng khoẻ', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop' }
];
const current = items.find(i=>i.id===id) || items[0];
document.getElementById('cover').src = current.img;
document.getElementById('meta').textContent = `${current.date} • ${current.cat}`;
document.getElementById('title').textContent = current.title;

// related
const related = items.filter(i=>i.id!==current.id).slice(0,5);
const ul = document.getElementById('related');
if (ul) ul.innerHTML = related.map(r=>`<li class="flex items-center gap-3">
    <img src="${r.img}" class="w-16 h-12 object-cover rounded" alt="${r.title}">
    <div>
      <div class="text-xs text-gray-500">${r.date} • ${r.cat}</div>
      <a href="/news/detail?id=${r.id}" class="text-sm font-semibold text-[#1f2d3d] hover:text-[#cb5439]">${r.title}</a>
    </div>
  </li>`).join('');

// categories mock
const cats = ['Dairy Farm','Healthy Foods','Lifestyle'];
const catEl = document.getElementById('cat-list');
if (catEl) catEl.innerHTML = cats.map(c=>`<li class="py-3 flex items-center"><span class="w-1.5 h-1.5 bg-[#2f604a] rounded-full mr-3"></span><a href="#" class="hover:text-[#cb5439]">${c}</a></li>`).join('');

// latest posts (reuse items)
const latestEl = document.getElementById('latest');
if (latestEl) latestEl.innerHTML = items.slice(0,3).map(p=>`
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
if (form) form.addEventListener('submit', function(e){
  e.preventDefault();
  const msg = document.getElementById('commentSuccess');
  if (msg) { msg.classList.remove('hidden'); setTimeout(()=>msg.classList.add('hidden'), 2500); }
  form.reset();
});

// related cards render (reuse 'related')
const relCards = document.getElementById('related-cards');
if (relCards) relCards.innerHTML = related.map(r=>`
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
