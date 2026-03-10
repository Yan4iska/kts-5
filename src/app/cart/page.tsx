'use client';
import Button from 'components/Button';
import Card from 'components/Card';
import Container from 'components/Container';
import Text from 'components/Text';
import { getProduct } from 'config/api';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRootStore } from 'stores';
import type { Product } from 'types/product';

import styles from './Cart.module.scss';

const Cart = observer(() => {
  const { cartStore } = useRootStore();
  const entries = cartStore.entries;
  const [productsMap, setProductsMap] = useState<Record<string, Product | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entries.length === 0) {
      setProductsMap({});
      return;
    }
    setLoading(true);
    const ids = entries.map(([id]) => id);
    Promise.allSettled(ids.map((id) => getProduct(id)))
      .then((results) => {
        const map: Record<string, Product | null> = {};
        results.forEach((result, i) => {
          const id = ids[i];
          map[id] = result.status === 'fulfilled' ? result.value : null;
        });
        setProductsMap(map);
      })
      .finally(() => setLoading(false));
  }, [entries.map(([id]) => id).join(',')]);

  return (
    <Container size="default">
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Cart
        </Text>
        {entries.length === 0 ? (
          <Text tag="p" view="p-20" color="secondary">
            Your cart is empty.{' '}
            <Link href="/products" className={styles.emptyCartLink}>
              Browse products
            </Link>
            .
          </Text>
        ) : loading && Object.keys(productsMap).length === 0 ? (
          <Text tag="p" view="p-20" color="secondary">
            Loading cart...
          </Text>
        ) : (
          <ul className={styles.list}>
            {entries.map(([documentId, quantity]) => {
              const product = productsMap[documentId];
              if (product == null) {
                return (
                  <li key={documentId} className={styles.item}>
                    <Text view="p-16" color="secondary">
                      Loading product...
                    </Text>
                  </li>
                );
              }
              const firstImage = product.images?.[0];
              const imageUrl =
                firstImage?.url ||
                firstImage?.formats?.medium?.url ||
                firstImage?.formats?.small?.url ||
                firstImage?.formats?.thumbnail?.url ||
                'https://placehold.co/360x360';
              const oldPrice = product.discountPercent
                ? Math.round(product.price * (1 + product.discountPercent / 100))
                : null;

              return (
                <li key={documentId} className={styles.cardItem}>
                  <Link href={`/products/${documentId}`} className={styles.cardLink}>
                    <Card
                      className={styles.card}
                      image={imageUrl}
                      title={product.title}
                      subtitle={product.description || ' '}
                      contentSlot={
                        <div className={styles.priceWrapper}>
                          <span className={styles.price}>${product.price}</span>
                          {oldPrice != null && <span className={styles.oldPrice}>${oldPrice}</span>}
                        </div>
                      }
                      actionSlot={
                        <div className={styles.footerActions}>
                          <div
                            className={styles.quantityBlock}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Button
                              className={styles.qtyBtn}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                cartStore.decrease(documentId, product.id);
                              }}
                            >
                              –
                            </Button>
                            <Text tag="span" view="p-18" className={styles.qtyValue}>
                              {quantity}
                            </Text>
                            <Button
                              className={styles.qtyBtn}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                cartStore.add(documentId, product.id);
                              }}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              cartStore.removeItem(documentId, product.id);
                            }}
                            className={styles.removeBtn}
                          >
                            Remove
                          </Button>
                        </div>
                      }
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
});

export default Cart;
