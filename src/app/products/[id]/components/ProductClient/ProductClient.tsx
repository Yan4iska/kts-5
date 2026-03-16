'use client';

import Container from 'components/Container';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useRootStore } from 'stores';
import custom from 'styles/customStyles.module.scss';
import type { Product } from 'types/product';

import styles from '../../Product.module.scss';
import BackButton from '../BackButton/BackButton';
import Content from '../Content/Content';
import RelatedItems from '../RelatedItems';

type ProductClientProps = {
  initialProduct: Product;
  relatedProducts?: Product[];
};

const ProductClientInner = observer(function ProductClientInner({
  initialProduct,
  relatedProducts = [],
}: ProductClientProps) {
  const { productStore } = useRootStore();

  useEffect(() => {
    productStore.hydrateProduct(initialProduct);
  }, [initialProduct.documentId, productStore]);

  const product = productStore.product ?? initialProduct;

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
            rating={product.rating}
            images={product.images ?? []}
            isInStock={product.isInStock}
          />
          <RelatedItems products={relatedProducts} />
        </div>
      </div>
    </Container>
  );
});

export default function ProductClient(props: ProductClientProps) {
  return <ProductClientInner {...props} />;
}
