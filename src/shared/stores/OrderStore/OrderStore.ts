import { makeAutoObservable, runInAction } from 'mobx';
import type { Order, CreateOrderPayload } from 'types/order';

export class OrderStore {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { deep: false });
  }

  get orderCount(): number {
    return this.orders.length;
  }

  async fetchOrders(userId: number): Promise<void> {
    if (!Number.isFinite(userId)) {
      runInAction(() => {
        this.orders = [];
        this.error = null;
      });
      return;
    }
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (!res.ok) {
        runInAction(() => {
          this.orders = [];
          this.error = (data.error as string) ?? 'Failed to load orders';
          this.loading = false;
        });
        return;
      }
      runInAction(() => {
        this.orders = Array.isArray(data.orders) ? data.orders : [];
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.orders = [];
        this.error = err instanceof Error ? err.message : 'Failed to load orders';
        this.loading = false;
      });
    }
  }

  async createOrder(payload: CreateOrderPayload): Promise<Order | null> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        runInAction(() => {
          this.error = (data.error as string) ?? 'Failed to create order';
        });
        return null;
      }
      const order = data.order as Order;
      if (order && order.userId === payload.userId) {
        runInAction(() => {
          this.orders = [order, ...this.orders];
          this.error = null;
        });
        return order;
      }
      return order ?? null;
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to create order';
      });
      return null;
    }
  }

  clearError(): void {
    this.error = null;
  }
}
