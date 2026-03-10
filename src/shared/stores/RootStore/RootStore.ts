import { AuthStore } from '../AuthStore';
import { CartStore } from '../CartStore';
import { ProductStore } from '../ProductStore';
import { ProductsStore } from '../ProductsStore';

export class RootStore {
  authStore: AuthStore;
  productsStore: ProductsStore;
  cartStore: CartStore;
  productStore: ProductStore;

  constructor() {
    this.authStore = new AuthStore();
    this.productsStore = new ProductsStore();
    this.cartStore = new CartStore();
    this.productStore = new ProductStore();
  }
}

export const rootStore = new RootStore();
