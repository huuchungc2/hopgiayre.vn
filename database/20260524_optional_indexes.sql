-- Tuỳ chọn: thêm index để backend Node.js truy vấn nhanh hơn.
-- Chạy sau khi import backup_hopgiayre_20260524.sql.
ALTER TABLE products ADD INDEX idx_products_enable_pid (enable, pid);
ALTER TABLE products ADD INDEX idx_products_flags (hot, promo, new, combo);
ALTER TABLE products ADD INDEX idx_products_price (price);
ALTER TABLE product_cates ADD INDEX idx_product_cates_pid (pid);
ALTER TABLE product_cates ADD INDEX idx_product_cates_cid (cid);
ALTER TABLE category ADD INDEX idx_category_enable_parent (enable, cparent);
ALTER TABLE blog ADD INDEX idx_blog_status_type (status, type, id);
ALTER TABLE banner ADD INDEX idx_banner_status_position (status, position, pos_index);
