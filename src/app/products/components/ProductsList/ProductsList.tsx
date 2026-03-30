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
import clsx from 'clsx';
import { forwardRef, useCallback } from 'react';
import type { ContextProp, GridComponents, GridItemProps, GridListProps } from 'react-virtuoso';
import { VirtuosoGrid } from 'react-virtuoso';
import { toast } from 'react-toastify';
import { useRootStore } from 'stores';
import type { Product } from 'types/product';

import ProductCardSkeleton from './ProductCardSkeleton';
import styles from './ProductsList.module.scss';

type ProductsGridContext = {
  hasNextPage: boolean;
  loading: boolean;
  total: number;
  productsCount: number;
};

const GridList = forwardRef<HTMLDivElement, GridListProps & ContextProp<ProductsGridContext>>(
  function GridList({ style, className, children, context: _ctx, ...props }, ref) {
    return (
      <div ref={ref} {...props} className={clsx(styles.grid, className)} style={style}>
        {children}
      </div>
    );
  }
);

const GridItem = forwardRef<HTMLDivElement, GridItemProps & ContextProp<ProductsGridContext>>(
  function GridItem({ children, className, context: _ctx, ...props }, ref) {
    return (
      <div ref={ref} {...props} className={clsx(styles.gridItem, className)}>
        {children}
      </div>
    );
  }
);

function ProductsGridFooter({ context }: ContextProp<ProductsGridContext>) {
  if (!context) return null;
  const { hasNextPage, loading, total, productsCount } = context;
  return (
    <>
      {hasNextPage && loading ? (
        <div className={styles.loadMoreSentinel}>
          <Loader size="m" />
        </div>
      ) : null}
      {!hasNextPage && productsCount > 0 ? (
        <p className={styles.endMessage}>You have seen all {total} products.</p>
      ) : null}
    </>
  );
}

const gridComponents: GridComponents<ProductsGridContext> = {
  List: GridList,
  Item: GridItem,
  Footer: ProductsGridFooter,
};

export default observer(function ProductsList() {
  const { authStore, productsStore, cartStore } = useRootStore();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = authStore.isAuthenticated;

  const requireAuthForCart = useCallback(() => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  }, [isAuthenticated, pathname, router]);
  const { products, loading, error, total, hasNextPage } = productsStore;

  const loadMore = useCallback(() => {
    if (!hasNextPage || productsStore.loading) return;
    productsStore.fetchNextPage();
  }, [hasNextPage, productsStore]);

  const itemContent = useCallback(
    (index: number, product: Product) => {
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
        <motion.div
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
    },
    [cartStore, requireAuthForCart]
  );

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
        <VirtuosoGrid
          useWindowScroll
          data={products}
          components={gridComponents}
          context={{
            hasNextPage,
            loading: productsStore.loading,
            total,
            productsCount: products.length,
          }}
          endReached={loadMore}
          itemContent={itemContent}
          computeItemKey={(index, product) => {
            const documentId = product.documentId;
            const productId = product.id;
            return `${documentId ?? `product-${productId}`}-${index}`;
          }}
          increaseViewportBy={{ top: 200, bottom: 400 }}
        />
      )}
    </>
  );
});
