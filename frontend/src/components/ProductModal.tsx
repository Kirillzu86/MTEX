import { X } from "lucide-react";

import type { Product } from "../types/catalog";
import { RequestForm } from "./RequestForm";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=82";

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) {
    return null;
  }

  const image = product.images[0]?.image ?? fallbackImage;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="product-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" type="button" onClick={onClose}>
          <X size={22} />
        </button>
        <div className="modal-media">
          <img src={image} alt={product.images[0]?.alt_text || product.name} />
        </div>
        <div className="modal-content">
          <span className="category-label">{product.category.name}</span>
          <h2>{product.name}</h2>
          <strong className="modal-price">{Number(product.price).toLocaleString("ru-RU")} тенге/шт</strong>
          <p>{product.description || "Подробное описание товара можно добавить через административную панель."}</p>
          <RequestForm product={product} />
        </div>
      </section>
    </div>
  );
}
