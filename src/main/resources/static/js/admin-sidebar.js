(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('adminSidebarNav');
    if (!nav) return;

    const items = [
      { type: 'link', href: '/auth/dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard', color: '' },
      { type: 'group', icon: 'fas fa-box text-blue-500', text: 'Sản phẩm', children: [
        { href: '/admin/products', icon: 'fas fa-list text-gray-500', text: 'Danh sách' },
        { href: '/admin/products/create', icon: 'fas fa-plus text-gray-500', text: 'Thêm mới' },
        { href: '/admin/products/deleted', icon: 'fas fa-trash-restore-alt text-gray-500', text: 'Lịch sử xóa' },
      ]},
      { type: 'group', icon: 'fas fa-newspaper text-indigo-500', text: 'Tin tức', children: [
        { href: '/admin/news', icon: 'fas fa-list text-gray-500', text: 'Danh sách' },
        { href: '/admin/news/create', icon: 'fas fa-plus text-gray-500', text: 'Thêm mới' },
        { href: '/admin/news/deleted', icon: 'fas fa-trash-restore-alt text-gray-500', text: 'Lịch sử xóa' },
      ]},
      { type: 'group', icon: 'fas fa-shopping-cart text-orange-500', text: 'Đơn hàng', children: [
        { href: '/admin/orders', icon: 'fas fa-list text-gray-500', text: 'Tất cả đơn hàng' },
        { href: '/admin/orders/pending', icon: 'fas fa-clock text-gray-500', text: 'Chờ xử lý' },
      ]},
      { type: 'group', icon: 'fas fa-users text-purple-500', text: 'Khách hàng', children: [
        { href: '/admin/customers', icon: 'fas fa-list text-gray-500', text: 'Danh sách' },
        { href: '/admin/customers/blocked-history', icon: 'fas fa-user-slash text-gray-500', text: 'Lịch sử chặn' },
      ]},
      { type: 'link', href: '/admin/analytics', icon: 'fas fa-chart-bar text-red-500', text: 'Thống kê' },
      { type: 'link', href: '/auth/logout', icon: 'fas fa-sign-out-alt text-red-500', text: 'Đăng xuất', extra: 'hover:bg-red-50 text-red-500' },
    ];

    function createLink(item, extra='') {
      const a = document.createElement('a');
      a.href = item.href || '#';
      a.className = `flex items-center space-x-3 p-3 rounded-lg  ${extra} ${item.extra || ''}`.trim();
      a.innerHTML = `<i class="${item.icon} menu-icon"></i><span class="menu-text">${item.text}</span>`;
      return a;
    }

    function createGroup(item) {
      const header = document.createElement('div');
      header.className = 'menu-header cursor-pointer flex items-center justify-between p-3 rounded-lg ';
      header.innerHTML = `<div class=\"flex items-center space-x-3\"><i class=\"${item.icon} menu-icon\"></i><span class=\"menu-text\">${item.text}</span></div><i class=\"fas fa-chevron-down text-gray-400 text-xs\"></i>`;

      const submenu = document.createElement('div');
      submenu.className = 'submenu ml-4';
      (item.children || []).forEach(child => submenu.appendChild(createLink(child, 'p-2')));

      header.addEventListener('click', () => {
        submenu.classList.toggle('open');
        const chev = header.querySelector('.fa-chevron-down');
        if (chev) chev.classList.toggle('rotate-180');
      });

      return [header, submenu];
    }

    // Render
    items.forEach(item => {
      if (item.type === 'link') nav.appendChild(createLink(item));
      else {
        const [h, s] = createGroup(item);
        nav.appendChild(h); nav.appendChild(s);
      }
    });

    // Active link highlight by pathname (chọn khớp nhất)
    const path = window.location.pathname;
    const links = Array.from(nav.querySelectorAll('a[href]'));
    links.forEach(a => a.classList.remove('bg-green-500','text-white'));

    function scoreMatch(href) {
      if (!href || href === '#') return -1;
      if (href === path) return 100000 + href.length; // ưu tiên khớp tuyệt đối
      const prefix = href.endsWith('/') ? href : href + '/';
      return path.startsWith(prefix) ? href.length : -1; // khớp tiền tố dài nhất
    }

    let best = null, bestScore = -1;
    links.forEach(a => {
      const s = scoreMatch(a.getAttribute('href'));
      if (s > bestScore) { bestScore = s; best = a; }
    });

    if (best) {
      best.classList.add('bg-green-500','text-white');
      const submenu = best.closest('.submenu');
      if (submenu) {
        submenu.classList.add('open');
        const header = submenu.previousElementSibling;
        if (header) {
          const chev = header.querySelector('.fa-chevron-down');
          if (chev) chev.classList.add('rotate-180');
          header.classList.add('bg-green-50');
        }
      }
    }

    // Ngăn click vào mục con làm ảnh hưởng header (đóng/mở ngoài ý muốn)
    nav.querySelectorAll('.submenu a').forEach(a => {
      a.addEventListener('click', (e) => e.stopPropagation());
    });
  });
})();
