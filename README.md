# HopGiayRe.vn - Modern Fullstack TypeScript

Bản này đã bỏ toàn bộ backend CodeIgniter/PHP cũ. Source chỉ còn:

- `apps/web`: frontend React + TypeScript + Vite
- `apps/api`: backend Node.js + Express + TypeScript + MySQL
- `database`: SQL dump gốc và file index tối ưu tuỳ chọn
- `public-assets`: hình ảnh/upload dùng cho website

## Những cải tiến trong bản này

- Không còn phụ thuộc code PHP/CodeIgniter cũ.
- Backend có validate input cho form báo giá/email.
- API giới hạn `page`, `limit` để tránh query quá nặng.
- CORS chặt hơn: cấu hình bằng `WEB_ORIGIN`, hỗ trợ nhiều domain phân cách bằng dấu phẩy.
- Ảnh sản phẩm/blog/banner trả về path chuẩn từ backend, frontend không tự ghép sai thư mục nữa.
- Frontend chuyển từ hash route `#/...` sang URL sạch `/san-pham/...`, `/danh-muc/...`, `/tin-tuc/...`.
- Form báo giá gửi thật vào bảng `email_reg`, không chỉ mở Zalo.
- Thêm endpoint `GET /api/setting/get_all` để dùng thông tin cấu hình site sau này.
- Build production đã test thành công.

## Tài liệu quan trọng

Mình đã tách thêm các file `.md` để dễ làm tiếp:

- `docs/PROJECT_STATUS.md`: trạng thái hiện tại, đã làm gì/chưa làm gì.
- `docs/TASKS.md`: chia task theo phase, ưu tiên làm tiếp.
- `docs/AI_WRITER_GUIDE.md`: hướng dẫn module AI viết bài/mô tả/SEO.
- `docs/API.md`: danh sách API hiện có.
- `docs/SETUP.md`: hướng dẫn chạy local rõ từng bước.
- `docs/DEPLOYMENT.md`: gợi ý deploy production.


## 1. Tạo database

Tạo database MySQL/MariaDB tên `hopgiayre`, rồi import:

```bash
mysql -u root -p -e "CREATE DATABASE hopgiayre CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p hopgiayre < database/backup_hopgiayre_20260524.sql
```

Có thể chạy thêm index tối ưu:

```bash
mysql -u root -p hopgiayre < database/20260524_optional_indexes.sql
```

Nếu index đã tồn tại thì MySQL có thể báo lỗi duplicate, không ảnh hưởng dữ liệu.

## 2. Cấu hình backend

```bash
cd apps/api
cp .env.example .env
```

Sửa `.env` theo database của bạn:

```env
NODE_ENV=development
PORT=4000
WEB_ORIGIN=http://localhost:5173
JSON_LIMIT=1mb
FORM_LIMIT=1mb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hopgiayre
DB_CONNECTION_LIMIT=10
```

Nếu deploy frontend và backend cùng domain thì có thể để `WEB_ORIGIN` trống. Nếu nhiều domain:

```env
WEB_ORIGIN=https://hopgiayre.vn,https://www.hopgiayre.vn,http://localhost:5173
```

## 3. Cấu hình frontend

```bash
cd apps/web
cp .env.example .env
```

Dev mặc định:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ASSET_BASE_URL=http://localhost:4000
```

Production nếu backend Express serve luôn frontend thì có thể để:

```env
VITE_API_BASE_URL=/api
VITE_ASSET_BASE_URL=
```

## 4. Chạy dev

Ở thư mục gốc:

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/health`

## 5. Build production

```bash
npm install
npm run build
npm run start
```

Khi production, backend Express sẽ serve luôn `apps/web/dist` và assets `/upload`, `/images`, `/includehome`.

## API đã dựng lại

- `GET /health`
- `GET /api/setting/get_all`
- `GET /api/catalog/get_all`
- `GET /api/catalog/get?cid=...`
- `GET /api/banner/get_all?position=main&page_index=1&item_per_page=10`
- `GET /api/product/get_slice?page_index=1&item_per_page=12&cate_search=--&keyword=--&sort_by=hot`
- `GET /api/product/get?pid=...`
- `GET /api/product/mget?ids=1,2,3`
- `GET /api/blog/get_all?type=article&page_index=1&item_per_page=6`
- `GET /api/blog/get?bid=...`
- `GET /api/voucher/get_all`
- `POST /api/user/sendinfo`
- `POST /api/user/email`

## Ghi chú database

Mình vẫn giữ tên bảng/cột từ SQL cũ để import dữ liệu chạy ngay, không mất dữ liệu. Phần nên làm tiếp nếu muốn chuẩn hoá sâu hơn:

- Đổi schema sang tên tiếng Anh rõ nghĩa bằng migration.
- Thêm ORM như Prisma/Drizzle.
- Tách bảng lead/báo giá riêng thay vì dùng chung `email_reg`.
- Làm admin mới để quản lý sản phẩm, banner, bài viết.

## AI viết bài / mô tả sản phẩm / SEO

Bản này có sẵn module AI trong backend Node.js, không để API key ở frontend.

Cấu hình trong `apps/api/.env`:

```env
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
# Khuyến nghị bật token này nếu public tool AI/admin ra internet
ADMIN_API_TOKEN=doi_mot_chuoi_bi_mat_dai
```

Các API mới:

```txt
GET  /api/ai/status
POST /api/ai/blog/generate
POST /api/ai/blog/save-draft
POST /api/ai/product-description/generate
POST /api/ai/seo/generate
```

Màn hình test nhanh nằm tại:

```txt
/admin/ai
```

Quy trình khuyến nghị:

1. Admin nhập chủ đề/từ khóa trong `/admin/ai`.
2. AI tạo bản nháp: title, slug, meta title, meta description, keywords, summary, HTML content.
3. Admin đọc và chỉnh lại.
4. Bấm lưu nháp, hệ thống insert vào bảng `blog` với `status = 0`.
5. Sau này nên làm thêm màn hình quản trị blog thật để duyệt/sửa/xuất bản.

Lưu ý bảo mật: Nếu `ADMIN_API_TOKEN` có giá trị, frontend phải nhập đúng token ở màn hình `/admin/ai`; backend sẽ kiểm tra qua header `Authorization: Bearer ...`.

## Admin mới đã thêm

Các trang admin hiện có:

```txt
/admin/login
/admin
/admin/blogs
/admin/products
/admin/ai
```

Cấu hình đăng nhập trong `apps/api/.env`:

```env
ADMIN_API_TOKEN=doi_chuoi_bi_mat_nay
ADMIN_USERNAME=admin
ADMIN_PASSWORD=mat_khau_admin_neu_muon_dang_nhap_bang_form
```

Có 2 cách đăng nhập:

1. Dán `ADMIN_API_TOKEN` ở `/admin/login`.
2. Đặt `ADMIN_PASSWORD`, rồi đăng nhập bằng `ADMIN_USERNAME` + `ADMIN_PASSWORD`.

Admin hiện làm được:

- Xem dashboard thống kê nhanh.
- Xem/sửa/duyệt/xuất bản bài viết, gồm bài AI đã lưu nháp.
- Tìm sản phẩm, dùng AI viết lại mô tả, lưu mô tả vào sản phẩm.
- Dùng AI Writer trong layout admin.

Lưu ý: Admin hiện là bản nền tảng, chưa có upload ảnh và chưa có WYSIWYG editor. Nội dung bài đang sửa bằng HTML textarea.
