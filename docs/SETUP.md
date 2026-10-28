# SETUP - Chạy project HopGiayRe.vn local

## Yêu cầu

- Node.js 20+
- MySQL hoặc MariaDB
- npm

## Bước 1 - Tạo database

```bash
mysql -u root -p -e "CREATE DATABASE hopgiayre CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p hopgiayre < database/backup_hopgiayre_20260524.sql
```

Chạy index tối ưu nếu muốn:

```bash
mysql -u root -p hopgiayre < database/20260524_optional_indexes.sql
```

## Bước 2 - Cấu hình backend

```bash
cd apps/api
cp .env.example .env
```

Sửa DB trong `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hopgiayre
```

Nếu dùng AI Writer:

```env
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
ADMIN_API_TOKEN=doi_mot_chuoi_bi_mat_dai
```

## Bước 3 - Cấu hình frontend

```bash
cd apps/web
cp .env.example .env
```

Dev:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ASSET_BASE_URL=http://localhost:4000
```

## Bước 4 - Cài package và chạy

Ở thư mục gốc:

```bash
npm install
npm run dev
```

Mở:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:4000
Health:   http://localhost:4000/health
AI:       http://localhost:5173/admin/ai
```

## Bước 5 - Build production

```bash
npm run build
npm run start
```

Khi production, Express sẽ serve frontend build trong `apps/web/dist`.
