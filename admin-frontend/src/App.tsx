import { Boxes, ClipboardList, FolderTree, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { clearToken, getCategories, getProducts, getRequests, getToken } from "./api/client";
import { CategoryPanel } from "./components/CategoryPanel";
import { LoginView } from "./components/LoginView";
import { ProductPanel } from "./components/ProductPanel";
import { RequestPanel } from "./components/RequestPanel";
import type { Category, CustomerRequest, Product } from "./types/catalog";

type Tab = "products" | "categories" | "requests";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const [tab, setTab] = useState<Tab>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(
    () => [
      { label: "Товаров", value: products.length },
      { label: "Категорий", value: categories.length },
      { label: "Новых заявок", value: requests.filter((request) => !request.is_processed).length },
    ],
    [categories.length, products.length, requests],
  );

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [categoryData, productData, requestData] = await Promise.all([getCategories(), getProducts(), getRequests()]);
      setCategories(categoryData);
      setProducts(productData);
      setRequests(requestData);
    } catch {
      setError("Не удалось загрузить данные. Проверьте вход и backend-сервер.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      void loadData();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>MT</span>
          <div>
            <strong>MTEX Admin</strong>
            <small>Управление каталогом</small>
          </div>
        </div>
        <nav>
          <button className={tab === "products" ? "active" : ""} type="button" onClick={() => setTab("products")}>
            <Boxes size={19} />
            Товары
          </button>
          <button className={tab === "categories" ? "active" : ""} type="button" onClick={() => setTab("categories")}>
            <FolderTree size={19} />
            Категории
          </button>
          <button className={tab === "requests" ? "active" : ""} type="button" onClick={() => setTab("requests")}>
            <ClipboardList size={19} />
            Заявки
          </button>
        </nav>
        <button
          className="logout-button"
          type="button"
          onClick={() => {
            clearToken();
            setIsLoggedIn(false);
          }}
        >
          <LogOut size={18} />
          Выйти
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Административный сайт</span>
            <h1>Каталог и заявки</h1>
          </div>
          <button className="ghost-button" type="button" onClick={() => void loadData()}>
            <RefreshCw size={18} />
            Обновить
          </button>
        </header>

        <div className="stats-grid">
          {stats.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        {loading && <p className="notice">Загружаем данные...</p>}
        {error && <p className="notice error">{error}</p>}

        {tab === "products" && <ProductPanel products={products} categories={categories} onReload={loadData} />}
        {tab === "categories" && <CategoryPanel categories={categories} onReload={loadData} />}
        {tab === "requests" && <RequestPanel requests={requests} onReload={loadData} />}
      </section>
    </main>
  );
}
