'use client';

import Button from 'components/Button';
import Card from 'components/Card';
import Checkout, { type LineItem } from 'components/Checkout';
import Container from 'components/Container';
import Text from 'components/Text';
import { getProduct } from 'config/api';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRootStore } from 'stores';
import type { Product } from 'types/product';
import type { OrderItem } from 'types/order';

import styles from './Cart.module.scss';

const Cart = observer(() => {
  const router = useRouter();
  const { cartStore, discountStore, authStore, orderStore } = useRootStore();
  const entries = cartStore.entries;
  const [productsMap, setProductsMap] = useState<Record<string, Product | null>>({});
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <>
            {mounted && discountStore.hasDiscount && (
              <div className={styles.discountBanner}>
                <Text view="p-18" color="secondary">
                  Your discount: <strong>{discountStore.discountPercent}%</strong>{' '}
                  <Link href="/shares" className={styles.sharesLink}>
                    (open another case)
                  </Link>
                </Text>
              </div>
            )}
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
            {(() => {
              const itemsWithProduct = entries
                .map(([documentId, quantity]) => {
                  const product = productsMap[documentId];
                  if (!product) return null;
                  return {
                    documentId,
                    productId: product.id,
                    quantity,
                    price: product.price,
                  };
                })
                .filter((x): x is LineItem => x != null);
              const subtotal = itemsWithProduct.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              );
              const discountPercent = mounted ? (discountStore.discountPercent ?? 0) : 0;
              const total =
                discountPercent > 0
                  ? subtotal * (1 - discountPercent / 100)
                  : subtotal;
              const totalLabel =
                discountPercent > 0
                  ? `Subtotal: $${subtotal.toFixed(2)} → Total with ${discountPercent}% off: $${total.toFixed(2)}`
                  : `Total: $${total.toFixed(2)}`;

              return (
                <div className={styles.checkoutSection}>
                  <div className={styles.totalRow}>
                    <Text view="p-20" weight="bold">
                      {totalLabel}
                    </Text>
                  </div>
                  {!showCheckout ? (
                    <Button
                      className={styles.checkoutBtn}
                      onClick={() => setShowCheckout(true)}
                    >
                      Proceed to checkout
                    </Button>
                  ) : (
                    <Checkout
                      lineItems={itemsWithProduct}
                      discountPercent={mounted ? discountStore.discountPercent : null}
                      totalLabel={totalLabel}
                      onSuccess={async () => {
                        const discountPct = discountStore.discountPercent ?? 0;
                        const totalCents = Math.round(total * 100);
                        const orderItems: OrderItem[] = itemsWithProduct.map(
                          ({ documentId, productId, quantity, price }) => {
                            const p = productsMap[documentId];
                            const img = p?.images?.[0];
                            const imageUrl =
                              img?.url ||
                              img?.formats?.medium?.url ||
                              img?.formats?.small?.url ||
                              img?.formats?.thumbnail?.url ||
                              'https://placehold.co/360x360';
                            return {
                              documentId,
                              productId,
                              quantity,
                              price,
                              title: p?.title ?? '',
                              imageUrl,
                            };
                          }
                        );
                        if (authStore.user) {
                          await orderStore.createOrder({
                            userId: authStore.user.id,
                            items: orderItems,
                            discountPercent: discountPct > 0 ? discountPct : null,
                            totalCents,
                          });
                        }
                        cartStore.clear();
                        discountStore.clearDiscount();
                        router.push('/account?success=1');
                      }}
                      onCancel={() => setShowCheckout(false)}
                    />
                  )}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </Container>
  );
});

export default Cart;
