import { BadgePercent, ChevronRight, PackageCheck, Search, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getCategories, getProducts } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { RequestForm } from "../components/RequestForm";
import type { Category, Product } from "../types/catalog";

type HomePageProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

const demoCategories: Category[] = [
  { id: 1, name: "Мебельные ручки", slug: "handles", description: "Ручки, кнопки и профили для фасадов" },
  { id: 2, name: "Петли и механизмы", slug: "hinges", description: "Петли, доводчики и подъемники" },
  { id: 3, name: "Направляющие", slug: "slides", description: "Шариковые и скрытые направляющие" },
  { id: 4, name: "Опоры и ножки", slug: "legs", description: "Опоры для шкафов, кухонь и столов" },
  { id: 5, name: "Крепеж", slug: "fasteners", description: "Конфирматы, стяжки, уголки и заглушки" },
];

const demoProducts: Product[] = [
  {
    id: 1,
    name: "Ручка профильная Line 160 мм",
    slug: "line-handle-160",
    description: "Алюминиевая профильная ручка для кухонных фасадов и шкафов.",
    price: "1450.00",
    is_featured: true,
    category: demoCategories[0],
    images: [],
  },
  {
    id: 2,
    name: "Петля с доводчиком SoftClose",
    slug: "softclose-hinge",
    description: "Петля 110 градусов с плавным закрыванием для корпусной мебели.",
    price: "980.00",
    is_featured: true,
    category: demoCategories[1],
    images: [],
  },
  {
    id: 3,
    name: "Направляющие полного выдвижения 450 мм",
    slug: "full-extension-slide-450",
    description: "Шариковые направляющие для ящиков с высокой нагрузкой.",
    price: "2650.00",
    is_featured: true,
    category: demoCategories[2],
    images: [],
  },
  {
    id: 4,
    name: "Опора регулируемая кухонная 100 мм",
    slug: "kitchen-leg-100",
    description: "Пластиковая регулируемая опора для кухонных модулей.",
    price: "320.00",
    is_featured: false,
    category: demoCategories[3],
    images: [],
  },
  {
    id: 5,
    name: "Комплект конфирматов 7x50",
    slug: "confirmat-pack",
    description: "Крепеж для сборки корпусной мебели, упаковка 100 шт.",
    price: "1800.00",
    is_featured: false,
    category: demoCategories[4],
    images: [],
  },
];

const quickSets = ["Комплект для кухни", "Фурнитура для шкафа", "Сборочный крепеж", "Механизмы для ящиков"];
const brands = ["Blum", "Hettich", "Boyard", "GTV", "Firmax", "MTEX"];

export function HomePage({ search, onSearchChange }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([categoryData, productData]) => {
        setCategories(categoryData.length ? categoryData : demoCategories);
        setProducts(productData.length ? productData : demoProducts);
      })
      .catch(() => {});
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory ? product.category.slug === activeCategory : true;
      const query = search.trim().toLowerCase();
      const matchesSearch = query
        ? `${product.name} ${product.description} ${product.category.name}`.toLowerCase().includes(query)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, search]);

  const featuredProducts = visibleProducts.filter((product) => product.is_featured).slice(0, 4);
  const catalogProducts = visibleProducts.length ? visibleProducts : products;

  return (
    <>
      <main>
        <section className="storefront">
          <aside className="catalog-sidebar" id="catalog">
            <div className="sidebar-title">Каталог</div>
            <button className={!activeCategory ? "category-link active" : "category-link"} onClick={() => setActiveCategory("")}>
              Все товары
              <ChevronRight size={17} />
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={activeCategory === category.slug ? "category-link active" : "category-link"}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
                <ChevronRight size={17} />
              </button>
            ))}
          </aside>

          <section className="promo-hero">
            <div>
              <span className="eyebrow">Заказывай фурнитуру в MTEX</span>
              <h1>Все для сборки мебели в одном каталоге</h1>
              <p>Ручки, петли, направляющие, опоры и крепеж для мебельных мастерских и частных заказов.</p>
              <div className="hero-actions">
                <a className="primary-button" href="#products">
                  Смотреть предложения
                </a>
                <a className="secondary-button" href="#contacts">
                  Подобрать комплект
                </a>
              </div>
            </div>
          </section>
        </section>

        <section className="quick-sets" id="promos">
          {quickSets.map((set) => (
            <a key={set} href="#contacts">
              {set}
              <ChevronRight size={18} />
            </a>
          ))}
        </section>

        <section className="section compact-section">
          <div className="benefit-grid">
            <article>
              <Truck size={24} />
              <strong>Доставка по городу</strong>
              <span>Привезем фурнитуру на объект или в мастерскую.</span>
            </article>
            <article>
              <PackageCheck size={24} />
              <strong>Подбор комплектом</strong>
              <span>Поможем собрать фурнитуру под кухню, шкаф или гардеробную.</span>
            </article>
            <article>
              <BadgePercent size={24} />
              <strong>Цены для мастеров</strong>
              <span>Оптовые условия и быстрый расчет по списку.</span>
            </article>
          </div>
        </section>

        <section className="section product-section" id="products">
          <div className="section-heading store-heading">
            <div>
              <span className="eyebrow">Лучшие предложения</span>
              <h2>Популярная фурнитура</h2>
            </div>
            <label className="catalog-search">
              <Search size={18} />
              <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Поиск по каталогу" />
            </label>
          </div>

          <div className="product-grid featured-grid">
            {(featuredProducts.length ? featuredProducts : catalogProducts.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
            ))}
          </div>
        </section>

        <section className="brand-strip">
          {brands.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </section>

        <section className="section product-section">
          <div className="section-heading store-heading">
            <div>
              <span className="eyebrow">Товары</span>
              <h2>Каталог фурнитуры</h2>
            </div>
          </div>
          <div className="product-grid">
            {catalogProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
            ))}
          </div>
        </section>

        <section className="info-band" id="about">
          <div>
            <span className="eyebrow">О компании</span>
            <h2>Фурнитура для производства и ремонта мебели</h2>
          </div>
          <p>
            MTEX помогает быстро подобрать комплектующие для кухонь, шкафов, гардеробных и торгового оборудования.
            Каталог связан с общей базой данных, поэтому цены и наличие можно обновлять через админ-панель.
          </p>
        </section>

        <section className="section contact-section" id="contacts">
          <div className="contact-copy">
            <span className="eyebrow">Заявка</span>
            <h2>Нужен расчет по списку?</h2>
            <p>Оставьте контакты и напишите, какая фурнитура нужна. Менеджер подберет позиции и уточнит наличие.</p>
          </div>
          <RequestForm />
        </section>
      </main>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
