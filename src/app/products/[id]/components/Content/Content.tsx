import Button from 'components/Button';
import ProductGallery from 'components/ProductGallery';
import StarIcon from 'components/icons/StarIcon';
import Text from 'components/Text';
import type { StrapiImage } from 'types/product';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useRootStore } from 'stores';

import styles from './Content.module.scss';

export type ContentProps = {
  documentId: string;
  productId: number;
  title: string;
  description: string;
  price: number;
  discountPercent?: number;
  rating?: number | null;
  images: StrapiImage[];
  isInStock: boolean;
};

const Content = observer(function Content({
  documentId,
  productId,
  title,
  description,
  price,
  discountPercent = 0,
  rating,
  images,
  isInStock,
}: ContentProps) {
  const { authStore, cartStore } = useRootStore();
  const pathname = usePathname();
  const router = useRouter();
  const quantity = cartStore.getQuantity(documentId);
  const isAuthenticated = authStore.isAuthenticated;

  const requireAuthForCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };
  const hasDiscount = discountPercent > 0;
  const oldPrice = hasDiscount ? Math.round(price * (1 + discountPercent / 100)) : null;

  return (
    <div className={styles.content}>
      <div className={styles.galleryWrapper}>
        <ProductGallery className={styles.gallery} images={images} />
      </div>
      <div className={styles.info}>
        <Text view="title" color="primary" tag="h1" className={styles.title}>
          {title}
        </Text>

        {rating != null && (
          <div className={styles.ratingRow}>
            <StarIcon className={styles.ratingIcon} color="secondary" />
            <Text view="p-20" color="secondary" weight="medium" className={styles.ratingValue}>
              {rating}
            </Text>
          </div>
        )}

        <div className={styles.priceBlock}>
          <Text view="p-18" color="secondary" className={styles.description}>
            {description}
          </Text>
          <Text view="title" color="primary" weight="bold" className={styles.price}>
            ${price}
          </Text>
          {hasDiscount && (
            <Text view="p-20" color="secondary" className={styles.oldPrice}>
              ${oldPrice}
            </Text>
          )}
        </div>

        <Text view="p-20" color="secondary" className={styles.stock}>
          {isInStock ? 'In Stock' : 'Out of stock'}
        </Text>

        <div className={styles.actions}>
          {quantity === 0 ? (
            <Button
              disabled={!isInStock}
              className={styles.btnCart}
              onClick={() => {
                if (requireAuthForCart()) return;
                cartStore.add(documentId, productId);
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <div className={styles.quantityBlock}>
              <Button
                disabled={!isInStock}
                className={styles.qtyBtn}
                onClick={() => {
                  if (requireAuthForCart()) return;
                  cartStore.decrease(documentId, productId);
                }}
              >
                –
              </Button>
              <Text view="p-18" tag="span" className={styles.qtyValue}>
                {quantity}
              </Text>
              <Button
                disabled={!isInStock}
                className={styles.qtyBtn}
                onClick={() => {
                  if (requireAuthForCart()) return;
                  cartStore.add(documentId, productId);
                }}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Content;
