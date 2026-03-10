'use client';
import Card from 'components/Card';
import Container from 'components/Container';
import Text from 'components/Text';
import { getProductCategories } from 'config/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import type { ProductCategory } from 'types/product';
import electronicsImage from '@/shared/assets/images/mock/categories/electronics.jpeg';
import furnitureImage from '@/shared/assets/images/mock/categories/furniture.jpeg';
import miscellaneousImage from '@/shared/assets/images/mock/categories/miscellaneous.jpeg';
import shoesImage from '@/shared/assets/images/mock/categories/shoes.jpeg';

import styles from './Categories.module.scss';

const PLACEHOLDER_IMAGE = 'https://placehold.co/342x342';

const CATEGORY_IMAGE_BY_NAME: Record<string, string | StaticImageData> = {
  electronics: electronicsImage,
  furniture: furnitureImage,
  miscellaneous: miscellaneousImage,
  shoes: shoesImage,
};

function getCategoryImage(categoryName: string): string | StaticImageData {
  const key = categoryName.trim().toLowerCase();
  return CATEGORY_IMAGE_BY_NAME[key] ?? PLACEHOLDER_IMAGE;
}

const Categories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container>
        <div className={styles.page}>
          <Text tag="h1" view="title" className={styles.title}>
            Categories
          </Text>
          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton} aria-hidden>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonBody}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLine_title}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonLine_short}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.page}>
          <Text tag="h1" view="title" className={styles.title}>
            Categories
          </Text>
          <Text tag="p" view="p-20" color="secondary" className={styles.error}>
            {error}
          </Text>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Categories
        </Text>
        <Text tag="p" view="p-20" color="secondary" className={styles.description}>
          Browse products by category. Click a category to see all products in it.
        </Text>
        <ul className={styles.grid}>
          {categories.map((category) => (
            <li key={category.id} className={styles.gridItem}>
              <Link href={`/products?categoryIds=${category.id}`} className={styles.cardLink}>
                <Card
                  className={styles.card}
                  image={getCategoryImage(category.name)}
                  title={category.name}
                  subtitle="View products"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default Categories;
