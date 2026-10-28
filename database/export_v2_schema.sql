-- ==============================================================================
-- HOPGIAYRE.VN - CƠ SỞ DỮ LIỆU CHUẨN HÓA V2 (ENTERPRISE STANDARD SCHEMA)
-- Đã xóa bỏ hoàn toàn tình trạng đặt tên "nửa Ta nửa Tây", hỗn độn collation
-- Đã chuẩn hóa: Tiếng Anh 100%, khóa chính id, khóa ngoại quan hệ, Index tối ưu
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG DANH MỤC BAO BÌ (CATEGORIES)
CREATE TABLE IF NOT EXISTS v2_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_cid INT DEFAULT NULL COMMENT 'ID tham chiếu danh mục cũ',
  code VARCHAR(50) DEFAULT NULL COMMENT 'Mã danh mục',
  name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục tiếng Việt',
  slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'Đường dẫn SEO chuẩn',
  parent_id INT UNSIGNED DEFAULT NULL COMMENT 'Danh mục cha',
  image_url VARCHAR(500) DEFAULT NULL COMMENT 'Ảnh đại diện danh mục',
  icon_url VARCHAR(500) DEFAULT NULL COMMENT 'Icon danh mục',
  banner_url VARCHAR(500) DEFAULT NULL,
  short_description TEXT DEFAULT NULL,
  description LONGTEXT DEFAULT NULL,
  sort_order INT DEFAULT 0 COMMENT 'Thứ tự ưu tiên hiển thị',
  is_active TINYINT(1) DEFAULT 1,
  is_featured TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_slug (slug),
  INDEX idx_categories_parent (parent_id),
  INDEX idx_categories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG SẢN PHẨM HỘP GIẤY & BAO BÌ (PRODUCTS)
CREATE TABLE IF NOT EXISTS v2_products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_pid INT DEFAULT NULL COMMENT 'ID tham chiếu sản phẩm cũ',
  code VARCHAR(50) DEFAULT NULL COMMENT 'Mã sản phẩm (VD: HG-001)',
  name VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm đầy đủ',
  slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'Đường dẫn tĩnh SEO',
  price DECIMAL(12,2) DEFAULT 0 COMMENT 'Đơn giá xuất xưởng',
  original_price DECIMAL(12,2) DEFAULT 0 COMMENT 'Giá gốc trước giảm',
  discount_percent INT DEFAULT 0 COMMENT 'Phần trăm giảm giá',
  category_id INT UNSIGNED DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  gallery JSON DEFAULT NULL COMMENT 'Mảng đường dẫn ảnh phụ (JSON)',
  short_description TEXT DEFAULT NULL,
  description LONGTEXT DEFAULT NULL,
  is_hot TINYINT(1) DEFAULT 0,
  is_new TINYINT(1) DEFAULT 0,
  is_promo TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  view_count INT UNSIGNED DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_slug (slug),
  INDEX idx_products_category (category_id),
  INDEX idx_products_hot (is_hot),
  INDEX idx_products_price (price),
  INDEX idx_products_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG LIÊN KẾT NHIỀU DANH MỤC (PRODUCT_CATEGORIES)
CREATE TABLE IF NOT EXISTS v2_product_categories (
  product_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, category_id),
  INDEX idx_pc_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG BÀI VIẾT & CẨM NANG IN ẤN (POSTS - THAY THẾ BLOG)
CREATE TABLE IF NOT EXISTS v2_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_id INT DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT DEFAULT NULL,
  content LONGTEXT DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  author VARCHAR(100) DEFAULT 'HopGiayRe.vn',
  related_post_ids JSON DEFAULT NULL,
  view_count INT UNSIGNED DEFAULT 0,
  is_published TINYINT(1) DEFAULT 1,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_posts_slug (slug),
  INDEX idx_posts_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG BANNER QUẢNG CÁO (BANNERS)
CREATE TABLE IF NOT EXISTS v2_banners (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_bid INT DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  mobile_image_url VARCHAR(500) DEFAULT NULL,
  target_url VARCHAR(500) DEFAULT NULL,
  button_text VARCHAR(100) DEFAULT NULL,
  position VARCHAR(50) DEFAULT 'main',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_banners_pos (position, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG ĐƠN ĐẶT HÀNG (ORDERS - THAY THẾ DONHANG)
CREATE TABLE IF NOT EXISTS v2_orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_id INT DEFAULT NULL,
  order_code VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(150) DEFAULT NULL,
  shipping_address TEXT DEFAULT NULL,
  total_amount DECIMAL(15,2) DEFAULT 0,
  order_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cod',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  customer_notes TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_code (order_code),
  INDEX idx_orders_phone (customer_phone),
  INDEX idx_orders_status (order_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS - THAY THẾ CHITIETHOADON)
CREATE TABLE IF NOT EXISTS v2_order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_id INT DEFAULT NULL,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED DEFAULT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  INDEX idx_items_order (order_id),
  INDEX idx_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BẢNG YÊU CẦU BÁO GIÁ NHANH (QUOTE_REQUESTS - THAY THẾ EMAIL_REG)
CREATE TABLE IF NOT EXISTS v2_quote_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_id INT DEFAULT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(150) DEFAULT NULL,
  shipping_address TEXT DEFAULT NULL,
  box_type VARCHAR(150) DEFAULT NULL,
  length DECIMAL(8,2) DEFAULT NULL,
  width DECIMAL(8,2) DEFAULT NULL,
  height DECIMAL(8,2) DEFAULT NULL,
  quantity INT UNSIGNED DEFAULT NULL,
  estimated_unit_price DECIMAL(12,2) DEFAULT NULL,
  estimated_total_price DECIMAL(15,2) DEFAULT NULL,
  content TEXT DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_quotes_phone (customer_phone),
  INDEX idx_quotes_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
