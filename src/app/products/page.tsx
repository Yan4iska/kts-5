'use client';
import Container from 'components/Container';
import { observer } from 'mobx-react-lite';
import { Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRootStore } from 'stores';

import styles from './Products.module.scss';
import ProductsHeader from './components/ProductsHeader/ProductsHeader';
import ProductsList from './components/ProductsList';

const ProductsContent = observer(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { productsStore } = useRootStore();
  const { search, pageSize, categoryIds, inStockOnly, sortBy } = productsStore;

  useEffect(() => {
    productsStore.applyQueryParams(searchParams);
  }, [searchParams, productsStore]);

  useEffect(() => {
    const next = productsStore.buildQueryParams();
    const nextStr = next.toString();
    if (searchParams.toString() !== nextStr) {
      router.replace(nextStr ? `${pathname}?${nextStr}` : pathname, { scroll: false });
    }
    productsStore.fetchProducts();
  }, [search, pageSize, categoryIds, inStockOnly, sortBy, pathname, router, productsStore]);

  return (
    <Container>
      <div className={styles.content}>
        <ProductsHeader />
        <ProductsList />
      </div>
    </Container>
  );
});

export default function Products() {
  return (
    <Suspense fallback={<Container><div className={styles.content}>Loading...</div></Container>}>
      <ProductsContent />
    </Suspense>
  );
}
