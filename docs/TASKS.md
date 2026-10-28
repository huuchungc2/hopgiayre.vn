# TASKS - Chia việc tiếp theo cho HopGiayRe.vn

File này dùng để chia task rõ ràng cho các lần làm tiếp theo. Ưu tiên làm theo thứ tự từ trên xuống.


## Việc đã làm trong bản admin mới

- Tách backend thành `public.routes.ts`, `ai.routes.ts`, `admin.routes.ts`.
- Thêm `adminAuth.ts` để kiểm tra admin token/login.
- Thêm `/admin/login`, `/admin`, `/admin/blogs`, `/admin/products`, `/admin/ai`.
- Blog admin: xem/sửa/lưu/duyệt xuất bản/chuyển nháp.
- Product admin: tìm sản phẩm, AI viết mô tả, lưu mô tả vào sản phẩm.
- Build production đã chạy OK.

## Ưu tiên tiếp theo

1. Thêm editor WYSIWYG cho bài viết thay textarea HTML.
2. Thêm upload ảnh blog/sản phẩm/banner.
3. Làm `/admin/leads` để xem khách gửi báo giá.
4. Làm `/admin/banners` để đổi banner.
5. Làm `/admin/categories` để sửa danh mục.
6. Thêm rate limit cho AI/admin API.

## Phase 1 - Ổn định nền source mới

### TASK 1.1 - Kiểm tra chạy local từ đầu

Mục tiêu: đảm bảo người mới tải source về có thể chạy được.

Việc cần làm:

- Import database từ `database/backup_hopgiayre_20260524.sql`.
- Copy `.env.example` thành `.env` ở `apps/api` và `apps/web`.
- Chạy `npm install` ở root.
- Chạy `npm run dev`.
- Kiểm tra frontend `http://localhost:5173`.
- Kiểm tra backend `http://localhost:4000/health`.
- Kiểm tra trang AI `http://localhost:5173/admin/ai`.

Tiêu chí xong:

- Không lỗi TypeScript.
- Frontend load được dữ liệu từ database.
- API health trả về ok.

### TASK 1.2 - Chuẩn hoá biến môi trường

Mục tiêu: tránh hard-code domain, DB, key.

Việc cần làm:

- Rà lại `apps/api/.env.example`.
- Rà lại `apps/web/.env.example`.
- Đảm bảo production có thể dùng cùng domain: `/api` và asset relative path.
- Đảm bảo dev dùng `http://localhost:4000`.

Tiêu chí xong:

- Dev/prod không cần sửa code, chỉ sửa `.env`.

### TASK 1.3 - Tách route backend ra nhiều file - DONE

Đã tách router chính ra khỏi `server.ts`. Có thể tách nhỏ hơn nữa theo từng domain ở phase sau.

Cấu trúc đề xuất:

```txt
apps/api/src/routes/catalog.routes.ts
apps/api/src/routes/product.routes.ts
apps/api/src/routes/blog.routes.ts
apps/api/src/routes/banner.routes.ts
apps/api/src/routes/user.routes.ts
apps/api/src/routes/ai.routes.ts
apps/api/src/services/*.service.ts
apps/api/src/validators/*.validator.ts
```

Tiêu chí xong:

- `server.ts` chỉ còn cấu hình app, middleware, mount routes, static files và listen.

## Phase 2 - Làm admin dashboard thật

### TASK 2.1 - Tạo layout admin - DONE

Mục tiêu: có khung admin riêng thay cho trang test `/admin/ai` đơn lẻ.

Việc cần làm:

- Tạo route `/admin`.
- Tạo layout sidebar/topbar.
- Menu gồm:
  - Dashboard
  - Sản phẩm
  - Danh mục
  - Bài viết
  - Banner
  - Báo giá/khách liên hệ
  - AI Writer
  - Cài đặt

Tiêu chí xong:

- Vào `/admin` thấy layout rõ ràng.
- `/admin/ai` nằm trong layout admin.

### TASK 2.2 - Đăng nhập admin - PARTIAL DONE

Mục tiêu: không để admin/AI public.

Việc cần làm:

- Tạo bảng admin user hoặc tận dụng bảng user hiện có nếu phù hợp.
- API:
  - `POST /api/admin/auth/login`
  - `POST /api/admin/auth/logout`
  - `GET /api/admin/auth/me`
- Dùng JWT httpOnly cookie hoặc session cookie.
- Bỏ cách nhập `ADMIN_API_TOKEN` thủ công trên UI sau khi có login.

Tiêu chí xong:

- Chưa login không vào được `/admin`.
- Login xong mới gọi được API admin/AI.

### TASK 2.3 - Quản lý blog - PARTIAL DONE

Mục tiêu: duyệt, sửa, xuất bản bài AI.

Việc cần làm:

- Trang `/admin/blogs` danh sách bài.
- Trang `/admin/blogs/new` tạo bài.
- Trang `/admin/blogs/:id/edit` sửa bài.
- Trạng thái: nháp/xuất bản/ẩn.
- Gắn AI Writer vào form blog.
- Có editor nội dung HTML/Markdown.

API đề xuất:

```txt
GET    /api/admin/blogs
GET    /api/admin/blogs/:id
POST   /api/admin/blogs
PUT    /api/admin/blogs/:id
DELETE /api/admin/blogs/:id
POST   /api/admin/blogs/:id/publish
POST   /api/admin/blogs/:id/unpublish
```

Tiêu chí xong:

- AI tạo bài xong có thể sửa và xuất bản trong admin.
- Blog ngoài frontend chỉ hiện bài đã publish.

### TASK 2.4 - Quản lý sản phẩm - PARTIAL DONE

Mục tiêu: admin thêm/sửa sản phẩm không cần vào DB.

Việc cần làm:

- Trang danh sách sản phẩm.
- Thêm/sửa/xoá mềm sản phẩm.
- Quản lý ảnh sản phẩm.
- Gắn AI viết mô tả sản phẩm.
- Bộ lọc theo danh mục, trạng thái, từ khoá.

API đề xuất:

```txt
GET    /api/admin/products
GET    /api/admin/products/:id
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/products/:id/images
DELETE /api/admin/products/:id/images/:imageId
```

Tiêu chí xong:

- Admin tạo sản phẩm mới được.
- Sản phẩm hiện ra ở frontend.

### TASK 2.5 - Quản lý banner

Mục tiêu: đổi banner không cần sửa code.

Việc cần làm:

- Danh sách banner.
- Upload ảnh desktop/mobile.
- Sắp xếp thứ tự.
- Bật/tắt banner.

Tiêu chí xong:

- Banner ngoài frontend lấy từ DB và đổi được trong admin.

### TASK 2.6 - Quản lý báo giá / khách liên hệ

Mục tiêu: xem lead từ form báo giá.

Việc cần làm:

- Trang `/admin/leads`.
- Xem tên, phone, email, nhu cầu, thời gian gửi.
- Đánh dấu đã xử lý/chưa xử lý.
- Ghi chú nội bộ.

Tiêu chí xong:

- Lead không bị trôi trong DB.
- Có thể lọc lead mới.

## Phase 3 - Nâng cấp AI Writer

### TASK 3.1 - AI viết bài theo template ngành hộp giấy

Mục tiêu: nội dung AI sát ngành hơn, không chung chung.

Việc cần làm:

- Tạo prompt template riêng cho:
  - Hộp giấy
  - Hộp cứng
  - Túi giấy
  - In ấn bao bì
  - Hộp quà tết
  - Hộp mỹ phẩm
- Cho phép chọn intent:
  - Bài tư vấn
  - Bài SEO dịch vụ
  - Bài giới thiệu sản phẩm
  - Bài so sánh
  - FAQ

Tiêu chí xong:

- Bài AI có heading rõ, CTA rõ, nội dung bán hàng tự nhiên.

### TASK 3.2 - AI tối ưu bài cũ

Mục tiêu: lấy bài cũ trong DB và cải thiện SEO.

Việc cần làm:

- Nút “Tối ưu bằng AI” trong edit blog.
- AI đề xuất title/meta/outline/FAQ.
- Không tự ghi đè, chỉ hiển thị bản đề xuất để admin chọn.

Tiêu chí xong:

- Admin có thể cải thiện bài cũ nhanh.

### TASK 3.3 - Thêm guard chống spam AI

Mục tiêu: không bị tốn tiền API vô tội vạ.

Việc cần làm:

- Rate limit cho `/api/ai/*`.
- Log số lần gọi AI.
- Giới hạn độ dài input.
- Chỉ admin đã login mới gọi được.

Tiêu chí xong:

- Public không gọi được AI API.
- Có log để kiểm tra chi phí.

## Phase 4 - Database và backend sạch hơn

### TASK 4.1 - Thêm migration tool

Mục tiêu: quản lý thay đổi database có lịch sử.

Gợi ý:

- Dùng `knex` migration, hoặc
- Dùng `drizzle-kit`, hoặc
- Tự tạo thư mục `database/migrations` với file SQL đánh số.

Tiêu chí xong:

- Mỗi thay đổi DB có file migration riêng.
- Không sửa trực tiếp SQL dump gốc.

### TASK 4.2 - Chuẩn hoá schema

Mục tiêu: đặt tên bảng/cột rõ nghĩa hơn.

Nên làm sau khi admin chạy ổn.

Việc cần làm:

- Map bảng cũ sang tên mới.
- Tạo migration copy dữ liệu.
- Tạo view/compat layer nếu cần.

Tiêu chí xong:

- Code backend dùng tên rõ ràng.
- Dữ liệu cũ không mất.

### TASK 4.3 - Thêm ORM/query builder

Mục tiêu: giảm SQL raw rải rác.

Gợi ý:

- Prisma nếu muốn schema rõ, dev nhanh.
- Drizzle nếu muốn TypeScript nhẹ, gần SQL.
- Knex nếu muốn query builder đơn giản.

Tiêu chí xong:

- Query có type tốt hơn.
- Ít lỗi sai tên cột.

## Phase 5 - Deploy production

### TASK 5.1 - Docker hoá

Mục tiêu: deploy dễ hơn.

Việc cần làm:

- `Dockerfile` cho app.
- `docker-compose.yml` gồm app + mysql.
- Volume cho upload/assets nếu có upload mới.

Tiêu chí xong:

- Chạy `docker compose up -d` là lên web.

### TASK 5.2 - Cấu hình Nginx/PM2

Nếu không dùng Docker:

- Build frontend/backend.
- Chạy backend bằng PM2.
- Nginx reverse proxy về port backend.
- Bật HTTPS.

Tiêu chí xong:

- Domain chính load được frontend.
- `/api` hoạt động.
- Static upload load được.

### TASK 5.3 - Backup database và upload

Mục tiêu: tránh mất dữ liệu.

Việc cần làm:

- Script backup MySQL hằng ngày.
- Backup thư mục upload/assets.
- Lưu bản backup ra nơi khác server.

Tiêu chí xong:

- Có thể restore khi lỗi.

## Ưu tiên làm ngay

Thứ tự đề xuất cho lần làm tiếp theo:

1. TASK 1.3 - Tách route backend ra nhiều file.
2. TASK 2.1 - Tạo layout admin.
3. TASK 2.2 - Đăng nhập admin.
4. TASK 2.3 - Quản lý blog + duyệt bài AI.
5. TASK 2.4 - Quản lý sản phẩm + AI mô tả sản phẩm.

## Ghi chú cho người làm tiếp

Không nên làm quá nhiều thứ một lần. Mỗi lần chỉ chọn 1-2 task, làm xong build/test rồi mới chuyển task tiếp theo.
