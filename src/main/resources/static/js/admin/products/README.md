# Products JavaScript Modules

## 📁 Cấu trúc thư mục

```
js/admin/products/
├── main.js          # Entry point và initialization
├── api.js           # API calls và data fetching
├── ui.js            # UI components và display logic
├── pagination.js    # Pagination logic và controls
└── README.md        # Documentation
```

## 🔧 Module Descriptions

### 1. `main.js` - Entry Point
- **Chức năng**: Khởi tạo ứng dụng và event listeners
- **Nhiệm vụ**:
  - DOM ready initialization
  - Search input handling
  - Button event listeners
  - Global function exports

### 2. `api.js` - API Management
- **Chức năng**: Quản lý tất cả API calls
- **Nhiệm vụ**:
  - `loadProducts()` - Tải danh sách sản phẩm
  - `searchProducts()` - Tìm kiếm sản phẩm
  - `deleteProduct()` - Xóa sản phẩm
  - Performance logging và error handling

### 3. `ui.js` - User Interface
- **Chức năng**: Quản lý giao diện người dùng
- **Nhiệm vụ**:
  - `displayProducts()` - Hiển thị sản phẩm trong table
  - `showLoadingState()` - Hiển thị trạng thái loading
  - `showEmptyState()` - Hiển thị trạng thái rỗng
  - `showErrorState()` - Hiển thị trạng thái lỗi
  - `showToast()` - Hiển thị thông báo
  - `formatPrice()` - Format giá tiền

### 4. `pagination.js` - Pagination Control
- **Chức năng**: Quản lý phân trang
- **Nhiệm vụ**:
  - `initializePagination()` - Khởi tạo pagination UI
  - `updatePaginationUI()` - Cập nhật giao diện pagination
  - `goToPage()` - Chuyển trang
  - `generatePageNumbers()` - Tạo số trang
  - Pagination state management

## 🚀 Cách sử dụng

### Load order trong HTML:
```html
<script defer src="/js/admin/products/ui.js"></script>
<script defer src="/js/admin/products/pagination.js"></script>
<script defer src="/js/admin/products/api.js"></script>
<script defer src="/js/admin/products/main.js"></script>
```

### Global functions available:
- `loadProducts(page)` - Tải sản phẩm
- `searchProducts(term, page)` - Tìm kiếm
- `deleteProduct(id)` - Xóa sản phẩm
- `editProduct(id)` - Chỉnh sửa sản phẩm
- `goToPage(page)` - Chuyển trang
- `showToast(message, type)` - Hiển thị thông báo

## 📊 Performance Features

### 1. **Performance Logging**
- Đo thời gian từng bước xử lý
- Log chi tiết API response time
- Performance breakdown cho UI rendering

### 2. **Optimization Techniques**
- Debounce search (50ms)
- Request timeout (10s load, 8s search)
- Batch DOM updates
- RequestAnimationFrame cho smooth UI

### 3. **Caching & Headers**
- Cache-Control: no-cache
- Pragma: no-cache
- Accept: application/json

## 🔄 State Management

### Global Variables:
- `currentPage` - Trang hiện tại (0-based)
- `totalPages` - Tổng số trang
- `totalItems` - Tổng số items
- `isSearchMode` - Đang ở chế độ tìm kiếm
- `currentSearchTerm` - Từ khóa tìm kiếm hiện tại

### State Updates:
- Pagination state được cập nhật từ API response
- UI state được cập nhật ngay lập tức khi user click
- Search state được quản lý riêng biệt

## 🐛 Debugging

### Console Logs:
- `🚀 [LOAD PRODUCTS]` - Bắt đầu tải
- `⏱️ [LOAD PRODUCTS]` - Thời gian response
- `📊 [LOAD PRODUCTS]` - Parse JSON time
- `🎯 [LOAD PRODUCTS]` - Display time
- `🏁 [LOAD PRODUCTS]` - Tổng thời gian

### Error Handling:
- Try-catch cho tất cả API calls
- Timeout handling
- User-friendly error messages
- Toast notifications cho feedback

## 📝 Maintenance Tips

### 1. **Thêm tính năng mới**:
- API calls → `api.js`
- UI components → `ui.js`
- Pagination logic → `pagination.js`
- Initialization → `main.js`

### 2. **Debug performance**:
- Check console logs với prefix `[PERFORMANCE]`
- Monitor API response times
- Check DOM update times

### 3. **Modify pagination**:
- Edit `pagination.js` cho logic
- Update `ui.js` cho display
- Test với different page sizes

## 🎯 Benefits

### 1. **Maintainability**:
- Code được chia nhỏ, dễ đọc
- Mỗi module có trách nhiệm rõ ràng
- Dễ debug và fix bugs

### 2. **Performance**:
- Load modules theo thứ tự
- Optimized API calls
- Smooth UI updates

### 3. **Scalability**:
- Dễ thêm tính năng mới
- Code reuse giữa các modules
- Clear separation of concerns
