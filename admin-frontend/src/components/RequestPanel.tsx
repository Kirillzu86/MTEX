import { CheckCircle2, Trash2 } from "lucide-react";

import { deleteRequest, updateRequest } from "../api/client";
import type { CustomerRequest } from "../types/catalog";

type RequestPanelProps = {
  requests: CustomerRequest[];
  onReload: () => Promise<void>;
};

export function RequestPanel({ requests, onReload }: RequestPanelProps) {
  return (
    <section className="table-panel wide-panel">
      <h2>Заявки клиентов</h2>
      <div className="request-list">
        {requests.map((request) => (
          <article className="request-card" key={request.id}>
            <div>
              <span className={request.is_processed ? "badge live" : "badge"}>{request.is_processed ? "Обработана" : "Новая"}</span>
              <h3>{request.name}</h3>
              <a href={`tel:${request.phone}`}>{request.phone}</a>
              <p>{request.comment || "Комментарий не указан."}</p>
              <small>{request.product ? `Товар: ${request.product.name}` : "Без выбранного товара"}</small>
            </div>
            <div className="request-actions">
              <button
                type="button"
                onClick={() => updateRequest(request.id, { is_processed: !request.is_processed }).then(onReload)}
              >
                <CheckCircle2 size={18} />
                {request.is_processed ? "Вернуть" : "Обработать"}
              </button>
              <button type="button" className="danger" onClick={() => deleteRequest(request.id).then(onReload)}>
                <Trash2 size={18} />
                Удалить
              </button>
            </div>
          </article>
        ))}
        {!requests.length && <p className="empty-state">Заявок пока нет.</p>}
      </div>
    </section>
  );
}
