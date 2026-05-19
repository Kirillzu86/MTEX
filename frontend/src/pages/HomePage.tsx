import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getCategories, getProducts } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { RequestForm } from "../components/RequestForm";
import type { Category, Product } from "../types/catalog";

const demoCategories: Category[] = [
  { id: 1, name: "Кухни", slug: "kitchens", description: "Кухонные гарнитуры на заказ" },
  { id: 2, name: "Шкафы", slug: "wardrobes", description: "Шкафы-купе и гардеробные" },
  { id: 3, name: "Гостиные", slug: "living-rooms", description: "ТВ-зоны и системы хранения" },
];

const demoProducts: Product[] = [
  {
    id: 1,
    name: "Кухня City Line",
    slug: "city-line",
    description: "Современная кухня с матовыми фасадами, встроенной техникой и продуманным хранением.",
    price: "590000.00",
    is_featured: true,
    category: demoCategories[0],
    images: [],
  },
  {
    id: 2,
    name: "Шкаф Alto",
    slug: "alto",
    description: "Встроенный шкаф с раздвижными дверями, подсветкой и индивидуальным наполнением.",
    price: "320000.00",
    is_featured: true,
    category: demoCategories[1],
    images: [],
  },
  {
    id: 3,
    name: "Гостиная Forma",
    slug: "forma",
    description: "Лаконичная мебельная композиция для гостиной с закрытыми и открытыми секциями.",
    price: "410000.00",
    is_featured: false,
    category: demoCategories[2],
    images: [],
  },
];

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
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

  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">Мебель на заказ в едином каталоге</span>
            <h1>Мебельные технологии</h1>
            <p>
              Клиентский сайт с актуальными товарами, ценами и заявками. Управление каталогом выполняется через
              защищенную административную панель.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#catalog">
                Смотреть каталог
              </a>
              <a className="secondary-button" href="#contacts">
                Связаться
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="catalog">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2>Актуальный ассортимент</h2>
            </div>
          </div>

          <div className="catalog-tools">
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по товарам"
              />
            </label>
            <div className="category-filter" aria-label="Фильтр категорий">
              <SlidersHorizontal size={18} />
              <button className={!activeCategory ? "active" : ""} type="button" onClick={() => setActiveCategory("")}>
                Все
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={activeCategory === category.slug ? "active" : ""}
                  type="button"
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
            ))}
          </div>
        </section>

        <section className="info-band" id="about">
          <div>
            <span className="eyebrow">О компании</span>
            <h2>Каталог, который удобно обновлять</h2>
          </div>
          <p>
            Товары, категории, фотографии и цены хранятся в общей базе данных. Сотрудники могут обновлять каталог через
            Django admin, а клиенты сразу видят изменения на сайте.
          </p>
        </section>

        <section className="section contact-section" id="contacts">
          <div className="contact-copy">
            <span className="eyebrow">Заявка</span>
            <h2>Оставьте контакты</h2>
            <p>Форма сохраняет заявки в базе данных. Их можно обрабатывать в административной панели.</p>
          </div>
          <RequestForm />
        </section>
      </main>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
