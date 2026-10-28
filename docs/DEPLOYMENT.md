# DEPLOYMENT - Gợi ý deploy production

## Cách đơn giản nhất

1. Upload source lên server.
2. Cài Node.js 20+.
3. Import database.
4. Tạo `.env` cho backend và frontend.
5. Build source.
6. Chạy backend bằng PM2.
7. Dùng Nginx reverse proxy về backend.

## Build

```bash
npm install
npm run build
```

## Chạy bằng PM2

```bash
npm install -g pm2
pm2 start apps/api/dist/server.js --name hopgiayre
pm2 save
pm2 startup
```

## Nginx mẫu

```nginx
server {
    server_name hopgiayre.vn www.hopgiayre.vn;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sau đó bật HTTPS bằng Certbot.

## Production env backend

```env
NODE_ENV=production
PORT=4000
WEB_ORIGIN=https://hopgiayre.vn,https://www.hopgiayre.vn
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=hopgiayre_user
DB_PASSWORD=mat_khau_manh
DB_NAME=hopgiayre
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
ADMIN_API_TOKEN=chuoi_bi_mat_dai
```

## Production env frontend

Nếu Express serve frontend cùng domain:

```env
VITE_API_BASE_URL=/api
VITE_ASSET_BASE_URL=
```

## Backup cần có

- Database MySQL.
- Thư mục `public-assets` hoặc upload mới sau này.
- File `.env` không commit public.

## Checklist trước khi public

- Đổi `ADMIN_API_TOKEN` thành chuỗi dài khó đoán.
- Không commit `.env` thật.
- Bật HTTPS.
- Chặn port MySQL từ bên ngoài.
- Chỉ mở port 80/443 public.
- Test `/api/ai/status` không lộ key.
- Test form báo giá gửi vào DB.
