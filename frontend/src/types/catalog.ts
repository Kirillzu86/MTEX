export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type ProductImage = {
  id: number;
  image: string;
  alt_text: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  is_featured: boolean;
  category: Category;
  images: ProductImage[];
};

export type RequestPayload = {
  name: string;
  phone: string;
  comment: string;
  product_id?: number | null;
};
