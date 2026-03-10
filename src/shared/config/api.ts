import axios from 'axios';
import qs from 'qs';
import type { Product, ProductCategory, ProductResponse, ProductsResponse } from 'types/product';

const STRAPI_BASE = 'https://front-school-strapi.ktsdev.ru';
const STRAPI_API_URL = `${STRAPI_BASE}/api`;

const STRAPI_API_TOKEN: string | undefined =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_STRAPI_API_TOKEN : undefined;

export const API = axios.create({
  baseURL: STRAPI_API_URL,
});

export const AUTH_STORAGE_KEY = 'strapi_auth';

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { jwt?: string };
    return data.jwt ?? null;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    if (STRAPI_API_TOKEN) {
      API.defaults.headers.common['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  }
}

export function getAuthToken(): string | null {
  return getStoredToken();
}

if (typeof window !== 'undefined') {
  const stored = getStoredToken();
  if (stored) setAuthToken(stored);
  else if (STRAPI_API_TOKEN) {
    API.defaults.headers.common['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }
}

export type SortBy = 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';

export type GetProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  categoryIds?: number[];
  inStockOnly?: boolean;
  sortBy?: SortBy;
};

export const getProducts = async (
  params?: GetProductsParams
): Promise<{ data: Product[]; total: number; pageCount: number }> => {
  const {
    page = 1,
    pageSize = 12,
    search = '',
    categoryId,
    categoryIds,
    inStockOnly = false,
    sortBy,
  } = params ?? {};

  const queryObj: Record<string, unknown> = {
    populate: ['images', 'productCategory'],
    pagination: { page, pageSize },
  };

  const filters: Record<string, unknown> = {};
  if (search.trim()) {
    filters.title = { $containsi: search.trim() };
  }
  if (categoryIds != null && categoryIds.length > 0) {
    filters.productCategory = { id: { $in: categoryIds } };
  } else if (categoryId != null) {
    filters.productCategory = { id: { $eq: categoryId } };
  }
  if (inStockOnly) {
    filters.isInStock = { $eq: true };
  }
  if (Object.keys(filters).length > 0) {
    queryObj.filters = filters;
  }

  if (sortBy) {
    const [field, order] = sortBy.split('_') as [string, 'asc' | 'desc'];
    queryObj.sort = [`${field}:${order}`];
  }

  const query = qs.stringify(queryObj, { encodeValuesOnly: true });
  const response = await API.get<ProductsResponse>(`/products?${query}`);
  const meta = response.data.meta;
  return {
    data: response.data.data,
    total: meta?.pagination?.total ?? 0,
    pageCount: meta?.pagination?.pageCount ?? 0,
  };
};

export const getProduct = async (documentId: string): Promise<Product> => {
  const query = qs.stringify(
    { populate: ['images', 'productCategory'] },
    { encodeValuesOnly: true }
  );

  const response = await API.get<ProductResponse>(`/products/${documentId}?${query}`);

  return response.data.data;
};

type ProductCategoryRaw = {
  id: number;
  documentId?: string;
  name?: string;
  title?: string;
  attributes?: { name?: string };
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const query = qs.stringify({ 'pagination[pageSize]': 100 }, { encodeValuesOnly: true });
  const response = await API.get<{ data: ProductCategoryRaw[] }>(`/product-categories?${query}`);
  const data = response.data?.data;
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id,
    documentId: item.documentId ?? '',
    name: item.title ?? item.name ?? item.attributes?.name ?? '',
  }));
};

export type CartItemEntry = { productDocumentId: string; quantity: number };

type CartItemRaw = {
  product?: number;
  productDocumentId?: string;
  quantity: number;
};

export type CartResponse = {
  data?: {
    items?: CartItemRaw[];
  };
};

export const getCart = async (): Promise<CartItemEntry[]> => {
  try {
    const response = await API.get<CartResponse>('/cart');
    const raw = response.data?.data?.items;
    if (!Array.isArray(raw)) return [];
    const result: CartItemEntry[] = [];
    for (const e of raw) {
      const qty = typeof e?.quantity === 'number' && e.quantity > 0 ? e.quantity : 0;
      if (qty === 0) continue;
      const documentId = e.productDocumentId ?? (e.product != null ? String(e.product) : '');
      if (documentId) result.push({ productDocumentId: documentId, quantity: qty });
    }
    return result;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404 || err.response?.status === 403) {
        return [];
      }
    }
    throw err;
  }
};

export const addCartItem = async (productId: number, quantity = 1): Promise<void> => {
  await API.post('/cart/add', { product: productId, quantity });
};

export const removeCartItem = async (productId: number, quantity = 1): Promise<void> => {
  await API.post('/cart/remove', { product: productId, quantity });
};

export type StrapiUser = {
  id: number;
  username: string;
  email: string;
  [key: string]: unknown;
};

export type AuthResponse = { user: StrapiUser; jwt: string };

export const login = async (identifier: string, password: string): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>('/auth/local', {
    identifier,
    password,
  });
  return data;
};

/** POST /auth/local/register – регистрация. */
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>('/auth/local/register', {
    username,
    email,
    password,
  });
  return data;
};
