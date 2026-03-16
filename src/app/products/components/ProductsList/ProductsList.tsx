import Button from 'components/Button';
import Card from 'components/Card';
import EmptyStub from 'components/EmptyStub';
import StarIcon from 'components/icons/StarIcon';
import Loader from 'components/Loader';
import Text from 'components/Text';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
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

  const loadMore = useCallback(() => {
    if (!hasNextPage || productsStore.loading) return;
    productsStore.fetchNextPage();
  }, [hasNextPage, productsStore]);

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
            productsStore.search || productsStore.inStockOnly || productsStore.sortBy.length > 0 ? (
              <Button
                onClick={() => {
                  productsStore.setSearchQuery('');
                  productsStore.setInStockOnly(false);
                  productsStore.setSortBy([]);
                  productsStore.setPage(1);
                }}
              >
                Reset filters
              </Button>
            ) : null
          }
        />
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasNextPage}
          loader={
            <div className={styles.loadMoreSentinel}>
              <Loader size="m" />
            </div>
          }
          endMessage={
            products.length > 0 ? (
              <p className={styles.endMessage}>You have seen all {total} products.</p>
            ) : null
          }
        >
          <div className={styles.grid}>
            {products.map((product, index) => {
              const documentId = product.documentId;
              const productId = product.id;
              const listKey = `${documentId ?? `product-${productId}`}-${index}`;
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
                <motion.div
                  key={listKey}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.5) }}
                  className={styles.cardMotion}
                >
                  <Link href={`/products/${documentId}`} className={styles.cardLink}>
                    <Card
                      className={styles.card}
                      image={imageUrl}
                      title={product.title}
                      subtitle={product.description || ' '}
                      contentSlot={
                        <div className={styles.cardContent}>
                          <div className={styles.priceWrapper}>
                            <span className={styles.price}>${product.price}</span>
                            {oldPrice && <span className={styles.oldPrice}>${oldPrice}</span>}
                          </div>
                          {product.rating != null && (
                            <div className={styles.ratingRow}>
                              <StarIcon className={styles.ratingIcon} color="secondary" />
                              <Text view="p-16" color="secondary">
                                {product.rating}
                              </Text>
                            </div>
                          )}
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
                              toast.success('Added to cart');
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
                                toast.info('Quantity decreased');
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
                                toast.success('Quantity increased');
                              }}
                            >
                              +
                            </Button>
                          </div>
                        )
                      }
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
});
