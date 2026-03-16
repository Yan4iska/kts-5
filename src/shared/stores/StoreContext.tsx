'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { RootStore, rootStore } from './RootStore';
import type { ProductCategory } from 'types/product';

const StoreContext = createContext<RootStore | null>(null);

function CartStoreInitializer() {
  const store = useContext(StoreContext);
  useEffect(() => {
    if (store) store.cartStore.fetchCart();
  }, [store]);
  return null;
}

type StoreProviderProps = {
  children: ReactNode;
  initialCategories?: ProductCategory[];
};

export function StoreProvider({ children, initialCategories }: StoreProviderProps) {
  const [store] = useState<RootStore>(() =>
    initialCategories !== undefined ? new RootStore(initialCategories) : rootStore
  );
  return (
    <StoreContext.Provider value={store}>
      <CartStoreInitializer />
      {children}
    </StoreContext.Provider>
  );
}

export function useRootStore(): RootStore {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useRootStore must be used within StoreProvider');
  return store;
}
