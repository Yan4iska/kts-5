import { makeAutoObservable } from 'mobx';
import type { ProductCategory } from 'types/product';

export class CategoriesStore {
  categories: ProductCategory[] = [];

  constructor(initialCategories: ProductCategory[] = []) {
    makeAutoObservable(this);
    this.categories = initialCategories;
  }

  setCategories(categories: ProductCategory[]): void {
    this.categories = categories;
  }
}
