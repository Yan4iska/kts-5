import Button from 'components/Button';
import Card from 'components/Card';
import EmptyStub from 'components/EmptyStub';
import Loader from 'components/Loader';
import Text from 'components/Text';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRootStore } from 'stores';

import ProductCardSkeleton from './ProductCardSkeleton';
import styles from './ProductsList.module.scss';

export default observer(function ProductsList() {
  const { authStore, productsStore, cartStore } = useRootStore();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = authStore.isAuthenticated;

  const requireAuthForCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };
  const { products, loading, error, total, hasNextPage } = productsStore;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasNextPage || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !productsStore.loading) {
          productsStore.fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, loading, productsStore]);

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <Text tag="h1" view="title" className={styles.totalCount}>
        Total: {total} product{total !== 1 ? 's' : ''}
      </Text>

      {loading && products.length === 0 ? (
        <div className={styles.grid}>
          {Array.from({ length: productsStore.pageSize }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : !loading && products.length === 0 ? (
        <EmptyStub
          title="No products"
          description="There are no products for current filters."
          actionSlot={
            productsStore.search || productsStore.inStockOnly || productsStore.sortBy ? (
              <Button
                onClick={() => {
                  productsStore.setSearchQuery('');
                  productsStore.setInStockOnly(false);
                  productsStore.setSortBy(null);
                  productsStore.setPage(1);
                }}
              >
                Reset filters
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => {
              const documentId = product.documentId;
              const productId = product.id;
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
              const quantity = cartStore.getQuantity(documentId);

              return (
                <Link key={documentId} href={`/products/${documentId}`} className={styles.cardLink}>
                  <Card
                    className={styles.card}
                    image={imageUrl}
                    title={product.title}
                    subtitle={product.description || ' '}
                    contentSlot={
                      <div className={styles.priceWrapper}>
                        <span className={styles.price}>${product.price}</span>
                        {oldPrice && <span className={styles.oldPrice}>${oldPrice}</span>}
                      </div>
                    }
                    actionSlot={
                      quantity === 0 ? (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (requireAuthForCart()) return;
                            cartStore.add(documentId, productId);
                          }}
                        >
                          Add to cart
                        </Button>
                      ) : (
                        <div
                          className={styles.quantityBlock}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (requireAuthForCart()) return;
                              cartStore.decrease(documentId, productId);
                            }}
                          >
                            –
                          </Button>
                          <span className={styles.qtyValue}>{quantity}</span>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (requireAuthForCart()) return;
                              cartStore.add(documentId, productId);
                            }}
                          >
                            +
                          </Button>
                        </div>
                      )
                    }
                  />
                </Link>
              );
            })}
          </div>

          {hasNextPage && (
            <div ref={loaderRef} className={styles.loadMoreSentinel}>
              {loading ? <Loader size="m" /> : null}
            </div>
          )}
        </>
      )}
    </>
  );
});
