# Project Shop Spring Boot

Hệ thống Shop + News trên Spring Boot + MongoDB. Hỗ trợ quản trị sản phẩm, danh mục, tin tức, like/comment, soft-delete, phân trang thủ công, và tài liệu API qua Swagger UI.

## 1) Công nghệ
- Java 17, Spring Boot 3
- Spring Web, Spring Data MongoDB, Validation
- Lombok, DevTools, Actuator
- springdoc-openapi (Swagger UI)
- Cloudinary (upload ảnh)
- Maven

## 2) Cấu trúc chính
- `src/main/java/com/example/spring_boot/controllers/**`: REST Controllers
- `src/main/java/com/example/spring_boot/services/**`: Service nghiệp vụ
  - `products/*`: Product, Category, Image, Attribute, Like
  - `news/*`: NewsPost, NewsCategory, NewsLike, NewsComment
- `src/main/java/com/example/spring_boot/repository/**`: Mongo repositories
- `src/main/resources/views/**`: Thymeleaf views (admin/clients)
- `src/main/resources/static/**`: assets tĩnh
- `application.properties`: cấu hình
- `checkstyle.xml`: rule code style (LineLength=120)

## 3) Chạy dự án
### 3.1. Chuẩn bị
- MongoDB (local/cloud) – connection string `mongodb://...`
- Cloudinary (nếu dùng upload ảnh):
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### 3.2. Cấu hình `application.properties` (ví dụ)
```
spring.data.mongodb.uri=mongodb://localhost:27017/shopdb
server.port=8080

# springdoc (tuỳ chọn)
# springdoc.api-docs.path=/v3/api-docs
# springdoc.swagger-ui.path=/swagger-ui.html
```

### 3.3. Chạy (Windows)
- Chạy trực tiếp:
```
mvnw.cmd spring-boot:run
```
- Build và chạy jar:
```
mvnw.cmd clean package -DskipTests
java -jar target/spring-boot-0.0.1-SNAPSHOT.jar
```

Mặc định chạy ở `http://localhost:8080`.

## 4) Tài liệu API (Swagger UI)
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Nếu đã cấu hình `springdoc.swagger-ui.path=/swagger-ui.html` thì truy cập `http://localhost:8080/swagger-ui.html`

Lưu ý: Nếu có `server.servlet.context-path`, đường dẫn sẽ thay đổi theo context.

## 5) Các module chính
### 5.1. Products
- `ProductService`: CRUD, soft-delete, get/paged thủ công, search by name.
- `CategoryService`: CRUD, soft-delete/restore, search/paged thủ công, kiểm tra trùng tên (ignore-case).
- `ProductImageService`: tạo/xóa mềm ảnh theo `productId`.
- `ProductAttributeService`: tạo/xóa mềm attribute theo `productId`.
- `ProductLikeService`: like/unlike theo cặp `(productId, userId)` (tránh trùng, unlike = xóa mềm).

Nguyên tắc: Soft-delete dùng trường `deletedAt`; danh sách “active” không gồm bản ghi đã xóa.

### 5.2. News
- `NewsPostService`: create/list/get/update/delete (soft-delete); fallback populate `author`/`category` khi DocumentReference không tự load.
- `NewsCategoryService`: create/list/get/update/delete; check trùng tên.
- `NewsLikeService`: toggle like, get by post/user, count, hasLiked; fallback populate.
- `NewsCommentService`: create/get by post/user/get by id/update/delete; validate `parentId` nếu reply.

Nguyên tắc: chuẩn hóa dữ liệu bằng `ValidationUtils.normalize(...)`, dùng `ResponseStatusException` cho HTTP code phù hợp.

## 6) Endpoint mẫu (curl)
Lấy danh sách bài viết đã publish có từ khóa:
```bash
curl "http://localhost:8080/api/news/posts?title=iphone&published=true"
```

Tạo bài viết mới:
```bash
curl -X POST "http://localhost:8080/api/news/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Hello World",
    "slug":"hello-world",
    "content":"Nội dung",
    "thumbnailUrl":"https://...",
    "authorId":"64f0c9...abc",
    "categoryId":"64f0d1...def",
    "published":true
  }'
```

Toggle like bài viết:
```bash
curl -X POST "http://localhost:8080/api/news/likes/toggle?postId=64f0...&userId=64e9..."
```

Đếm like:
```bash
curl "http://localhost:8080/api/news/likes/count?postId=64f0..."
```

Lấy categories sản phẩm active (ví dụ):
```bash
curl "http://localhost:8080/api/products/categories/active"
```

## 7) Actuator
- Health: `http://localhost:8080/actuator/health`
- Info/Metrics: bật thêm trong `application.properties` khi cần.

## 8) Dev tips
- Formatter: dự án dùng Checkstyle `LineLength=120`. Nếu IDE tự wrap khi Ctrl+S:
  - Tăng Right margin (160–200) hoặc tắt “Format on Save”.
  - Rút gọn comment/log để không vượt 120.
- Log: dùng `@Slf4j` hoặc `java.util.logging.Logger` theo module hiện có.
- Exception: REST nên ném `ResponseStatusException` với HTTP code phù hợp.

## 9) Build/Deploy
- Build: `mvnw.cmd clean package -DskipTests`
- Artifact: `target/spring-boot-0.0.1-SNAPSHOT.jar`
- Run: `java -jar target/spring-boot-0.0.1-SNAPSHOT.jar`

## 10) Đóng góp
- Tạo issue/PR kèm mô tả và bước tái hiện ngắn gọn.
