'use client';
import Container from 'components/Container';
import Loader from 'components/Loader';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useRootStore } from 'stores';
import custom from 'styles/customStyles.module.scss';

import styles from './Product.module.scss';
import BackButton from './components/BackButton/BackButton';
import Content from './components/Content/Content';

const Product = observer(function Product() {
  const params = useParams<{ id: string }>();
  const documentId = params?.id ?? '';
  const { productStore } = useRootStore();
  const { product, productLoading, productError } = productStore;

  useEffect(() => {
    if (documentId) productStore.fetchProduct(documentId);
  }, [documentId, productStore]);

  if (productLoading) {
    return (
      <div className={custom.page}>
        <div className={custom.loaderWrapper}>
          <Loader />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    notFound();
  }

  return (
    <Container size="default">
      <div className={custom.page}>
        <div className={styles.content}>
          <div className={styles.backButtonWrapper}>
            <BackButton />
          </div>
          <Content
            documentId={product.documentId}
            productId={product.id}
            title={product.title}
            description={product.description || 'none description'}
            price={product.price}
            discountPercent={product.discountPercent}
            images={product.images ?? []}
            isInStock={product.isInStock}
          />
        </div>
      </div>
    </Container>
  );
});

export default Product;
