'use client';

import Card from 'components/Card';
import Container from 'components/Container';
import Text from 'components/Text';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import { useRootStore } from 'stores';
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

function getCategoryImage(category: { name: string; image?: string }): string | StaticImageData {
  if (category.image) return category.image;
  const key = category.name.trim().toLowerCase();
  return CATEGORY_IMAGE_BY_NAME[key] ?? PLACEHOLDER_IMAGE;
}

const Categories = observer(function Categories() {
  const { categoriesStore } = useRootStore();
  const categories = categoriesStore.categories;

  return (
    <Container>
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Categories
        </Text>
        <Text tag="p" view="p-20" color="secondary" className={styles.description}>
          Browse products by category. Click a category to see all products in it.
        </Text>
        {categories.length === 0 ? (
          <Text tag="p" view="p-20" color="secondary" className={styles.empty}>
            No categories available.
          </Text>
        ) : (
          <ul className={styles.grid}>
            {categories.map((category, index) => (
              <motion.li
                key={category.id}
                className={styles.gridItem}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.08, 0.4),
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Link href={`/products?categoryIds=${category.id}`} className={styles.cardLink}>
                  <Card
                    className={styles.card}
                    image={getCategoryImage(category)}
                    title={category.name}
                    subtitle="View products"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
});

export default Categories;
