# PROJECT_STATUS - HopGiayRe.vn Modern Fullstack

Ngày cập nhật: 2026-05-24

## Mục tiêu bản hiện tại

Chuyển dự án HopGiayRe.vn từ code cũ CodeIgniter/PHP sang source mới fullstack TypeScript, gồm:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MySQL/MariaDB, tạm giữ schema cũ để không mất dữ liệu
- Admin mới: login, dashboard, quản lý bài viết, quản lý sản phẩm ở mức nền tảng
- AI Writer: viết bài blog, mô tả sản phẩm và SEO

## Trạng thái đã làm

### 1. Xoá phụ thuộc backend cũ

Đã bỏ backend PHP/CodeIgniter khỏi bản source mới. Source mới không còn phụ thuộc các thư mục cũ như `application/`, `system/`, `adminhgr/`, `index.php`.

### 2. Frontend public mới

Đã dựng `apps/web` bằng React TypeScript.

Đã có các trang chính:

- Trang chủ
- Danh sách sản phẩm
- Chi tiết sản phẩm
- Danh mục
- Tin tức
- Chi tiết bài viết
- Form báo giá

### 3. Backend mới đã tách route

`apps/api/src/server.ts` hiện chỉ còn cấu hình app, middleware, static file, mount routes và listen.

Các router chính:

```txt
apps/api/src/routes/public.routes.ts
apps/api/src/routes/ai.routes.ts
apps/api/src/routes/admin.routes.ts
apps/api/src/middleware/adminAuth.ts
```

Đã có các nhóm API chính:

- Setting
- Catalog
- Banner
- Product
- Blog
- Voucher
- Lead/form báo giá
- AI Writer
- Admin auth/dashboard/blog/product

### 4. Admin mới

Đã có các route frontend:

```txt
/admin/login
/admin
/admin/blogs
/admin/products
/admin/ai
```

Đã có:

- Admin login bằng `ADMIN_API_TOKEN` hoặc `ADMIN_USERNAME` + `ADMIN_PASSWORD` trong `.env`.
- Dashboard thống kê nhanh sản phẩm, bài đã xuất bản, bài nháp, lead báo giá.
- Quản lý bài viết: xem danh sách, lọc nháp/xuất bản, sửa nội dung HTML, duyệt/xuất bản, chuyển về nháp.
- Quản lý sản phẩm: xem danh sách, tìm sản phẩm, dùng AI viết lại mô tả, lưu mô tả AI vào sản phẩm.
- AI Writer nằm trong layout admin.

### 5. Database

Đã giữ lại SQL dump gốc trong:

```txt
database/backup_hopgiayre_20260524.sql
```

Có thêm file index tối ưu tuỳ chọn:

```txt
database/20260524_optional_indexes.sql
```

Lý do chưa đổi sâu schema: đổi tên bảng/cột ngay sẽ dễ làm import lỗi hoặc mất dữ liệu. Giai đoạn sau mới nên chuẩn hoá bằng migration rõ ràng.

### 6. AI Writer

Đã thêm module AI:

- Viết bài blog SEO
- Lưu bài blog dạng nháp vào bảng `blog` với `status = 0`
- Viết mô tả sản phẩm
- Tạo gợi ý SEO
- Khóa bằng admin token/login

## Đã kiểm tra

- `npm install`: OK
- `npm run build`: OK
- `npm run start --workspace apps/api`: server start OK
- Đã sửa lỗi Express 5 không nhận wildcard `app.get('*')` bằng fallback middleware SPA.

## Những điểm chưa làm xong / chưa nên coi là production hoàn chỉnh

- Chưa có upload ảnh trong admin mới.
- Chưa có editor WYSIWYG cho bài viết, hiện đang sửa HTML textarea.
- Chưa có quản lý danh mục/banner/leads trong admin UI.
- Chưa có phân quyền role admin/editor thật sự.
- Chưa chuẩn hoá lại schema database.
- Chưa có Docker/deploy script hoàn chỉnh.
- Chưa có test tự động.
- Chưa có rate limit riêng cho AI API.

## Kết luận

Bản hiện tại đã tiến thêm một bước lớn: không chỉ có AI Writer test nữa, mà đã có admin mới để duyệt bài AI và cập nhật mô tả sản phẩm bằng AI. Bước tiếp theo nên làm upload ảnh, editor WYSIWYG, quản lý banner/leads/danh mục.
