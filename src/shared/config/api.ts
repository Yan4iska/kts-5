import { mapOldProductToProduct, type OldProductRaw } from 'adapters/productAdapter';
import axios from 'axios';
import qs from 'qs';
import type { Product, ProductCategory, ProductResponse, ProductsResponse } from 'types/product';

function compareProducts(
  a: Product,
  b: Product,
  priceSort: 'price_asc' | 'price_desc' | undefined,
  ratingSort: 'rating_asc' | 'rating_desc' | undefined
): number {
  if (ratingSort) {
    const ra = a.rating ?? 0;
    const rb = b.rating ?? 0;
    const diff = ratingSort === 'rating_asc' ? ra - rb : rb - ra;
    if (diff !== 0) return diff;
  }
  if (priceSort) {
    const diff = priceSort === 'price_asc' ? a.price - b.price : b.price - a.price;
    return diff;
  }
  return 0;
}

function mergeSortedProducts(
  a: Product[],
  b: Product[],
  priceSort: 'price_asc' | 'price_desc' | undefined,
  ratingSort: 'rating_asc' | 'rating_desc' | undefined
): Product[] {
  if (!priceSort && !ratingSort) return [...a, ...b];
  const out: Product[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const cmp = compareProducts(a[i], b[j], priceSort, ratingSort);
    if (cmp <= 0) {
      out.push(a[i]);
      i += 1;
    } else {
      out.push(b[j]);
      j += 1;
    }
  }
  while (i < a.length) {
    out.push(a[i]);
    i += 1;
  }
  while (j < b.length) {
    out.push(b[j]);
    j += 1;
  }
  return out;
}

const STRAPI_BASE = 'https://front-school-strapi.ktsdev.ru';
const STRAPI_API_URL = `${STRAPI_BASE}/api`;

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
    delete API.defaults.headers.common['Authorization'];
  }
}

export function getAuthToken(): string | null {
  return getStoredToken();
}

if (typeof window !== 'undefined') {
  const stored = getStoredToken();
  if (stored) setAuthToken(stored);
}

export type SortBy = 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';

export type GetProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  categoryIds?: number[];
  inStockOnly?: boolean;
  sortBy?: SortBy[];
};

async function getStrapiProducts(
  params: GetProductsParams
): Promise<{ data: Product[]; total: number; pageCount: number }> {
  const {
    page = 1,
    pageSize = 12,
    search = '',
    categoryId,
    categoryIds,
    inStockOnly = false,
    sortBy: sortByParam,
  } = params;
  const sortByRaw = Array.isArray(sortByParam) ? sortByParam : sortByParam != null ? [sortByParam] : [];
  const ratingSort = sortByRaw.find((s) => s.startsWith('rating_'));
  const priceSort = sortByRaw.find((s) => s.startsWith('price_'));
  const sortBy = [ratingSort, priceSort].filter(Boolean) as SortBy[];

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

  if (sortBy.length > 0) {
    queryObj.sort = sortBy.map((s) => {
      const [field, order] = s.split('_') as [string, 'asc' | 'desc'];
      return `${field}:${order}`;
    });
  }

  const query = qs.stringify(queryObj, { encodeValuesOnly: true });
  const response = await API.get<ProductsResponse>(`/products?${query}`);
  const meta = response.data.meta;
  const rawData = response.data.data as OldProductRaw[];
  return {
    data: rawData.map(mapOldProductToProduct),
    total: meta?.pagination?.total ?? 0,
    pageCount: meta?.pagination?.pageCount ?? 0,
  };
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<{ data: Product[]; total: number; pageCount: number }> => {
  const {
    page = 1,
    pageSize = 12,
    search = '',
    categoryIds,
    inStockOnly = false,
    sortBy: sortByParam,
  } = params ?? {};
  const half = Math.max(1, Math.floor(pageSize / 2));
  const sortByRaw = Array.isArray(sortByParam) ? sortByParam : sortByParam != null ? [sortByParam] : [];
  const priceSort = sortByRaw.find((s) => s.startsWith('price_')) as 'price_asc' | 'price_desc' | undefined;
  const ratingSort = sortByRaw.find((s) => s.startsWith('rating_')) as 'rating_asc' | 'rating_desc' | undefined;
  const escuelaSortField: 'price' | 'rating' | undefined =
    priceSort != null ? 'price' : ratingSort != null ? 'rating' : undefined;
  const escuelaSortOrder: 'asc' | 'desc' | undefined =
    priceSort === 'price_asc' || ratingSort === 'rating_asc'
      ? 'asc'
      : priceSort === 'price_desc' || ratingSort === 'rating_desc'
        ? 'desc'
        : undefined;

  const strapiParams: GetProductsParams = {
    page,
    pageSize: half,
    search: search || undefined,
    categoryIds,
    categoryId: categoryIds?.[0],
    inStockOnly: inStockOnly || undefined,
    sortBy: sortByParam,
  };

  const [strapiResult, escuelaResult] = await Promise.all([
    getStrapiProducts(strapiParams).catch(() => ({ data: [] as Product[], total: 0, pageCount: 0 })),
    (async () => {
      const { getEscuelaProducts, getEscuelaProductsTotal } = await import('./escuelajs');
      const offset = (page - 1) * half;
      const categoryId = categoryIds?.[0];
      const [dataRes, total] = await Promise.all([
        getEscuelaProducts({
          offset,
          limit: half,
          categoryId,
          title: search?.trim() || undefined,
          sortField: escuelaSortField,
          sortOrder: escuelaSortOrder,
        }),
        getEscuelaProductsTotal({ categoryId, title: search?.trim() || undefined }),
      ]);
      return { data: dataRes.data, total };
    })().catch(() => ({ data: [] as Product[], total: 0 })),
  ]);

  const merged = mergeSortedProducts(
    strapiResult.data,
    escuelaResult.data,
    priceSort,
    ratingSort
  );
  const total = strapiResult.total + escuelaResult.total;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return {
    data: merged,
    total,
    pageCount,
  };
};

export const getProduct = async (documentId: string): Promise<Product> => {
  const query = qs.stringify(
    { populate: ['images', 'productCategory'] },
    { encodeValuesOnly: true }
  );

  try {
    const response = await API.get<ProductResponse>(`/products/${documentId}?${query}`);
    return mapOldProductToProduct(response.data.data as OldProductRaw);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      const { getEscuelaProductBySlug } = await import('./escuelajs');
      const escuelaProduct = await getEscuelaProductBySlug(documentId);
      if (escuelaProduct) return escuelaProduct;
    }
    throw err;
  }
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
