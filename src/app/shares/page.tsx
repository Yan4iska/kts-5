'use client';

import Button from 'components/Button';
import Container from 'components/Container';
import Text from 'components/Text';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRootStore } from 'stores';

import CaseOpeningSlider from './components/CaseOpeningSlider';
import styles from './Shares.module.scss';

const easeCubic = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: easeCubic },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.4, ease: easeCubic },
  }),
};

const SharesPage = observer(function SharesPage() {
  const router = useRouter();
  const { discountStore } = useRootStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showDiscountBlock = mounted && discountStore.hasDiscount;

  return (
    <Container size="default">
      <motion.div
        className={styles.page}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} custom={0}>
          <Text tag="h1" view="title" className={styles.title}>
            Discount case
          </Text>
        </motion.div>
        <motion.div variants={itemVariants} custom={1}>
          <Text tag="p" view="p-18" color="secondary" className={styles.subtitle}>
            Press the button and try your luck. You can win a discount from 5% to 99%. The case can
            be opened unlimited times; your last win is saved until you use it at checkout.
          </Text>
        </motion.div>
        <motion.div variants={itemVariants} custom={2}>
          <CaseOpeningSlider
            onWin={(percent) => {
              discountStore.setDiscount(percent);
            }}
          />
        </motion.div>
        {showDiscountBlock && (
          <motion.div
            className={styles.currentDiscount}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeCubic }}
          >
            <Text view="p-18" color="secondary">
              Your current discount: <strong>{discountStore.discountPercent}%</strong>
            </Text>
            <Button variant="primary" size="md" onClick={() => router.push('/cart')}>
              Go to cart
            </Button>
            <Button variant="outline" size="md" onClick={() => discountStore.clearDiscount()}>
              Cancel discount
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
});

export default SharesPage;
