import { AuthStore } from '../AuthStore';
import { CartStore } from '../CartStore';
import { CategoriesStore } from '../CategoriesStore';
import { DiscountStore } from '../DiscountStore';
import { OrderStore } from '../OrderStore';
import { ProductStore } from '../ProductStore';
import { ProductsStore } from '../ProductsStore';
import type { ProductCategory } from 'types/product';

export class RootStore {
  authStore: AuthStore;
  productsStore: ProductsStore;
  cartStore: CartStore;
  productStore: ProductStore;
  categoriesStore: CategoriesStore;
  discountStore: DiscountStore;
  orderStore: OrderStore;

  constructor(initialCategories: ProductCategory[] = []) {
    this.authStore = new AuthStore();
    this.productsStore = new ProductsStore();
    this.cartStore = new CartStore();
    this.productStore = new ProductStore();
    this.categoriesStore = new CategoriesStore(initialCategories);
    this.discountStore = new DiscountStore();
    this.orderStore = new OrderStore();
  }
}

export const rootStore = new RootStore();
