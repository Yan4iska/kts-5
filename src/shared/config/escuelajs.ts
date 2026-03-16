import { mapEscuelaProductToProduct, type EscuelaProductRaw } from 'adapters/productAdapter';
import axios from 'axios';
import type { Product, ProductCategory } from 'types/product';

const ESCUELA_BASE = 'https://api.escuelajs.co/api/v1';

export const escuelajsApi = axios.create({
  baseURL: ESCUELA_BASE,
  timeout: 15000,
});

export type EscuelaCategoryRaw = {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt?: string;
  updatedAt?: string;
};

export function normalizeEscuelaCategory(raw: EscuelaCategoryRaw): ProductCategory {
  return {
    id: raw.id,
    documentId: raw.slug ?? '',
    name: raw.name ?? '',
    image: raw.image,
  };
}

export async function getEscuelaCategories(): Promise<ProductCategory[]> {
  const path = '/categories';
  const { data } = await escuelajsApi.get<EscuelaCategoryRaw[]>(path);
  if (!Array.isArray(data)) return [];
  return data.map(normalizeEscuelaCategory);
}

export type GetEscuelaProductsParams = {
  offset: number;
  limit: number;
  categoryId?: number;
  title?: string;
  sortField?: 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
};

export async function getEscuelaProducts(
  params: GetEscuelaProductsParams
): Promise<{ data: Product[]; total: number }> {
  const { offset, limit, categoryId, title, sortField, sortOrder } = params;
  const query = new URLSearchParams();
  query.set('offset', String(offset));
  query.set('limit', String(limit));
  if (categoryId != null) query.set('categoryId', String(categoryId));
  if (title != null && title.trim()) query.set('title', title.trim());
  if (sortField != null) query.set('sort', sortField);
  if (sortOrder != null) query.set('order', sortOrder);
  const path = `/products?${query.toString()}`;
  const { data } = await escuelajsApi.get<EscuelaProductRaw[]>(path);
  const list = Array.isArray(data) ? data : [];
  const normalized = list.map(mapEscuelaProductToProduct);
  return { data: normalized, total: normalized.length };
}

export async function getEscuelaProductsTotal(filters?: {
  categoryId?: number;
  title?: string;
}): Promise<number> {
  const query = new URLSearchParams();
  query.set('offset', '0');
  query.set('limit', '2000');
  if (filters?.categoryId != null) query.set('categoryId', String(filters.categoryId));
  if (filters?.title?.trim()) query.set('title', filters.title.trim());
  const path = `/products?${query.toString()}`;
  const { data } = await escuelajsApi.get<EscuelaProductRaw[]>(path);
  return Array.isArray(data) ? data.length : 0;
}

export async function getEscuelaProductBySlug(slug: string): Promise<Product | null> {
  const query = new URLSearchParams();
  query.set('offset', '0');
  query.set('limit', '250');
  const path = `/products?${query.toString()}`;
  const { data } = await escuelajsApi.get<EscuelaProductRaw[]>(path);
  const list = Array.isArray(data) ? data : [];
  const found = list.find((p) => (p.slug ?? '').toLowerCase() === slug.toLowerCase());
  return found ? mapEscuelaProductToProduct(found) : null;
}
