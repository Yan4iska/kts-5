import {
  addCartItem,
  getAuthToken,
  getCart,
  removeCartItem,
  type CartItemEntry,
} from 'config/api';
import { makeAutoObservable, runInAction } from 'mobx';

export class CartStore {
  items = new Map<string, number>();
  loading = false;
  syncing = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { deep: false });
    this.fetchCart();
  }

  get totalItemCount(): number {
    return Array.from(this.items.values()).reduce((sum, qty) => sum + qty, 0);
  }

  get entries(): [string, number][] {
    return Array.from(this.items.entries());
  }

  get count(): number {
    return this.totalItemCount;
  }

  async fetchCart(): Promise<void> {
    if (this.loading) return;
    if (!getAuthToken()) {
      runInAction(() => {
        this.items = new Map();
        this.error = null;
      });
      return;
    }
    this.loading = true;
    this.error = null;
    try {
      const entries = await getCart();
      runInAction(() => {
        this.items = this._entriesToMap(entries);
        this.items = new Map(this.items);
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load cart';
        this.loading = false;
      });
    }
  }

  getItemQuantity(documentId: string): number {
    return this.items.get(documentId) ?? 0;
  }

  hasItem(documentId: string): boolean {
    return (this.items.get(documentId) ?? 0) > 0;
  }

  addItem(documentId: string, productId: number, quantity = 1): void {
    runInAction(() => {
      const prev = this.items.get(documentId) ?? 0;
      this.items = new Map(this.items);
      this.items.set(documentId, prev + quantity);
    });
    this.syncing = true;
    this.error = null;
    addCartItem(productId, quantity)
      .catch((err) => {
        runInAction(() => {
          this.error = err instanceof Error ? err.message : 'Failed to add to cart';
          this.fetchCart();
        });
      })
      .finally(() => runInAction(() => { this.syncing = false; }));
  }

  decreaseItemQuantity(documentId: string, productId: number, quantity = 1): void {
    const prev = this.items.get(documentId) ?? 0;
    const toRemove = Math.min(quantity, prev);
    if (toRemove <= 0) return;
    runInAction(() => {
      this.items = new Map(this.items);
      const next = prev - toRemove;
      if (next <= 0) this.items.delete(documentId);
      else this.items.set(documentId, next);
    });
    this.syncing = true;
    this.error = null;
    removeCartItem(productId, toRemove).catch((err) => {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to update cart';
        this.fetchCart();
      });
    }).finally(() => runInAction(() => { this.syncing = false; }));
  }

  removeItem(documentId: string, productId: number): void {
    const qty = this.items.get(documentId) ?? 0;
    if (qty <= 0) return;
    runInAction(() => {
      this.items = new Map(this.items);
      this.items.delete(documentId);
    });
    this.syncing = true;
    this.error = null;
    removeCartItem(productId, qty).catch((err) => {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to remove from cart';
        this.fetchCart();
      });
    }).finally(() => runInAction(() => { this.syncing = false; }));
  }

  toggleItem(documentId: string, productId: number): void {
    if (this.hasItem(documentId)) this.removeItem(documentId, productId);
    else this.addItem(documentId, productId, 1);
  }

  getQuantity(documentId: string): number {
    return this.getItemQuantity(documentId);
  }

  has(documentId: string): boolean {
    return this.hasItem(documentId);
  }

  add(documentId: string, productId: number, quantity = 1): void {
    this.addItem(documentId, productId, quantity);
  }

  decrease(documentId: string, productId: number, quantity = 1): void {
    this.decreaseItemQuantity(documentId, productId, quantity);
  }

  toggle(documentId: string, productId: number): void {
    this.toggleItem(documentId, productId);
  }

  clear(): void {
    runInAction(() => {
      this.items = new Map();
      this.error = null;
    });
  }

  private _entriesToMap(entries: CartItemEntry[]): Map<string, number> {
    const map = new Map<string, number>();
    for (const e of entries) {
      if (e.quantity > 0) map.set(e.productDocumentId, e.quantity);
    }
    return map;
  }
}
