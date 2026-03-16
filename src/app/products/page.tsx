import Container from 'components/Container';
import { getProducts } from 'config/api';
import { getProductsParamsFromSearchParams } from 'stores/ProductsStore/ProductsStore';
import { Suspense } from 'react';

import ProductsClient from './components/ProductsClient';
import styles from './Products.module.scss';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);
  const getParams = getProductsParamsFromSearchParams(params);
  const { data: products, total, pageCount } = await getProducts(getParams);

  const initialData = {
    products,
    total,
    pageCount,
    page: getParams.page ?? 1,
    pageSize: getParams.pageSize ?? 12,
    search: getParams.search ?? '',
    categoryIds: getParams.categoryIds ?? [],
    inStockOnly: getParams.inStockOnly ?? false,
    sortBy: getParams.sortBy ?? [],
  };

  return (
    <Suspense
      fallback={
        <Container>
          <div className={styles.content}>Loading...</div>
        </Container>
      }
    >
      <ProductsClient initialData={initialData} />
    </Suspense>
  );
}
