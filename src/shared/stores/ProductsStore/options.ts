import type { SortBy } from 'config/api';

export const SORT_OPTIONS: { key: SortBy; value: string }[] = [
  { key: 'price_desc', value: 'Price higher' },
  { key: 'price_asc', value: 'Price lower' },
  { key: 'rating_desc', value: 'Rating higher' },
  { key: 'rating_asc', value: 'Rating lower' },
];
