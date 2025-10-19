# Users JavaScript Modules

## 📁 Cấu trúc thư mục

```
js/admin/users/
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
  - Modal event handlers
  - Global function exports

### 2. `api.js` - API Management
- **Chức năng**: Quản lý tất cả API calls cho User
- **Nhiệm vụ**:
  - `loadUsers()` - Tải danh sách người dùng
  - `searchUsers()` - Tìm kiếm người dùng
  - `deleteUser()` - Xóa người dùng
  - Performance logging và error handling

### 3. `ui.js` - User Interface
- **Chức năng**: Quản lý giao diện người dùng
- **Nhiệm vụ**:
  - `displayUsers()` - Hiển thị người dùng trong table
  - `showUserLoadingState()` - Hiển thị trạng thái loading
  - `showUserEmptyState()` - Hiển thị trạng thái rỗng
  - `showUserErrorState()` - Hiển thị trạng thái lỗi
  - `showUserToast()` - Hiển thị thông báo
  - `showUserDeleteModal()` - Hiển thị modal xác nhận xóa
  - `formatDate()` - Format ngày tháng

### 4. `pagination.js` - Pagination Control
- **Chức năng**: Quản lý phân trang cho User
- **Nhiệm vụ**:
  - `initializeUserPagination()` - Khởi tạo pagination UI
  - `updateUserPaginationUI()` - Cập nhật giao diện pagination
  - `goToUserPage()` - Chuyển trang
  - `generateUserPageNumbers()` - Tạo số trang
  - User pagination state management

## 🚀 Cách sử dụng

### Load order trong HTML:
```html
<script defer src="/js/admin/users/ui.js"></script>
<script defer src="/js/admin/users/pagination.js"></script>
<script defer src="/js/admin/users/api.js"></script>
<script defer src="/js/admin/users/main.js"></script>
```

### Global functions available:
- `loadUsers(page)` - Tải người dùng
- `searchUsers(term, page)` - Tìm kiếm người dùng
- `deleteUser(id)` - Xóa người dùng
- `editUser(id)` - Chỉnh sửa người dùng
- `goToUserPage(page)` - Chuyển trang
- `showUserToast(message, type)` - Hiển thị thông báo
- `showUserDeleteModal(id)` - Hiển thị modal xóa

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
- `currentUserPage` - Trang hiện tại (0-based)
- `totalUserPages` - Tổng số trang
- `totalUserItems` - Tổng số items
- `isUserSearchMode` - Đang ở chế độ tìm kiếm
- `currentUserSearchTerm` - Từ khóa tìm kiếm hiện tại

### State Updates:
- Pagination state được cập nhật từ API response
- UI state được cập nhật ngay lập tức khi user click
- Search state được quản lý riêng biệt

## 🎨 UI Features

### 1. **Table Display**
- User avatar với icon
- Name và email
- Phone number
- Role với color coding
- Created date và last login
- Action buttons (Edit, Delete)

### 2. **Modal Confirmation**
- Delete confirmation modal
- User info display
- Smooth animations
- Keyboard support (ESC)

### 3. **Toast Notifications**
- Stack effect
- Auto-hide after 1.5s
- Different types (success, error, info)

## 🐛 Debugging

### Console Logs:
- `🚀 [LOAD USERS]` - Bắt đầu tải
- `⏱️ [LOAD USERS]` - Thời gian response
- `📊 [LOAD USERS]` - Parse JSON time
- `🎯 [LOAD USERS]` - Display time
- `🏁 [LOAD USERS]` - Tổng thời gian

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

## 🔗 Integration với Backend

### API Endpoints:
- `GET /api/users?page=0&size=10` - Load users
- `GET /api/users?name=search&page=0&size=10` - Search users
- `DELETE /api/users/{id}` - Delete user

### Response Format:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [...],
    "total": 100,
    "currentPage": 0,
    "totalPages": 10,
    "size": 10
  }
}
```

