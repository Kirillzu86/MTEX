import { Heart, Menu, Phone, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

const navItems = [
  { href: "#catalog", label: "Каталог" },
  { href: "#promos", label: "Акции" },
  { href: "#about", label: "О компании" },
  { href: "#contacts", label: "Контакты" },
];

export function Header({ search, onSearchChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="header-inner top-strip-inner">
          <nav className="service-nav">
            <a href="#about">О компании</a>
            <a href="#promos">Акции</a>
            <a href="#contacts">Условия доставки</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <a className="phone-link" href="tel:+77018315574">
            <Phone size={16} />
            +7 (701) 831 55 74
          </a>
        </div>
      </div>

      <div className="header-inner main-header">
        <a className="brand" href="#">
          <span className="brand-mark">MT</span>
          <span>
            <strong>Мебельные технологии</strong>
            <small>Фурнитура для мебели</small>
          </span>
        </a>

        <a className="catalog-button" href="#catalog">
          <Menu size={20} />
          Каталог
        </a>

        <label className="header-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по фурнитуре"
          />
        </label>

        <div className="header-actions">
          <a href="http://127.0.0.1:5174/" title="Кабинет">
            <UserRound size={21} />
            <span>Кабинет</span>
          </a>
          <a href="#catalog" title="Избранное">
            <Heart size={21} />
            <span>0</span>
          </a>
          <a href="#contacts" title="Заявка">
            <ShoppingCart size={21} />
            <span>Заявка</span>
          </a>
        </div>

        <button className="icon-button mobile-menu" type="button" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={isOpen ? "header-inner nav-row nav-open" : "header-inner nav-row"}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
