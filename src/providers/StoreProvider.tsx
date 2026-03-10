'use client';

import { configure } from 'mobx';
import { type ReactNode } from 'react';
import { StoreProvider as MobXStoreProvider } from '@/shared/stores/StoreContext';

configure({
  useProxies: 'ifavailable',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

/**
 * Client-only provider for MobX stores.
 * Wrap the part of the tree that uses stores (e.g. in app/layout.tsx).
 * Observer components remain client-side and must be used inside this provider.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  return <MobXStoreProvider>{children}</MobXStoreProvider>;
}
