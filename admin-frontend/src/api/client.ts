import type { Category, CustomerRequest, LoginResponse, Product } from "../types/catalog";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "mtex_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function login(username: string, password: string) {
  return request<LoginResponse>("/admin/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getCategories() {
  return request<Category[]>("/admin/categories/");
}

export function createCategory(payload: Partial<Category>) {
  return request<Category>("/admin/categories/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: number, payload: Partial<Category>) {
  return request<Category>(`/admin/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: number) {
  return request<void>(`/admin/categories/${id}/`, { method: "DELETE" });
}

export function getProducts() {
  return request<Product[]>("/admin/products/");
}

export function createProduct(payload: Partial<Product>) {
  return request<Product>("/admin/products/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: number, payload: Partial<Product>) {
  return request<Product>(`/admin/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number) {
  return request<void>(`/admin/products/${id}/`, { method: "DELETE" });
}

export function getRequests() {
  return request<CustomerRequest[]>("/admin/requests/");
}

export function updateRequest(id: number, payload: Partial<CustomerRequest>) {
  return request<CustomerRequest>(`/admin/requests/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteRequest(id: number) {
  return request<void>(`/admin/requests/${id}/`, { method: "DELETE" });
}
