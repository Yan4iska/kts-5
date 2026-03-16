'use client';

import Container from 'components/Container';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRootStore } from 'stores';
import type { ProductsInitialData } from 'stores/ProductsStore/ProductsStore';

import styles from '../../Products.module.scss';
import ProductsHeader from '../ProductsHeader/ProductsHeader';
import ProductsList from '../ProductsList';

type ProductsClientProps = {
  initialData: ProductsInitialData;
};

const ProductsClientInner = observer(({ initialData }: ProductsClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { productsStore } = useRootStore();
  const { search, pageSize, categoryIds, inStockOnly, sortBy } = productsStore;

  useEffect(() => {
    productsStore.hydrateFromServer(initialData);
  }, []);

  useEffect(() => {
    productsStore.applyQueryParams(searchParams);
  }, [searchParams, productsStore]);

  useEffect(() => {
    const next = productsStore.buildQueryParams();
    const nextStr = next.toString();
    if (searchParams.toString() !== nextStr) {
      router.replace(nextStr ? `${pathname}?${nextStr}` : pathname, { scroll: false });
    }
    if (productsStore.products.length <= productsStore.pageSize) {
      productsStore.fetchProducts();
    }
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

export default function ProductsClient(props: ProductsClientProps) {
  return <ProductsClientInner {...props} />;
}
