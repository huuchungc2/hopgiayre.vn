import mysql from 'mysql2/promise';

async function migrate() {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hopgiayre',
    charset: 'utf8mb4',
    multipleStatements: true,
  });

  console.log('--- BẮT ĐẦU CHUẨN HÓA CƠ SỞ DỮ LIỆU V2 (CHUẨN QUỐC TẾ) ---');

  // 1. Tạo các bảng chuẩn hóa v2
  const schemaSql = `
    -- 1. Bảng danh mục sản phẩm (categories)
    CREATE TABLE IF NOT EXISTS v2_categories (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      legacy_cid INT DEFAULT NULL,
      code VARCHAR(50) DEFAULT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      parent_id INT UNSIGNED DEFAULT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      icon_url VARCHAR(500) DEFAULT NULL,
      banner_url VARCHAR(500) DEFAULT NULL,
      short_description TEXT DEFAULT NULL,
      description LONGTEXT DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      is_featured TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_categories_slug (slug),
      INDEX idx_categories_parent (parent_id),
      INDEX idx_categories_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- 2. Bảng sản phẩm bao bì (products)
    CREATE TABLE IF NOT EXISTS v2_products (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      legacy_pid INT DEFAULT NULL,
      code VARCHAR(50) DEFAULT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      price DECIMAL(12,2) DEFAULT 0,
      original_price DECIMAL(12,2) DEFAULT 0,
      discount_percent INT DEFAULT 0,
      category_id INT UNSIGNED DEFAULT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      image_alt VARCHAR(255) DEFAULT NULL,
      gallery JSON DEFAULT NULL,
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

    -- 3. Bảng liên kết sản phẩm - nhiều danh mục (product_categories)
    CREATE TABLE IF NOT EXISTS v2_product_categories (
      product_id INT UNSIGNED NOT NULL,
      category_id INT UNSIGNED NOT NULL,
      PRIMARY KEY (product_id, category_id),
      INDEX idx_pc_category (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- 4. Bảng bài viết & cẩm nang SEO (posts)
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

    -- 5. Bảng banner quảng cáo (banners)
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

    -- 6. Bảng đơn đặt hàng (orders - thay thế donhang)
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

    -- 7. Bảng chi tiết đơn hàng (order_items - thay thế chitiethoadon)
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

    -- 8. Bảng yêu cầu báo giá nhanh (quote_requests - thay thế email_reg)
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
  `;

  await pool.query(schemaSql);
  console.log('✓ Đã tạo thành công cấu trúc bảng v2 chuẩn quốc tế.');

  // Helper hàm tạo slug sạch
  function toSlug(text, id) {
    if (!text) return `item-${id}`;
    let str = String(text).toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return str || `item-${id}`;
  }

  // 2. Di chuyển Categories
  console.log('-> Đang chuyển đổi danh mục (category -> v2_categories)...');
  const [oldCats] = await pool.query('SELECT * FROM category');
  for (const c of oldCats) {
    const slug = c.alias || toSlug(c.cname, c.cid);
    const img = c.image ? (c.image.startsWith('upload/') ? c.image : `upload/imgcategory/${c.image}`) : null;
    const icon = c.icon ? (c.icon.startsWith('upload/') ? c.icon : `upload/imgcategory/${c.icon}`) : null;
    
    await pool.query(`
      INSERT INTO v2_categories (id, legacy_cid, name, slug, image_url, icon_url, short_description, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), image_url = VALUES(image_url), sort_order = VALUES(sort_order)
    `, [c.cid, c.cid, c.cname, slug, img, icon, c.short_desc || null, Number(c.pos_index) || 0, Number(c.enable) || 1]);
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldCats.length} danh mục.`);

  // 3. Di chuyển Products
  console.log('-> Đang chuyển đổi sản phẩm (products -> v2_products)...');
  const [oldProds] = await pool.query('SELECT * FROM products');
  for (const p of oldProds) {
    const slug = p.alias || toSlug(p.name, p.pid);
    const img = p.image ? (p.image.startsWith('upload/') ? p.image : `upload/imgproduct/${p.image}`) : null;
    let gallery = [];
    try {
      if (p.img_path) gallery = JSON.parse(p.img_path);
    } catch {}
    gallery = (Array.isArray(gallery) ? gallery : []).map(g => g.startsWith('upload/') ? g : `upload/imgproduct/${g}`);

    await pool.query(`
      INSERT INTO v2_products (
        id, legacy_pid, code, name, slug, price, original_price, discount_percent,
        image_url, image_alt, gallery, short_description, description,
        is_hot, is_new, is_promo, is_active, view_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), image_url = VALUES(image_url)
    `, [
      p.pid, p.pid, p.code || null, p.name, slug,
      Number(p.price) || 0, Number(p.original_price) || 0, Number(p.discount) || 0,
      img, p.image_alt || p.name, JSON.stringify(gallery),
      p.des_vn || p.des_en || null, p.content_vn || p.content_en || null,
      Number(p.hot) || 0, Number(p.new) || 0, Number(p.promo) || 0,
      Number(p.status) === 0 ? 0 : 1, Number(p.view) || 0
    ]);
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldProds.length} sản phẩm.`);

  // 4. Di chuyển Product Categories
  console.log('-> Đang chuyển đổi liên kết sản phẩm - danh mục (product_cates -> v2_product_categories)...');
  const [oldCates] = await pool.query('SELECT pid, cid FROM product_cates');
  for (const pc of oldCates) {
    if (pc.pid && pc.cid) {
      await pool.query(`
        INSERT IGNORE INTO v2_product_categories (product_id, category_id)
        VALUES (?, ?)
      `, [pc.pid, pc.cid]);
    }
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldCates.length} liên kết danh mục.`);

  // 5. Di chuyển Blogs (blog -> v2_posts)
  console.log('-> Đang chuyển đổi bài viết (blog -> v2_posts)...');
  const [oldBlogs] = await pool.query('SELECT * FROM blog');
  for (const b of oldBlogs) {
    const slug = b.alias || toSlug(b.title, b.id);
    const img = b.image ? (b.image.startsWith('upload/') ? b.image : `upload/imgblog/${b.image}`) : null;
    let related = [];
    try {
      if (b.related_blog) related = JSON.parse(b.related_blog);
    } catch {}

    await pool.query(`
      INSERT INTO v2_posts (id, legacy_id, title, slug, summary, content, image_url, author, related_post_ids, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)
    `, [
      b.id, b.id, b.title, slug,
      b.summary || null, b.content || null,
      img, b.author || 'HopGiayRe.vn', JSON.stringify(related),
      Number(b.status) === 0 ? 0 : 1,
      b.datetime ? new Date(Number(b.datetime) * 1000) : new Date()
    ]);
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldBlogs.length} bài viết.`);

  // 6. Di chuyển Banners (banner -> v2_banners)
  console.log('-> Đang chuyển đổi banner (banner -> v2_banners)...');
  const [oldBanners] = await pool.query('SELECT * FROM banner');
  for (const bn of oldBanners) {
    const img = bn.image ? (bn.image.startsWith('upload/') ? bn.image : `upload/imgbanner/${bn.image}`) : '';
    const mobileImg = bn.image_mobile ? (bn.image_mobile.startsWith('upload/') ? bn.image_mobile : `upload/imgbanner/${bn.image_mobile}`) : null;

    await pool.query(`
      INSERT INTO v2_banners (id, legacy_bid, title, image_url, mobile_image_url, target_url, button_text, position, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title = VALUES(title), image_url = VALUES(image_url)
    `, [
      bn.bid, bn.bid, bn.bname || 'Banner',
      img, mobileImg, bn.link || null, bn.btn_text || null,
      bn.position || 'main', Number(bn.pos_index) || 0, Number(bn.enable) || 1
    ]);
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldBanners.length} banner.`);

  // 7. Di chuyển Đơn hàng (donhang -> v2_orders)
  console.log('-> Đang chuyển đổi đơn hàng (donhang -> v2_orders)...');
  const [oldOrders] = await pool.query('SELECT * FROM donhang');
  for (const o of oldOrders) {
    await pool.query(`
      INSERT INTO v2_orders (id, legacy_id, order_code, customer_name, customer_phone, customer_email, shipping_address, total_amount, order_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name)
    `, [
      o.id, o.id, o.madonhang || `DH-${o.id}`,
      o.hoten || 'Khách hàng', o.dienthoai || '', o.email || null,
      o.diachi || null, Number(o.tongtien) || 0,
      o.trangthai === '1' ? 'completed' : 'pending',
      o.ngaytao ? new Date(Number(o.ngaytao) * 1000) : new Date()
    ]);
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldOrders.length} đơn hàng.`);

  // 8. Di chuyển Yêu cầu báo giá (email_reg -> v2_quote_requests)
  console.log('-> Đang chuyển đổi yêu cầu báo giá (email_reg -> v2_quote_requests)...');
  const [oldQuotes] = await pool.query('SELECT * FROM email_reg');
  for (const q of oldQuotes) {
    await pool.query(`
      INSERT INTO v2_quote_requests (id, legacy_id, customer_name, customer_phone, customer_email, shipping_address, content, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name)
    `, [
      q.id, q.id, q.name || 'Khách web', q.phone || '',
      q.email || null, q.address || null, q.content || null,
      q.datetime ? new Date(Number(q.datetime) * 1000) : new Date()
    ]);
  }
  console.log(`✓ Đã chuyển đổi thành công ${oldQuotes.length} yêu cầu báo giá.`);

  console.log('--- HOÀN THÀNH 100% CHUẨN HÓA CƠ SỞ DỮ LIỆU V2 SẠCH SẼ, CHUẨN QUỐC TẾ! ---');
  await pool.end();
}

migrate().catch(console.error);
