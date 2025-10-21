// Product Detail UI Functions
// ============================

function chgQty(delta) {
  const qtyInput = document.getElementById("qty");
  let currentQty = parseInt(qtyInput.value) || 1;
  let newQty = currentQty + delta;

  if (newQty < 1) newQty = 1;
  qtyInput.value = newQty;
}

function showTab(tabName) {
  document.querySelectorAll('[id^="tab-"]').forEach((tab) => {
    tab.classList.add("hidden");
  });

  document.querySelectorAll('button[onclick^="showTab"]').forEach((btn) => {
    btn.classList.remove("text-[#cb5439]", "border-[#cb5439]");
    btn.classList.add("text-gray-600", "border-transparent");
  });

  document.getElementById("tab-" + tabName).classList.remove("hidden");
  const activeBtn = document.querySelector(`button[onclick="showTab('${tabName}')"]`);
  activeBtn.classList.remove("text-gray-600", "border-transparent");
  activeBtn.classList.add("text-[#cb5439]", "border-[#cb5439]");
}

function showGlobalLoading() {
  const relatedProducts = document.getElementById("relatedProducts");
  if (relatedProducts) {
    relatedProducts.innerHTML = `
      <div class="col-span-5 flex justify-center items-center py-8">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#cb5439]"></div>
          <span class="text-gray-600">Đang tải sản phẩm liên quan...</span>
        </div>
      </div>
    `;
  }
  
  const gallery = document.getElementById("product-gallery");
  if (gallery) {
    gallery.style.opacity = '0.8';
  }
}

function hideGlobalLoading() {
  const gallery = document.getElementById("product-gallery");
  if (gallery) {
    gallery.style.opacity = '1';
  }
  
  const productInfoSection = document.getElementById("product-info");
  if (productInfoSection) {
    const loadingElement = productInfoSection.querySelector(".animate-spin");
    if (loadingElement) {
      loadingElement.parentElement.remove();
    }
  }
}

function showProductError(message) {
  const productDataDiv = document.getElementById('product-data');
  if (productDataDiv) {
    productDataDiv.innerHTML = `
      <div class="flex flex-col h-full items-center justify-center">
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Không thể tải sản phẩm</h3>
        <p class="text-gray-600 text-center mb-4">${message}</p>
        <button onclick="location.reload()" class="bg-[#cb5439] text-white px-4 py-2 rounded-lg hover:bg-[#a8442f] transition-colors">
          Thử lại
        </button>
      </div>
    `;
  }
}

// Make functions globally available
window.chgQty = chgQty;
window.showTab = showTab;
window.showGlobalLoading = showGlobalLoading;
window.hideGlobalLoading = hideGlobalLoading;
window.showProductError = showProductError;
