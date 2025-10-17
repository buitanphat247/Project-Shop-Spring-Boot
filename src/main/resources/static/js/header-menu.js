// Header Menu Data and Rendering
document.addEventListener('DOMContentLoaded', function() {
    // Menu items data
    const menuItems = [
        { name: 'Khuyến mãi hấp dẫn', href: '/products/khuyen-mai', hasArrow: true },
        { name: 'Áo nam', href: '/products/ao-nam', hasArrow: false },
        { name: 'Áo nữ', href: '/products/ao-nu', hasArrow: true },
        { name: 'Quần nam', href: '/products/quan-nam', hasArrow: false },
        { name: 'Quần nữ', href: '/products/quan-nu', hasArrow: false },
        { name: 'Đầm & Váy', href: '/products/dam-vay', hasArrow: false },
        { name: 'Phụ kiện thời trang', href: '/products/phu-kien', hasArrow: false },
        { name: 'Giày & Dép', href: '/products/giay-dep', hasArrow: false }
      ];
      
    // Navigation links data
    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Sản phẩm', href: '/products' },
        { name: 'Tin tức', href: '/news' },
        { name: 'Giới thiệu', href: '/about' },
        { name: 'Liên hệ', href: '/contact' }
    ];

    // Render menu items
    function renderMenuItems() {
        const menuContainer = document.querySelector('#categoryMenu .space-y-0');
        if (!menuContainer) return;

        menuContainer.innerHTML = menuItems.map(item => `
            <a
                href="${item.href}"
                class="flex items-center justify-between px-4 py-3 text-[#2f604a] bg-[#fdfbf7] shadow-md hover:bg-gray-100 transition-all duration-300 border-b border-dotted border-gray-300"
                style="opacity: 0; transform: translateY(-20px); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"
            >
                <span class="font-medium">${item.name}</span>
                ${item.hasArrow ? '<i class="fas fa-chevron-right text-gray-400 text-sm"></i>' : ''}
            </a>
        `).join('');
    }

    // Set active navigation link
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        
        // Desktop navigation
        const desktopNav = document.querySelector('.hidden.md\\:flex.items-center.space-x-6');
        if (desktopNav) {
            setActiveForContainer(desktopNav);
        }

        // Mobile navigation
        const mobileNav = document.querySelector('#mobile-menu .flex.flex-col.space-y-2');
        if (mobileNav) {
            setActiveForContainer(mobileNav);
        }
    }

    // Helper function to set active state for a container
    function setActiveForContainer(container) {
        const currentPath = window.location.pathname;
        
        // Clear all active states
        container.querySelectorAll('a').forEach(link => {
            link.classList.remove('nav-link-active');
        });

        // Find and set active link
        container.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            
            // Exact match for root
            if (currentPath === '/' && href === '/') {
                link.classList.add('nav-link-active');
            }
            // Match for other paths (starts with)
            else if (currentPath !== '/' && href !== '/' && currentPath.startsWith(href)) {
                link.classList.add('nav-link-active');
            }
        });
    }

    // Initialize menu and active states
    renderMenuItems();
    setActiveNavLink();
});
