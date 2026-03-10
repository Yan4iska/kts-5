import { getProduct } from 'config/api';
import { makeObservable, observable, action, runInAction } from 'mobx';
import type { Product } from 'types/product';

export class ProductStore {
  product: Product | null = null;
  productLoading = false;
  productError: string | null = null;

  constructor() {
    makeObservable(this, {
      product: observable,
      productLoading: observable,
      productError: observable,
      fetchProduct: action,
    });
  }

  async fetchProduct(documentId: string | undefined): Promise<void> {
    if (!documentId) {
      runInAction(() => {
        this._clearProduct();
      });
      return;
    }

    this.productLoading = true;
    this.productError = null;
    this.product = null;

    try {
      const data = await getProduct(documentId);
      runInAction(() => {
        this.product = data;
        this.productLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.productError = err instanceof Error ? err.message : 'Item not found.';
        this.productLoading = false;
      });
    }
  }

  private _clearProduct(): void {
    this.product = null;
    this.productLoading = false;
    this.productError = null;
  }
}
