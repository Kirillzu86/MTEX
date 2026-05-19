import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "#catalog", label: "Каталог" },
  { href: "#about", label: "О компании" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#">
        <span className="brand-mark">MT</span>
        <span>
          <strong>Мебельные технологии</strong>
          <small>Корпусная мебель на заказ</small>
        </span>
      </a>

      <nav className={isOpen ? "nav nav-open" : "nav"}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>

      <button className="icon-button mobile-menu" type="button" onClick={() => setIsOpen((value) => !value)}>
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
