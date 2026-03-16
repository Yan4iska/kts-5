import BagIcon from 'components/icons/BagIcon';
import UserIcon from 'components/icons/UserIcon';
import Text from 'components/Text';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRootStore } from 'stores';

import styles from './RightBlock.module.scss';

const RightBlock: React.FC = observer(() => {
  const { authStore, cartStore, discountStore } = useRootStore();
  const count = cartStore.count;
  const hasDiscount = discountStore.hasDiscount;
  const discountPercent = discountStore.discountPercent;
  const isAuthenticated = authStore.isAuthenticated;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showDiscountBadge = mounted && hasDiscount && discountPercent != null;

  return (
    <div className={styles['right-block']}>
      {showDiscountBadge && (
        <Link href="/cart" className={styles.discountBadge} aria-label="Active discount">
          <Text tag="span" view="p-14" weight="bold">
            {discountPercent}% off
          </Text>
        </Link>
      )}
      <Link href="/cart" className={styles.cartLink} aria-label="Cart">
        <BagIcon style={{ cursor: 'pointer' }} />
        {count > 0 && <span className={styles.cartCount}>{count}</span>}
      </Link>
      <Link
        href={mounted && isAuthenticated ? '/account' : '/login'}
        className={styles.accountLink}
        aria-label={mounted && isAuthenticated ? 'Account' : 'Log in'}
      >
        <UserIcon style={{ cursor: 'pointer' }} />
      </Link>
    </div>
  );
});

export default RightBlock;
