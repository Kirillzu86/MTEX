import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { createCustomerRequest } from "../api/client";
import type { Product } from "../types/catalog";

type RequestFormProps = {
  product?: Product | null;
};

export function RequestForm({ product }: RequestFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      await createCustomerRequest({
        name,
        phone,
        comment,
        product_id: product?.id ?? null,
      });
      setName("");
      setPhone("");
      setComment("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <label>
        Имя
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Телефон
        <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
      </label>
      <label>
        Комментарий
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} />
      </label>
      <button className="primary-button" type="submit" disabled={status === "loading"}>
        <Send size={18} />
        {status === "loading" ? "Отправляем" : "Оставить заявку"}
      </button>
      {status === "success" && <p className="form-status success">Заявка отправлена. Мы свяжемся с вами.</p>}
      {status === "error" && <p className="form-status error">Не удалось отправить заявку. Проверьте сервер API.</p>}
    </form>
  );
}
