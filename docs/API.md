# API - HopGiayRe.vn Modern Backend

Backend chạy mặc định ở:

```txt
http://localhost:4000
```

Base API:

```txt
http://localhost:4000/api
```

## Health

```txt
GET /health
```

## Setting

```txt
GET /api/setting/get_all
```

## Catalog

```txt
GET /api/catalog/get_all
GET /api/catalog/get?cid=<category_id>
```

## Banner

```txt
GET /api/banner/get_all?position=main&page_index=1&item_per_page=10
```

## Product

```txt
GET /api/product/get_slice?page_index=1&item_per_page=12&cate_search=--&keyword=--&sort_by=hot
GET /api/product/get?pid=<product_id>
GET /api/product/mget?ids=1,2,3
```

## Blog

```txt
GET /api/blog/get_all?type=article&page_index=1&item_per_page=6
GET /api/blog/get?bid=<blog_id>
```

## Voucher

```txt
GET /api/voucher/get_all
```

## User / Lead

```txt
POST /api/user/sendinfo
POST /api/user/email
```

## AI

Nếu có `ADMIN_API_TOKEN`, thêm header:

```txt
Authorization: Bearer <token>
```

Endpoints:

```txt
GET  /api/ai/status
POST /api/ai/blog/generate
POST /api/ai/blog/save-draft
POST /api/ai/product-description/generate
POST /api/ai/seo/generate
```

## Ghi chú

Các API public hiện giữ format gần giống code cũ để frontend chuyển đổi ít lỗi. Khi làm admin/dashboard xong mới nên refactor API sang REST chuẩn hơn.

## Admin API mới

Tất cả API dưới đây, trừ login, cần header:

```txt
Authorization: Bearer <ADMIN_API_TOKEN hoặc token nhận sau login>
```

### Auth

```txt
POST /api/admin/auth/login
GET  /api/admin/auth/me
```

Payload login bằng token:

```json
{ "token": "ADMIN_API_TOKEN" }
```

Payload login bằng username/password:

```json
{ "username": "admin", "password": "mat_khau" }
```

### Dashboard

```txt
GET /api/admin/stats
```

### Blog admin

```txt
GET  /api/admin/blogs?status=all|draft|published&keyword=&page=1&limit=30
GET  /api/admin/blogs/:id
PUT  /api/admin/blogs/:id
POST /api/admin/blogs/:id/publish
POST /api/admin/blogs/:id/unpublish
```

### Product admin

```txt
GET /api/admin/products?keyword=&page=1&limit=30
GET /api/admin/products/:id
PUT /api/admin/products/:id/content
```

`PUT /api/admin/products/:id/content` dùng để lưu mô tả AI vào sản phẩm.
