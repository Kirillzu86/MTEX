import { FormEvent, useState } from "react";

import { createProduct, deleteProduct, updateProduct } from "../api/client";
import type { Category, Product } from "../types/catalog";

type ProductPanelProps = {
  products: Product[];
  categories: Category[];
  onReload: () => Promise<void>;
};

type ProductDraft = {
  name: string;
  slug: string;
  description: string;
  price: string;
  category: number;
  is_active: boolean;
  is_featured: boolean;
};

const emptyProduct: ProductDraft = {
  name: "",
  slug: "",
  description: "",
  price: "0.00",
  category: 0,
  is_active: true,
  is_featured: false,
};

function toDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    is_active: product.is_active,
    is_featured: product.is_featured,
  };
}

export function ProductPanel({ products, categories, onReload }: ProductPanelProps) {
  const [draft, setDraft] = useState<ProductDraft>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);

  const activeDraft = editingId ? draft : { ...draft, category: draft.category || categories[0]?.id || 0 };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      await updateProduct(editingId, activeDraft);
      setEditingId(null);
    } else {
      await createProduct(activeDraft);
    }

    setDraft(emptyProduct);
    await onReload();
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setDraft(toDraft(product));
  }

  return (
    <section className="panel-grid">
      <form className="editor-panel" onSubmit={handleSubmit}>
        <h2>{editingId ? "Редактировать товар" : "Новый товар"}</h2>
        <label>
          Название
          <input value={activeDraft.name} onChange={(event) => setDraft({ ...activeDraft, name: event.target.value })} required />
        </label>
        <label>
          URL
          <input value={activeDraft.slug} onChange={(event) => setDraft({ ...activeDraft, slug: event.target.value })} required />
        </label>
        <label>
          Категория
          <select
            value={activeDraft.category}
            onChange={(event) => setDraft({ ...activeDraft, category: Number(event.target.value) })}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Цена
          <input
            type="number"
            step="0.01"
            value={activeDraft.price}
            onChange={(event) => setDraft({ ...activeDraft, price: event.target.value })}
            required
          />
        </label>
        <label>
          Описание
          <textarea
            value={activeDraft.description}
            onChange={(event) => setDraft({ ...activeDraft, description: event.target.value })}
            rows={5}
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={activeDraft.is_active}
            onChange={(event) => setDraft({ ...activeDraft, is_active: event.target.checked })}
          />
          Показывать на сайте
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={activeDraft.is_featured}
            onChange={(event) => setDraft({ ...activeDraft, is_featured: event.target.checked })}
          />
          На главную
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={!categories.length}>
            Сохранить
          </button>
          {editingId && (
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(emptyProduct);
              }}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="table-panel">
        <h2>Товары</h2>
        <div className="table-list">
          {products.map((product) => (
            <article className="table-row product-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <span>{product.category_detail?.name} · {Number(product.price).toLocaleString("ru-RU")} ₸</span>
              </div>
              <span className={product.is_active ? "badge live" : "badge"}>{product.is_active ? "На сайте" : "Скрыт"}</span>
              <div className="row-actions">
                <button type="button" onClick={() => startEdit(product)}>
                  Изменить
                </button>
                <button type="button" className="danger" onClick={() => deleteProduct(product.id).then(onReload)}>
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
