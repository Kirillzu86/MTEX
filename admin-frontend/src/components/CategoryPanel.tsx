import { FormEvent, useState } from "react";

import { createCategory, deleteCategory, updateCategory } from "../api/client";
import type { Category } from "../types/catalog";

type CategoryPanelProps = {
  categories: Category[];
  onReload: () => Promise<void>;
};

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  order: 0,
};

export function CategoryPanel({ categories, onReload }: CategoryPanelProps) {
  const [draft, setDraft] = useState(emptyCategory);
  const [editing, setEditing] = useState<Category | null>(null);

  const formValue = editing ?? draft;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editing) {
      await updateCategory(editing.id, editing);
      setEditing(null);
    } else {
      await createCategory(draft);
      setDraft(emptyCategory);
    }

    await onReload();
  }

  return (
    <section className="panel-grid">
      <form className="editor-panel" onSubmit={handleSubmit}>
        <h2>{editing ? "Редактировать категорию" : "Новая категория"}</h2>
        <label>
          Название
          <input
            value={formValue.name}
            onChange={(event) =>
              editing ? setEditing({ ...editing, name: event.target.value }) : setDraft({ ...draft, name: event.target.value })
            }
            required
          />
        </label>
        <label>
          URL
          <input
            value={formValue.slug}
            onChange={(event) =>
              editing ? setEditing({ ...editing, slug: event.target.value }) : setDraft({ ...draft, slug: event.target.value })
            }
            required
          />
        </label>
        <label>
          Описание
          <textarea
            value={formValue.description}
            onChange={(event) =>
              editing
                ? setEditing({ ...editing, description: event.target.value })
                : setDraft({ ...draft, description: event.target.value })
            }
            rows={4}
          />
        </label>
        <label>
          Порядок
          <input
            type="number"
            value={formValue.order}
            onChange={(event) =>
              editing
                ? setEditing({ ...editing, order: Number(event.target.value) })
                : setDraft({ ...draft, order: Number(event.target.value) })
            }
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={formValue.is_active}
            onChange={(event) =>
              editing
                ? setEditing({ ...editing, is_active: event.target.checked })
                : setDraft({ ...draft, is_active: event.target.checked })
            }
          />
          Показывать на сайте
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            Сохранить
          </button>
          {editing && (
            <button className="ghost-button" type="button" onClick={() => setEditing(null)}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="table-panel">
        <h2>Категории</h2>
        <div className="table-list">
          {categories.map((category) => (
            <article className="table-row" key={category.id}>
              <div>
                <strong>{category.name}</strong>
                <span>{category.slug}</span>
              </div>
              <span className={category.is_active ? "badge live" : "badge"}>{category.is_active ? "Активна" : "Скрыта"}</span>
              <div className="row-actions">
                <button type="button" onClick={() => setEditing(category)}>
                  Изменить
                </button>
                <button type="button" className="danger" onClick={() => deleteCategory(category.id).then(onReload)}>
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
