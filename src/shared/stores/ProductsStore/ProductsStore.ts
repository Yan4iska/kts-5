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

export class ProductsStore {
  products: Product[] = [];
  total = 0;
  pageCount = 0;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  search = '';
  categoryIds: number[] = [];
  inStockOnly = false;
  sortBy: SortBy | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get hasNextPage(): boolean {
    return this.page < this.pageCount;
  }

  get hasPrevPage(): boolean {
    return this.page > 1;
  }

  setSearchQuery(value: string): void {
    this.search = value;
    this.page = 1;
  }

  setPage(value: number): void {
    this.page = value;
  }

  setPageSize(value: number): void {
    this.pageSize = value;
    this.page = 1;
  }

  setCategoryIds(ids: number[]): void {
    this.categoryIds = ids;
    this.page = 1;
  }

  setInStockOnly(value: boolean): void {
    this.inStockOnly = value;
    this.page = 1;
  }

  setSortBy(value: SortBy | null): void {
    this.sortBy = value;
    this.page = 1;
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
    const sortBy = params.get('sortBy') as SortBy | null;
    const validSort =
      sortBy && VALID_SORT_KEYS.includes(sortBy) ? sortBy : null;
    const categoryIdsParam = params.get('categoryIds');
    const categoryIds = categoryIdsParam
      ? categoryIdsParam
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !Number.isNaN(n))
      : [];
    this.search = search;
    this.page = 1;
    this.pageSize = pageSize;
    this.categoryIds = categoryIds;
    this.inStockOnly = inStock;
    this.sortBy = validSort;
  }

  buildQueryParams(): URLSearchParams {
    const p = new URLSearchParams();
    if (this.search) p.set('search', this.search);
    if (this.page > 1) p.set('page', String(this.page));
    if (this.pageSize !== DEFAULT_PAGE_SIZE) p.set('pageSize', String(this.pageSize));
    if (this.categoryIds.length > 0) p.set('categoryIds', this.categoryIds.join(','));
    if (this.inStockOnly) p.set('inStock', 'true');
    if (this.sortBy) p.set('sortBy', this.sortBy);
    return p;
  }

  async fetchProducts(): Promise<void> {
    this.loading = true;
    this.error = null;
    const params: GetProductsParams = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.search || undefined,
      categoryIds:
        this.categoryIds.length > 0 ? this.categoryIds : undefined,
      inStockOnly: this.inStockOnly || undefined,
      sortBy: this.sortBy ?? undefined,
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
      sortBy: this.sortBy ?? undefined,
    };
    try {
      const result = await getProducts(params);
      runInAction(() => {
        this.products = [...this.products, ...result.data];
        this.total = result.total;
        this.pageCount = result.pageCount;
        this.page = nextPage;
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
