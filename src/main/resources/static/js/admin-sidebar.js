(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const nav = document.getElementById('adminSidebarNav');
    if (!nav) return;

    const items = [
      { type: 'link', href: '/auth/dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard', color: '' },

      // ========================================================
      // 🏢 QUẢN LÝ CHUNG (Admin/Manager)
      // ========================================================
      {
        type: 'group', icon: 'fas fa-cogs text-blue-600', text: 'Quản lý chung', children: [
          // Quản lý danh mục
          { href: '/admin/categories', icon: 'fas fa-tags text-gray-500', text: 'Danh mục sản phẩm' },

          // Quản lý sản phẩm
          { href: '/admin/products', icon: 'fas fa-box text-gray-500', text: 'Danh sách sản phẩm' },
          { href: '/admin/products/create', icon: 'fas fa-plus text-gray-500', text: 'Thêm sản phẩm' },
          { href: '/admin/products/deleted', icon: 'fas fa-trash-restore-alt text-gray-500', text: 'Sản phẩm đã xóa' },

          // Quản lý khuyến mãi
          { href: '/admin/promotions', icon: 'fas fa-percentage text-gray-500', text: 'Khuyến mãi' },
          { href: '/admin/promotions/create', icon: 'fas fa-plus text-gray-500', text: 'Tạo khuyến mãi' },

          // Quản lý nhân viên
          { href: '/admin/staff', icon: 'fas fa-users text-gray-500', text: 'Nhân viên' },
          { href: '/admin/staff/create', icon: 'fas fa-user-plus text-gray-500', text: 'Thêm nhân viên' },

          // Profile cá nhân
          { href: '/admin/profile', icon: 'fas fa-user-edit text-gray-500', text: 'Profile cá nhân' },

          // Báo cáo tổng quan
          { href: '/admin/reports/revenue', icon: 'fas fa-chart-line text-gray-500', text: 'Báo cáo doanh thu' },
          { href: '/admin/reports/inventory', icon: 'fas fa-warehouse text-gray-500', text: 'Báo cáo tồn kho' },
          { href: '/admin/reports/overview', icon: 'fas fa-chart-pie text-gray-500', text: 'Tổng quan hệ thống' },
        ]
      },

      // ========================================================
      // 🛒 QUẢN LÝ BÁN HÀNG (Sales Staff)
      // ========================================================
      {
        type: 'group', icon: 'fas fa-shopping-cart text-green-600', text: 'Quản lý bán hàng', children: [
          // Tra cứu sản phẩm
          { href: '/admin/sales/products/search', icon: 'fas fa-search text-gray-500', text: 'Tra cứu sản phẩm' },
          { href: '/admin/sales/products', icon: 'fas fa-box text-gray-500', text: 'Danh sách sản phẩm' },
          { href: '/admin/sales/products/edit', icon: 'fas fa-edit text-gray-500', text: 'Sửa sản phẩm' },

          // Quản lý hóa đơn
          { href: '/admin/sales/invoices', icon: 'fas fa-file-invoice text-gray-500', text: 'Danh sách hóa đơn' },
          { href: '/admin/sales/invoices/create', icon: 'fas fa-plus text-gray-500', text: 'Lập hóa đơn' },
          { href: '/admin/sales/invoices/print', icon: 'fas fa-print text-gray-500', text: 'In hóa đơn' },

          // Thống kê bán hàng
          { href: '/admin/sales/reports/revenue', icon: 'fas fa-chart-bar text-gray-500', text: 'Thống kê doanh thu' },
          { href: '/admin/sales/reports/sales', icon: 'fas fa-chart-line text-gray-500', text: 'Báo cáo bán hàng' },
        ]
      },

      // ========================================================
      // 📦 QUẢN LÝ KHO (Warehouse Staff)
      // ========================================================
      {
        type: 'group', icon: 'fas fa-warehouse text-orange-600', text: 'Quản lý kho', children: [
          // Nhập kho
          { href: '/admin/warehouse/import', icon: 'fas fa-arrow-down text-gray-500', text: 'Nhập kho' },
          { href: '/admin/warehouse/import/create', icon: 'fas fa-plus text-gray-500', text: 'Tạo phiếu nhập' },
          { href: '/admin/warehouse/import/history', icon: 'fas fa-history text-gray-500', text: 'Lịch sử nhập' },

          // Xuất kho
          { href: '/admin/warehouse/export', icon: 'fas fa-arrow-up text-gray-500', text: 'Xuất kho' },
          { href: '/admin/warehouse/export/create', icon: 'fas fa-plus text-gray-500', text: 'Tạo phiếu xuất' },
          { href: '/admin/warehouse/export/history', icon: 'fas fa-history text-gray-500', text: 'Lịch sử xuất' },

          // Kiểm kê
          { href: '/admin/warehouse/inventory/check', icon: 'fas fa-clipboard-check text-gray-500', text: 'Kiểm kê kho' },
          { href: '/admin/warehouse/inventory/check/create', icon: 'fas fa-plus text-gray-500', text: 'Tạo phiếu kiểm kê' },
          { href: '/admin/warehouse/inventory/check/history', icon: 'fas fa-history text-gray-500', text: 'Lịch sử kiểm kê' },

          // Báo cáo kho
          { href: '/admin/warehouse/reports/inventory', icon: 'fas fa-chart-bar text-gray-500', text: 'Báo cáo tồn kho' },
          { href: '/admin/warehouse/reports/movement', icon: 'fas fa-exchange-alt text-gray-500', text: 'Báo cáo xuất nhập' },
          { href: '/admin/warehouse/reports/overview', icon: 'fas fa-chart-pie text-gray-500', text: 'Tổng quan kho' },
        ]
      },

      // ========================================================
      // 📰 TIN TỨC & HỆ THỐNG
      // ========================================================
      {
        type: 'group', icon: 'fas fa-newspaper text-indigo-500', text: 'Tin tức & Hệ thống', children: [
          { href: '/admin/news', icon: 'fas fa-list text-gray-500', text: 'Danh sách tin tức' },
          { href: '/admin/news/create', icon: 'fas fa-plus text-gray-500', text: 'Thêm tin tức' },
          { href: '/admin/news/deleted', icon: 'fas fa-trash-restore-alt text-gray-500', text: 'Tin tức đã xóa' },
        ]
      },

      {
        type: 'group', icon: 'fas fa-users text-purple-500', text: 'Khách hàng', children: [
          { href: '/admin/customers', icon: 'fas fa-list text-gray-500', text: 'Danh sách khách hàng' },
          { href: '/admin/customers/blocked-history', icon: 'fas fa-user-slash text-gray-500', text: 'Lịch sử chặn' },
        ]
      },

      {
        type: 'group', icon: 'fas fa-shopping-cart text-orange-500', text: 'Đơn hàng', children: [
          { href: '/admin/orders', icon: 'fas fa-list text-gray-500', text: 'Tất cả đơn hàng' },
          { href: '/admin/orders/pending', icon: 'fas fa-clock text-gray-500', text: 'Chờ xử lý' },
        ]
      },

      { type: 'link', href: '/admin/analytics', icon: 'fas fa-chart-bar text-red-500', text: 'Thống kê tổng quan' },
      { type: 'link', href: '/auth/logout', icon: 'fas fa-sign-out-alt text-red-500', text: 'Đăng xuất', extra: 'hover:bg-red-50 text-red-500' },
    ];

    function createLink(item, extra = '') {
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
    links.forEach(a => a.classList.remove('bg-green-500', 'text-white'));

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
      best.classList.add('bg-green-500', 'text-white');
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
