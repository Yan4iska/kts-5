import { makeAutoObservable } from 'mobx';

const DISCOUNT_STORAGE_KEY = 'lalasia_discount';

export class DiscountStore {
  discountPercent: number | null = null;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(DISCOUNT_STORAGE_KEY);
        if (raw != null) {
          const n = parseInt(raw, 10);
          if (Number.isFinite(n) && n >= 5 && n <= 99) this.discountPercent = n;
        }
      } catch {}
    }
  }

  get hasDiscount(): boolean {
    return this.discountPercent != null;
  }

  setDiscount(percent: number): void {
    this.discountPercent = percent;
    try {
      localStorage.setItem(DISCOUNT_STORAGE_KEY, String(percent));
    } catch {}
  }

  clearDiscount(): void {
    this.discountPercent = null;
    try {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    } catch {}
  }
}
