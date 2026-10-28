# AI_WRITER_GUIDE - Hướng dẫn AI Writer

## Mục tiêu

AI Writer dùng để hỗ trợ admin viết nội dung nhanh hơn, không thay người duyệt nội dung.

Nguyên tắc:

- AI chỉ tạo bản nháp.
- Admin phải đọc, sửa và duyệt trước khi xuất bản.
- Không để OpenAI API key ở frontend.
- Không public AI API nếu chưa có bảo vệ admin.

## Cấu hình

Trong `apps/api/.env`:

```env
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
ADMIN_API_TOKEN=doi_mot_chuoi_bi_mat_dai
```

Nếu `ADMIN_API_TOKEN` có giá trị, mọi request AI cần header:

```txt
Authorization: Bearer <ADMIN_API_TOKEN>
```

## Màn hình test

Frontend có màn hình:

```txt
/admin/ai
```

Màn hình này hiện tại dùng để test nhanh AI Writer. Khi làm admin dashboard thật, nên đưa chức năng này vào khu quản trị có login.

## API hiện có

### Kiểm tra trạng thái AI

```txt
GET /api/ai/status
```

Dùng để kiểm tra backend đã có `OPENAI_API_KEY` chưa.

### Tạo bài blog

```txt
POST /api/ai/blog/generate
```

Input đề xuất:

```json
{
  "topic": "In hộp giấy đựng mỹ phẩm cao cấp",
  "primaryKeyword": "in hộp giấy đựng mỹ phẩm",
  "secondaryKeywords": ["hộp mỹ phẩm cao cấp", "in hộp giấy giá rẻ"],
  "tone": "tư vấn chuyên nghiệp, dễ hiểu",
  "wordCount": 1200
}
```

Output gồm:

- `title`
- `slug`
- `summary`
- `metaTitle`
- `metaDescription`
- `keywords`
- `html`
- `faq`

### Lưu bài blog nháp

```txt
POST /api/ai/blog/save-draft
```

Lưu vào bảng `blog`, trạng thái nháp `status = 0`.

Không nên dùng endpoint này để publish thẳng. Sau này admin blog sẽ duyệt rồi publish.

### Tạo mô tả sản phẩm

```txt
POST /api/ai/product-description/generate
```

Input đề xuất:

```json
{
  "name": "Hộp giấy đựng mỹ phẩm cao cấp",
  "category": "Hộp giấy",
  "material": "Giấy ivory 350gsm, cán mờ",
  "features": ["in offset", "ép kim", "bế theo yêu cầu"],
  "targetCustomer": "shop mỹ phẩm, spa, thương hiệu mỹ phẩm handmade"
}
```

Output gồm mô tả bán hàng, bullet lợi ích, CTA và đoạn SEO.

### Tạo SEO

```txt
POST /api/ai/seo/generate
```

Dùng để tạo:

- Meta title
- Meta description
- Slug
- Keyword phụ
- Outline
- FAQ

## Prompt nên dùng cho ngành hộp giấy

Các bài về HopGiayRe.vn nên giữ phong cách:

- Rõ ràng, thực tế, tư vấn như xưởng in thật.
- Tránh nói quá lố.
- Luôn nhắc các yếu tố khách hàng quan tâm:
  - Chất liệu giấy
  - Kích thước
  - Số lượng
  - Kiểu in
  - Gia công sau in
  - Thời gian sản xuất
  - Báo giá theo yêu cầu
- Có CTA liên hệ/Zalo/báo giá.

## Những việc nên làm tiếp

1. Đưa AI Writer vào form tạo/sửa blog thật.
2. Thêm editor WYSIWYG để sửa nội dung AI.
3. Thêm nút tối ưu lại bài cũ.
4. Thêm log chi phí/số lần gọi AI.
5. Thêm rate limit cho AI API.

## Tích hợp admin mới

AI Writer hiện không còn là trang test rời rạc. Nó nằm trong layout admin tại:

```txt
/admin/ai
```

Luồng viết bài chuẩn:

1. Vào `/admin/ai`.
2. Tạo bài blog bằng AI.
3. Bấm lưu nháp.
4. Vào `/admin/blogs`.
5. Sửa lại nội dung nếu cần.
6. Bấm “Duyệt & xuất bản”.

Luồng viết mô tả sản phẩm chuẩn:

1. Vào `/admin/products`.
2. Tìm sản phẩm.
3. Bấm “AI viết lại mô tả”.
4. Kiểm tra nội dung AI.
5. Bấm “Lưu mô tả AI vào sản phẩm”.
