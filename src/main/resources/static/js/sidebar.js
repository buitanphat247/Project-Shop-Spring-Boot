(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const nav = document.getElementById('adminSidebarNav');
        if (!nav) return;

        // Menu data
        const menuData = [
            { type: 'link', href: '/auth/dashboard', icon: 'fas fa-tachometer-alt text-blue-600', text: 'Dashboard' },


            {
                type: 'group', icon: 'fas fa-shopping-cart text-green-600', text: 'Quản lý bán hàng', children: [
                    { href: '/admin/categories', icon: 'fas fa-tags text-gray-600', text: 'Danh mục sản phẩm' },
                    { href: '/admin/products', icon: 'fas fa-box text-gray-600', text: 'Danh sách sản phẩm' },
                    { href: '/admin/products/create', icon: 'fas fa-plus text-gray-600', text: 'Thêm sản phẩm' },
                ]
            },


            {
                type: 'group', icon: 'fas fa-newspaper text-indigo-500', text: 'Tin tức & Hệ thống', children: [
                    { href: '/admin/categories-news', icon: 'fas fa-tags text-gray-600', text: 'Danh mục tin tức' },
                    { href: '/admin/news', icon: 'fas fa-list text-gray-600', text: 'Danh sách tin tức' },
                    { href: '/admin/news/create', icon: 'fas fa-plus text-gray-600', text: 'Thêm tin tức' },
                ]
            },

            {
                type: 'group', icon: 'fas fa-users text-purple-500', text: 'Quản lý tài khoản', children: [
                    { href: '/admin/users', icon: 'fas fa-list text-gray-600', text: 'Danh sách người dùng' },
                    { href: '/admin/customers', icon: 'fas fa-list text-gray-600', text: 'Danh sách khách hàng' },
                ]
            },

            {
                type: 'group', icon: 'fas fa-shopping-cart text-orange-500', text: 'Đơn hàng', children: [
                    { href: '/admin/orders', icon: 'fas fa-list text-gray-600', text: 'Tất cả đơn hàng' },
                    { href: '/admin/orders/pending', icon: 'fas fa-clock text-gray-600', text: 'Chờ xử lý' }
                ]
            },

            { type: 'link', href: '/admin/analytics', icon: 'fas fa-chart-bar text-red-500', text: 'Thống kê tổng quan' },
            { type: 'link', href: '/auth/logout', icon: 'fas fa-sign-out-alt text-red-500', text: 'Đăng xuất', extra: 'hover:bg-red-50 text-red-500' }
        ];

        // Render functions
        function createLink(item) {
            const a = document.createElement('a');
            a.href = item.href || '#';
            a.className = `flex items-center space-x-3 p-3 rounded-lg  ${item.extra || ''}`.trim();
            a.innerHTML = `<i class="${item.icon} menu-icon"></i><span class="menu-text">${item.text}</span>`;
            return a;
        }

        function createGroup(item) {
            const header = document.createElement('div');
            header.className = 'menu-header cursor-pointer flex items-center justify-between p-3 rounded-lg ';
            header.innerHTML = `<div class="flex items-center space-x-3"><i class="${item.icon} menu-icon"></i><span class="menu-text">${item.text}</span></div><i class="fas fa-chevron-down text-gray-400 text-xs"></i>`;

            const submenu = document.createElement('div');
            submenu.className = 'submenu';
            submenu.style.display = 'none'; // Ẩn submenu ban đầu
            (item.children || []).forEach(child => {
                const link = document.createElement('a');
                link.href = child.href || '#';
                link.className = 'flex items-center space-x-3 rounded-lg p-2 mt-2';
                link.innerHTML = `<i class="${child.icon} menu-icon"></i><span class="menu-text">${child.text}</span>`;
                submenu.appendChild(link);
            });

            // Click handler with jQuery animations
            header.addEventListener('click', () => {
                const isOpen = submenu.style.display === 'block';
                const chev = header.querySelector('.fa-chevron-down');

                if (isOpen) {
                    // Close with slide up animation
                    $(submenu).slideUp(300, () => {
                        submenu.style.display = 'none';
                    });
                    if (chev) chev.classList.remove('rotate-180');
                } else {
                    // Open with slide down animation
                    submenu.style.display = 'block';
                    $(submenu).hide().slideDown(300);
                    if (chev) chev.classList.add('rotate-180');
                }

                // Close other submenus with animation
                nav.querySelectorAll('.menu-header').forEach(otherHeader => {
                    if (otherHeader !== header) {
                        const otherSubmenu = otherHeader.nextElementSibling;
                        if (otherSubmenu && otherSubmenu.classList.contains('submenu')) {
                            if (otherSubmenu.style.display === 'block') {
                                $(otherSubmenu).slideUp(300, () => {
                                    otherSubmenu.style.display = 'none';
                                });
                            }
                            const otherChev = otherHeader.querySelector('.fa-chevron-down');
                            if (otherChev) otherChev.classList.remove('rotate-180');
                        }
                    }
                });
            });

            return [header, submenu];
        }

        // Render menu
        nav.innerHTML = '';
        menuData.forEach(item => {
            if (item.type === 'link') {
                nav.appendChild(createLink(item));
            } else if (item.type === 'group') {
                const [header, submenu] = createGroup(item);
                nav.appendChild(header);
                nav.appendChild(submenu);
            }
        });

        // Active link highlighting
        const path = window.location.pathname;
        const links = Array.from(nav.querySelectorAll('a[href]'));
        links.forEach(a => a.classList.remove('bg-green-500', 'text-white'));

        function scoreMatch(href) {
            if (!href || href === '#') return -1;
            if (href === path) return 100000 + href.length;
            const prefix = href.endsWith('/') ? href : href + '/';
            return path.startsWith(prefix) ? href.length : -1;
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
                submenu.style.display = 'block';
                const header = submenu.previousElementSibling;
                if (header) {
                    const chev = header.querySelector('.fa-chevron-down');
                    if (chev) chev.classList.add('rotate-180');
                    header.classList.add('bg-gray-300');
                }
            }
        }

        // Prevent event bubbling
        nav.querySelectorAll('.submenu a').forEach(a => {
            a.addEventListener('click', (e) => e.stopPropagation());
        });
    });
})();