import type { Category, Product, RequestPayload } from "../types/catalog";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getCategories() {
  return request<Category[]>("/categories/");
}

export function getProducts(params: { category?: string; featured?: boolean; search?: string } = {}) {
  const searchParams = new URLSearchParams();

  if (params.category) {
    searchParams.set("category", params.category);
  }
  if (params.featured) {
    searchParams.set("featured", "1");
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }

  const query = searchParams.toString();
  return request<Product[]>(`/products/${query ? `?${query}` : ""}`);
}

export function getProduct(slug: string) {
  return request<Product>(`/products/${slug}/`);
}

export function createCustomerRequest(payload: RequestPayload) {
  return request<{ id: number }>("/requests/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
