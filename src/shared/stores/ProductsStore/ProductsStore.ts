import { getProducts, type GetProductsParams, type SortBy } from 'config/api';
import { makeAutoObservable, runInAction } from 'mobx';
import type { Product } from 'types/product';

import { SORT_OPTIONS } from './options';

export { SORT_OPTIONS };

const DEFAULT_PAGE_SIZE = 12;

const VALID_SORT_KEYS: SortBy[] = [
  'price_asc',
  'price_desc',
  'rating_asc',
  'rating_desc',
];

function getFirst(param: string | string[] | undefined): string | undefined {
  if (param == null) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

export function getProductsParamsFromSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): GetProductsParams {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    return getFirst((params as Record<string, string | string[] | undefined>)[key]);
  };
  const search = get('search') ?? '';
  const page = Math.max(1, parseInt(get('page') ?? '1', 10) || 1);
  const pageSize = Math.max(
    1,
    Math.min(100, parseInt(get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const inStockOnly = get('inStock') === 'true';
  const sortByParam = get('sortBy');
  const sortBy: SortBy[] = sortByParam
    ? sortByParam
        .split(',')
        .map((s) => s.trim() as SortBy)
        .filter((key) => VALID_SORT_KEYS.includes(key))
    : [];
  const categoryIdsParam = get('categoryIds');
  const categoryIds = categoryIdsParam
    ? categoryIdsParam
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n))
    : [];
  return {
    page,
    pageSize,
    search: search || undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    inStockOnly: inStockOnly || undefined,
    sortBy: sortBy.length > 0 ? sortBy : undefined,
  };
}

export type ProductsInitialData = {
  products: Product[];
  total: number;
  pageCount: number;
  page: number;
  pageSize: number;
  search: string;
  categoryIds: number[];
  inStockOnly: boolean;
  sortBy: SortBy[];
};

export class ProductsStore {
  products: Product[] = [];
  total = 0;
  pageCount = 0;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  search = '';
  categoryIds: number[] = [];
  inStockOnly = false;
  sortBy: SortBy[] = [];
  loading = false;
  error: string | null = null;
  _skipNextFetch = false;

  constructor() {
    makeAutoObservable(this, { _skipNextFetch: false });
  }

  hydrateFromServer(data: ProductsInitialData): void {
    this.products = data.products;
    this.total = data.total;
    this.pageCount = data.pageCount;
    this.page = data.page;
    this.pageSize = data.pageSize;
    this.search = data.search;
    this.categoryIds = data.categoryIds;
    this.inStockOnly = data.inStockOnly;
    this.sortBy = data.sortBy;
    this.loading = false;
    this.error = null;
    this._skipNextFetch = true;
  }

  get hasNextPage(): boolean {
    return this.page < this.pageCount;
  }

  get hasPrevPage(): boolean {
    return this.page > 1;
  }

  get sortField(): 'price' | 'rating' | null {
    const first = this.sortBy[0];
    if (!first) return null;
    if (first.startsWith('price_')) return 'price';
    if (first.startsWith('rating_')) return 'rating';
    return null;
  }

  get sortDirection(): 'asc' | 'desc' | null {
    const first = this.sortBy[0];
    if (!first) return null;
    return first.endsWith('_asc') ? 'asc' : first.endsWith('_desc') ? 'desc' : null;
  }

  setSearchQuery(value: string): void {
    this.search = value;
    this.page = 1;
    this.products = [];
  }

  setPage(value: number): void {
    this.page = value;
  }

  setPageSize(value: number): void {
    this.pageSize = value;
    this.page = 1;
    this.products = [];
  }

  setCategoryIds(ids: number[]): void {
    this.categoryIds = ids;
    this.page = 1;
    this.products = [];
  }

  setInStockOnly(value: boolean): void {
    this.inStockOnly = value;
    this.page = 1;
    this.products = [];
  }

  setSortBy(value: SortBy[]): void {
    this.sortBy = value;
    this.page = 1;
    this.products = [];
  }

  applyQueryParams(params: URLSearchParams): void {
    const search = params.get('search') ?? '';
    const pageSize = Math.max(
      1,
      Math.min(
        100,
        parseInt(params.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE
      )
    );
    const inStock = params.get('inStock') === 'true';
    const sortByParam = params.get('sortBy');
    const validSort: SortBy[] = sortByParam
      ? sortByParam
          .split(',')
          .map((s) => s.trim() as SortBy)
          .filter((key) => VALID_SORT_KEYS.includes(key))
      : [];
    const categoryIdsParam = params.get('categoryIds');
    const categoryIds = categoryIdsParam
      ? categoryIdsParam
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !Number.isNaN(n))
      : [];
    const pageFromUrl = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
    const sortChanged =
      validSort.length !== this.sortBy.length ||
      validSort.some((s, i) => this.sortBy[i] !== s);
    this.search = search;
    this.pageSize = pageSize;
    this.categoryIds = categoryIds;
    this.inStockOnly = inStock;
    this.sortBy = validSort;
    if (sortChanged) {
      this.products = [];
      this.page = 1;
    }
    if (pageFromUrl === 1 && this.products.length > this.pageSize) {
      return;
    }
    this.page = pageFromUrl;
  }

  buildQueryParams(): URLSearchParams {
    const p = new URLSearchParams();
    if (this.search) p.set('search', this.search);
    if (this.page > 1) p.set('page', String(this.page));
    if (this.pageSize !== DEFAULT_PAGE_SIZE) p.set('pageSize', String(this.pageSize));
    if (this.categoryIds.length > 0) p.set('categoryIds', this.categoryIds.join(','));
    if (this.inStockOnly) p.set('inStock', 'true');
    if (this.sortBy.length > 0) p.set('sortBy', this.sortBy.join(','));
    return p;
  }

  async fetchProducts(): Promise<void> {
    if (this._skipNextFetch) {
      this._skipNextFetch = false;
      return;
    }
    this.loading = true;
    this.error = null;
    const params: GetProductsParams = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.search || undefined,
      categoryIds:
        this.categoryIds.length > 0 ? this.categoryIds : undefined,
      inStockOnly: this.inStockOnly || undefined,
      sortBy: this.sortBy.length > 0 ? this.sortBy : undefined,
    };
    try {
      const result = await getProducts(params);
      runInAction(() => {
        this.products = result.data;
        this.total = result.total;
        this.pageCount = result.pageCount;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Ошибка загрузки товаров';
        this.loading = false;
      });
    }
  }

  async fetchNextPage(): Promise<void> {
    if (!this.hasNextPage || this.loading) return;
    const nextPage = this.page + 1;
    this.loading = true;
    this.error = null;
    const params: GetProductsParams = {
      page: nextPage,
      pageSize: this.pageSize,
      search: this.search || undefined,
      categoryIds:
        this.categoryIds.length > 0 ? this.categoryIds : undefined,
      inStockOnly: this.inStockOnly || undefined,
      sortBy: this.sortBy.length > 0 ? this.sortBy : undefined,
    };
    try {
      const result = await getProducts(params);
      runInAction(() => {
        this.products = [...this.products, ...result.data];
        this.total = result.total;
        this.pageCount = result.pageCount;
        this.page = nextPage;
        if (result.data.length < this.pageSize) {
          this.pageCount = nextPage;
        }
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Ошибка загрузки товаров';
        this.loading = false;
      });
    }
  }
}
