export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
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
  is_active: boolean;
  is_featured: boolean;
  category: number;
  category_detail: Pick<Category, "id" | "name" | "slug" | "description">;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
};

export type CustomerRequest = {
  id: number;
  name: string;
  phone: string;
  comment: string;
  product: Product | null;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};
