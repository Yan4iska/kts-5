import BagIcon from 'components/icons/BagIcon';
import UserIcon from 'components/icons/UserIcon';
import Text from 'components/Text';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRootStore } from 'stores';

import styles from './RightBlock.module.scss';

const RightBlock: React.FC = observer(() => {
  const { authStore, cartStore } = useRootStore();
  const count = cartStore.count;
  const isAuthenticated = authStore.isAuthenticated;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Match server render until after mount to avoid hydration mismatch (auth is restored from localStorage on client only)
  const showUserBlock = mounted && isAuthenticated && authStore.user;

  return (
    <div className={styles['right-block']}>
      <Link href="/cart" className={styles.cartLink} aria-label="Cart">
        <BagIcon style={{ cursor: 'pointer' }} />
        {count > 0 && <span className={styles.cartCount}>{count}</span>}
      </Link>
      {showUserBlock ? (
        <div className={styles.userBlock}>
          <Text tag="span" view="p-16" color="secondary" className={styles.userEmail}>
            {authStore.user.email}
          </Text>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={() => {
              authStore.logout();
              cartStore.clear();
            }}
          >
            <Text tag="span" view="p-16">Log out</Text>
          </button>
        </div>
      ) : (
        <Link href="/login" className={styles.accountLink} aria-label="Account / Log in">
          <UserIcon style={{ cursor: 'pointer' }} />
        </Link>
      )}
    </div>
  );
});

export default RightBlock;
