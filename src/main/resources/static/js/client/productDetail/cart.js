// Product Detail Cart Functions
// =============================

function getQuantity() {
  return parseInt(document.getElementById("qty").value) || 1;
}

function updateCartCount(uniqueProductCount) {
  const cartSpan = document.querySelector(".fa-shopping-cart").nextElementSibling;
  if (cartSpan) {
    cartSpan.textContent = uniqueProductCount;
  }
}

function getCurrentCartCount() {
  const cartSpan = document.querySelector(".fa-shopping-cart").nextElementSibling;
  return parseInt(cartSpan?.textContent) || 0;
}

function addToCartFromDetail(productId, productName, productPrice, productQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += productQuantity;
    console.log(`Cộng thêm ${productQuantity} vào sản phẩm "${productName}". Tổng: ${existingItem.quantity}`);
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: parseFloat(productPrice),
      quantity: productQuantity,
    });
    console.log(`Thêm mới sản phẩm "${productName}" với số lượng: ${productQuantity}`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  const uniqueProductCount = cart.length;
  updateCartCount(uniqueProductCount);
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  console.log(`Giỏ hàng hiện tại: ${uniqueProductCount} loại sản phẩm, tổng ${totalQuantity} sản phẩm`);
  showNotification(`Đã thêm ${productQuantity} "${productName}" vào giỏ hàng!`, "success");
}

function handleAddToCart() {
  const button = document.getElementById("add-to-cart-btn");
  if (!button) return;

  const productId = button.getAttribute("data-product-id");
  const productName = button.getAttribute("data-product-name");
  const productPrice = button.getAttribute("data-product-price");
  const productQuantity = getQuantity();

  console.log("Product data:", { productId, productName, productPrice, productQuantity });

  if (productQuantity < 1) {
    showNotification("Số lượng phải lớn hơn 0!", "error");
    return;
  }

  if (!productId || productId === "null" || productId === "") {
    const urlParts = window.location.pathname.split("/");
    const fallbackId = urlParts[urlParts.length - 1];

    if (fallbackId && fallbackId !== "detail") {
      console.log("Using fallback ID:", fallbackId);
      addToCartFromDetail(fallbackId, productName || "Sản phẩm", productPrice || "0", productQuantity);
      return;
    }
    showNotification("Thông tin sản phẩm không hợp lệ!", "error");
    return;
  }

  if (!productPrice || productPrice === "null" || productPrice === "" || parseFloat(productPrice) <= 0) {
    showNotification("Giá sản phẩm không hợp lệ!", "error");
    console.error("Invalid product price:", productPrice);
    return;
  }
  addToCartFromDetail(productId, productName, productPrice, productQuantity);
}

function initCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const uniqueProductCount = cart.length;
  updateCartCount(uniqueProductCount);
}

function addToWishlist(productId, productName) {
  console.log("Add to wishlist:", { productId, productName });
  alert(`Đã thêm "${productName}" vào danh sách yêu thích!`);
}

// Make functions globally available
window.getQuantity = getQuantity;
window.updateCartCount = updateCartCount;
window.getCurrentCartCount = getCurrentCartCount;
window.addToCartFromDetail = addToCartFromDetail;
window.handleAddToCart = handleAddToCart;
window.initCartCount = initCartCount;
window.addToWishlist = addToWishlist;
