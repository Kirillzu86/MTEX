import { ArrowRight } from "lucide-react";

import type { Product } from "../types/catalog";

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80";

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const image = product.images[0]?.image ?? fallbackImage;

  return (
    <article className="product-card">
      <button className="product-image-button" type="button" onClick={() => onOpen(product)}>
        <img src={image} alt={product.images[0]?.alt_text || product.name} />
      </button>
      <div className="product-card-body">
        <span className="category-label">{product.category.name}</span>
        <h3>{product.name}</h3>
        <p>{product.description || "Описание товара можно добавить в административной панели."}</p>
        <div className="product-card-footer">
          <strong>{Number(product.price).toLocaleString("ru-RU")} ₸</strong>
          <button type="button" className="text-button" onClick={() => onOpen(product)}>
            Подробнее
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
