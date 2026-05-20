import { Eye, ShoppingCart, Star } from "lucide-react";

import type { Product } from "../types/catalog";

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=82";

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const image = product.images[0]?.image ?? fallbackImage;

  return (
    <article className="product-card">
      {product.is_featured && <span className="hit-badge">Хит</span>}
      <button className="quick-view" type="button" onClick={() => onOpen(product)}>
        <Eye size={16} />
        Быстрый просмотр
      </button>
      <button className="product-image-button" type="button" onClick={() => onOpen(product)}>
        <img src={image} alt={product.images[0]?.alt_text || product.name} />
      </button>
      <div className="product-card-body">
        <span className="category-label">{product.category.name}</span>
        <h3>{product.name}</h3>
        <div className="rating-row">
          <Star size={15} fill="currentColor" />
          <Star size={15} fill="currentColor" />
          <Star size={15} fill="currentColor" />
          <Star size={15} fill="currentColor" />
          <Star size={15} />
          <span>В наличии</span>
        </div>
        <p>{product.description || "Описание товара можно добавить в административной панели."}</p>
        <div className="product-card-footer">
          <strong>{Number(product.price).toLocaleString("ru-RU")} тенге/шт</strong>
          <button type="button" className="cart-button" onClick={() => onOpen(product)}>
            <ShoppingCart size={18} />
            В заявку
          </button>
        </div>
      </div>
    </article>
  );
}
