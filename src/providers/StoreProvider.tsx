'use client';

import { configure } from 'mobx';
import { type ReactNode } from 'react';
import { StoreProvider as MobXStoreProvider } from '@/shared/stores/StoreContext';
import type { ProductCategory } from 'types/product';

configure({
  useProxies: 'ifavailable',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

type StoreProviderProps = {
  children: ReactNode;
  initialCategories?: ProductCategory[];
};

export function StoreProvider({ children, initialCategories }: StoreProviderProps) {
  return <MobXStoreProvider initialCategories={initialCategories}>{children}</MobXStoreProvider>;
}
