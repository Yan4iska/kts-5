'use client';

import Button from 'components/Button';
import Card from 'components/Card';
import Text from 'components/Text';
import StarIcon from 'components/icons/StarIcon';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { useRootStore } from 'stores';
import type { Product, StrapiImage } from 'types/product';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from './RelatedItems.module.scss';

function getProductImageUrl(product: Product): string {
  const first: StrapiImage | undefined = product.images?.[0];
  if (!first) return 'https://placehold.co/360x360';
  const url =
    first.url ||
    first.formats?.medium?.url ||
    first.formats?.small?.url ||
    first.formats?.thumbnail?.url;
  return url ?? 'https://placehold.co/360x360';
}

const SWIPER_BREAKPOINTS = {
  320: { slidesPerView: 1.2, spaceBetween: 16 },
  640: { slidesPerView: 2.2, spaceBetween: 20 },
  900: { slidesPerView: 3.2, spaceBetween: 20 },
  1024: { slidesPerView: 4.2, spaceBetween: 24 },
  1200: { slidesPerView: 5, spaceBetween: 24 },
};

type RelatedItemsProps = {
  products: Product[];
};

const RelatedItemsInner = observer(function RelatedItemsInner({ products }: RelatedItemsProps) {
  const { authStore, cartStore } = useRootStore();
  const pathname = usePathname();
  const router = useRouter();

  const requireAuthForCart = () => {
    if (!authStore.isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };

  if (products.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="related-items-heading">
      <Text tag="h2" id="related-items-heading" view="title" className={styles.title}>
        Related Items
      </Text>
      <div className={styles.sliderWrap}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          breakpoints={SWIPER_BREAKPOINTS}
          speed={300}
          grabCursor
          navigation
          className={styles.slider}
        >
          {products.map((p, index) => {
            const documentId = p.documentId;
            const productId = p.id;
            const imageUrl = getProductImageUrl(p);
            const oldPrice = p.discountPercent
              ? Math.round(p.price * (1 + p.discountPercent / 100))
              : null;
            const quantity = cartStore.getQuantity(documentId);

            return (
              <SwiperSlide key={`related-${documentId}-${productId}-${index}`} className={styles.slide}>
                <Link href={`/products/${documentId}`} className={styles.cardLink}>
                  <Card
                    className={styles.card}
                    image={imageUrl}
                    title={p.title}
                    subtitle={p.description || ' '}
                    contentSlot={
                      <div className={styles.cardContent}>
                        <div className={styles.priceWrapper}>
                          <span className={styles.price}>${p.price}</span>
                          {oldPrice && <span className={styles.oldPrice}>${oldPrice}</span>}
                        </div>
                        {p.rating != null && (
                          <div className={styles.ratingRow}>
                            <StarIcon className={styles.ratingIcon} color="secondary" />
                            <Text view="p-16" color="secondary">
                              {p.rating}
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
});

export default RelatedItemsInner;
