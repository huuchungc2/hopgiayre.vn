import { Menu, Phone, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { Category } from '../types/domain';
import { categoryHref } from '../utils/format';

type HeaderProps = {
  categories: Category[];
  onSearch: (keyword: string) => void;
};

export function Header({ categories, onSearch }: HeaderProps) {
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <span>HopGiayRe.vn - In hộp giấy, túi giấy, catalogue</span>
        <a href="tel:0985363679"><Phone size={15} /> 0985 363 679</a>
      </div>
      <div className="header-main container">
        <a className="logo" href="/">Hộp Giấy <b>Rẻ</b></a>
        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(keyword.trim());
          }}
        >
          <Search size={18} />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm hộp giấy, túi giấy, catalogue..." />
          <button>Tìm</button>
        </form>
        <a className="cart-btn" href="/bao-gia"><ShoppingBag size={18} /> Báo giá</a>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Mở menu"><Menu /></button>
      </div>
      <nav className={`nav ${open ? 'open' : ''}`}>
        <div className="container nav-inner">
          <a href="/">Trang chủ</a>
          <a href="/san-pham">Sản phẩm</a>
          {categories.slice(0, 8).map((category) => (
            <a key={category.id} href={categoryHref(category)}>{category.name}</a>
          ))}
          <a href="/tin-tuc">Tin tức</a>
          <a href="/admin/ai">AI viết bài</a>
          <a href="/lien-he">Liên hệ</a>
        </div>
      </nav>
    </header>
  );
}
