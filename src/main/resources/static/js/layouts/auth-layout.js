// Auth Layout JavaScript
document.addEventListener("DOMContentLoaded", function () {
  console.log("Auth Layout JS loaded");
  
  const sidebar = document.getElementById("sidebar");
  const sidebarContainer = document.getElementById("sidebar-container");
  const mainContent = document.getElementById("main-content");
  const headerToggle = document.getElementById("top-toggle-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  
  console.log("Elements found:", {
    sidebar: !!sidebar,
    sidebarContainer: !!sidebarContainer,
    headerToggle: !!headerToggle
  });

  function setDesktopVisible(visible) {
    console.log("setDesktopVisible called with:", visible);
    if (!sidebarContainer) {
      console.log("sidebarContainer not found!");
      return;
    }
    
    console.log("Setting sidebar visibility to:", visible);
    
    // Add smooth transition class
    sidebarContainer.classList.add("sidebar-transition");
    
    if (visible) {
      // Show sidebar with smooth animation
      sidebarContainer.classList.remove("hidden");
      sidebarContainer.classList.add("sidebar-expanded");
      sidebarContainer.classList.remove("sidebar-collapsed");
      
      // Animate page content
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.style.width = "calc(100% - 360px)";
        pageContent.style.transform = "translateX(0)";
      }
    } else {
      // Hide sidebar with smooth animation
      sidebarContainer.classList.add("hidden");
      sidebarContainer.classList.remove("sidebar-expanded");
      sidebarContainer.classList.add("sidebar-collapsed");
      
      // Animate page content
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.style.width = "100%";
        pageContent.style.transform = "translateX(0)";
      }
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
      sidebarContainer.classList.remove("sidebar-transition");
    }, 400);
  }

  function setMobileVisible(visible) {
    if (!sidebarContainer) return;
    if (visible) {
      sidebarContainer.classList.add("show");
      if (backdrop) backdrop.classList.add("show");
      // Prevent body scroll on mobile
      document.body.style.overflow = "hidden";
    } else {
      sidebarContainer.classList.remove("show");
      if (backdrop) backdrop.classList.remove("show");
      // Restore body scroll
      document.body.style.overflow = "";
    }
  }

  function initByViewport() {
    if (window.innerWidth < 1024) {
      setMobileVisible(false);
      // Keep default width for mobile
    } else {
      // Desktop: Start with sidebar visible
      setDesktopVisible(true);
    }
  }
  // Initialize immediately to prevent flicker
  initByViewport();
  
  window.addEventListener("resize", initByViewport);

  function handleToggle() {
    console.log("Toggle clicked, window width:", window.innerWidth);
    
    if (window.innerWidth < 1024) {
      // Mobile: Toggle sidebar visibility
      const isVisible = sidebarContainer && sidebarContainer.classList.contains("show");
      console.log("Mobile toggle, isVisible:", isVisible);
      setMobileVisible(!isVisible);
    } else {
      // Desktop: Toggle sidebar width
      const isVisible = sidebarContainer && !sidebarContainer.classList.contains("hidden");
      console.log("Desktop toggle, isVisible:", isVisible);
      setDesktopVisible(!isVisible);
    }
  }

  if (headerToggle) headerToggle.addEventListener("click", handleToggle);

  document.querySelectorAll(".menu-header").forEach((header) => {
    header.addEventListener("click", () => {
      const submenu = header.nextElementSibling;
      const chevron = header.querySelector(".fa-chevron-down");
      if (submenu) submenu.classList.toggle("open");
      if (chevron) chevron.classList.toggle("rotate-180");
    });
  });

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setMobileVisible(false);
    });
  }

  // Notification panel system
  const notificationBtn = document.getElementById("notification-btn");
  const notificationPanel = document.getElementById("notification-panel");
  const notificationBackdrop = document.getElementById("notification-backdrop");
  const notificationList = document.getElementById("notification-list");
  const notificationLoading = document.getElementById("notification-loading");
  const notificationBadge = document.getElementById("notification-badge");
  const markAllReadBtn = document.getElementById("mark-all-read");
  const closeNotificationPanel = document.getElementById("close-notification-panel");
  const refreshNotifications = document.getElementById("refresh-notifications");

  let isNotificationOpen = false;
  let notifications = [];

  // Toggle notification panel
  function toggleNotification() {
    isNotificationOpen = !isNotificationOpen;

    if (isNotificationOpen) {
      showNotificationPanel();
      loadNotifications();
    } else {
      hideNotificationPanel();
    }
  }

  // Show notification panel with slide animation
  function showNotificationPanel() {
    notificationPanel.classList.add("show");
    notificationBackdrop.classList.add("show");

    // Add body scroll lock
    document.body.style.overflow = "hidden";
  }

  // Hide notification panel with slide animation
  function hideNotificationPanel() {
    notificationPanel.classList.remove("show");
    notificationBackdrop.classList.remove("show");

    // Remove body scroll lock
    document.body.style.overflow = "";
    isNotificationOpen = false;
  }

  // Load notifications via AJAX - DISABLED
  function loadNotifications() {
    // Show empty state instead of loading notifications
    notificationLoading.style.display = "none";
    notificationList.innerHTML = `
      <div class="p-4 text-center text-gray-500">
        <i class="fas fa-bell-slash text-2xl mb-2"></i>
        <p>Thông báo đã được tắt</p>
      </div>
    `;
    updateBadge(0);
    
    // Commented out API call
    /*
    $.ajax({
      url: "/api/notifications",
      method: "GET",
      dataType: "json",
      success: function (data) {
        notifications = data.notifications || [];
        renderNotifications(notifications);
        updateBadge(notifications.filter((n) => !n.read).length);
      },
      error: function () {
        renderErrorState();
      },
    });
    */
  }

  // Render notifications with beautiful animations
  function renderNotifications(notifications) {
    // Hide loading state
    notificationLoading.style.display = "none";

    if (notifications.length === 0) {
      notificationList.innerHTML = `
        <div class="p-6 text-center text-gray-500">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-bell-slash text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Không có thông báo nào</h3>
          <p class="text-sm text-gray-500">Bạn đã cập nhật tất cả thông báo mới nhất</p>
        </div>
      `;
      return;
    }

    const html = notifications
      .map(
        (notification, index) => `
      <div class="notification-item p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? "unread" : ""}" data-id="${
          notification.id
        }" style="animation-delay: ${index * 0.05}s">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-${
              notification.type === "success"
                ? "green"
                : notification.type === "warning"
                ? "yellow"
                : notification.type === "error"
                ? "red"
                : "blue"
            }-500 rounded-full flex items-center justify-center">
              <i class="fas fa-${notification.icon || "bell"} text-white text-sm"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-gray-900 mb-1">${notification.title}</h4>
                <p class="text-xs text-gray-600 mb-2">${notification.message}</p>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-400">${formatTime(notification.createdAt)}</span>
                  ${
                    notification.type
                      ? `<span class="px-2 py-0.5 text-xs font-medium bg-${
                          notification.type === "success"
                            ? "green"
                            : notification.type === "warning"
                            ? "yellow"
                            : notification.type === "error"
                            ? "red"
                            : "blue"
                        }-100 text-${
                          notification.type === "success"
                            ? "green"
                            : notification.type === "warning"
                            ? "yellow"
                            : notification.type === "error"
                            ? "red"
                            : "blue"
                        }-800 rounded-full">${notification.type}</span>`
                      : ""
                  }
                </div>
              </div>
              ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>' : ""}
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    notificationList.innerHTML = html;

    // Add click handlers for notification items
    document.querySelectorAll(".notification-item").forEach((item) => {
      item.addEventListener("click", function () {
        const notificationId = this.dataset.id;
        markAsRead(notificationId);

        // Add click animation
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      });
    });
  }

  // Render error state
  function renderErrorState() {
    notificationList.innerHTML = `
      <div class="p-4 text-center text-gray-500">
        <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
        <p>Không thể tải thông báo</p>
        <button onclick="loadNotifications()" class="mt-2 text-blue-600 hover:text-blue-800 text-sm">Thử lại</button>
      </div>
    `;
  }

  // Mark notification as read - DISABLED
  function markAsRead(notificationId) {
    // No API call - notifications are disabled
    console.log("Notifications are disabled");
    /*
    $.ajax({
      url: `/api/notifications/${notificationId}/read`,
      method: "PUT",
      success: function () {
        const item = document.querySelector(`[data-id="${notificationId}"]`);
        if (item) {
          item.classList.remove("unread");
          item.querySelector(".w-2.h-2")?.remove();
        }
        updateBadge(notifications.filter((n) => !n.read && n.id !== notificationId).length);
      },
    });
    */
  }

  // Mark all as read - DISABLED
  function markAllAsRead() {
    // No API call - notifications are disabled
    console.log("Notifications are disabled");
    /*
    $.ajax({
      url: "/api/notifications/mark-all-read",
      method: "PUT",
      success: function () {
        document.querySelectorAll(".notification-item").forEach((item) => {
          item.classList.remove("unread");
          item.querySelector(".w-2.h-2")?.remove();
        });
        updateBadge(0);
      },
    });
    */
  }

  // Update notification badge - DISABLED
  function updateBadge(count) {
    // Always hide badge since notifications are disabled
    notificationBadge.classList.add("hidden");
    /*
    if (count > 0) {
      notificationBadge.textContent = count > 99 ? "99+" : count;
      notificationBadge.classList.remove("hidden");
    } else {
      notificationBadge.classList.add("hidden");
    }
    */
  }

  // Format time
  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Vừa xong";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  }

  // Event listeners
  if (notificationBtn) {
    notificationBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleNotification();
    });
  }

  if (closeNotificationPanel) {
    closeNotificationPanel.addEventListener("click", function (e) {
      e.stopPropagation();
      hideNotificationPanel();
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      markAllAsRead();
    });
  }

  if (refreshNotifications) {
    refreshNotifications.addEventListener("click", function (e) {
      e.stopPropagation();
      loadNotifications();

      // Add refresh animation
      this.style.transform = "rotate(360deg)";
      setTimeout(() => {
        this.style.transform = "";
      }, 500);
    });
  }

  // Close panel when clicking backdrop
  if (notificationBackdrop) {
    notificationBackdrop.addEventListener("click", function () {
      hideNotificationPanel();
    });
  }

  // Close panel with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isNotificationOpen) {
      hideNotificationPanel();
    }
  });

  // Load notifications on page load
  loadNotifications();
});
