'use client';

import Button from 'components/Button';
import Container from 'components/Container';
import Text from 'components/Text';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRootStore } from 'stores';
import type { Order, OrderItem } from 'types/order';

import styles from './Account.module.scss';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_BASE ?? 'https://front-school-strapi.ktsdev.ru';

function OrderProductRow({ item }: { item: OrderItem }) {
  const src = item.imageUrl.startsWith('http') ? item.imageUrl : `${STRAPI_BASE}${item.imageUrl}`;
  return (
    <div className={styles.orderProduct}>
      <div className={styles.orderProductImage}>
        <img
          src={src}
          alt=""
          className={styles.orderProductImg}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/80x80';
          }}
        />
      </div>
      <div className={styles.orderProductInfo}>
        <Text view="p-16" weight="medium">
          {item.title}
        </Text>
        <Text view="p-14" color="secondary">
          Qty: {item.quantity} × ${item.price.toFixed(2)} = $
          {(item.quantity * item.price).toFixed(2)}
        </Text>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const totalDollars = (order.totalCents / 100).toFixed(2);
  return (
    <article className={styles.orderCard}>
      <div className={styles.orderCardHeader}>
        <Text view="p-18" weight="bold">
          Order {order.orderId}
        </Text>
        <Text view="p-14" color="secondary">
          {date}
        </Text>
      </div>
      <div className={styles.orderCardMeta}>
        <span>
          <Text view="p-16" color="secondary">
            Total: <strong>${totalDollars}</strong>
          </Text>
        </span>
        {order.discountPercent != null && order.discountPercent > 0 && (
          <Text view="p-16" color="secondary">
            Discount: {order.discountPercent}%
          </Text>
        )}
        <Text view="p-16" color="secondary">
          Status: <span className={styles.statusPaid}>{order.paymentStatus}</span>
        </Text>
      </div>
      <ul className={styles.orderProductList}>
        {order.items.map((item, i) => (
          <li key={`${item.documentId}-${i}`}>
            <OrderProductRow item={item} />
          </li>
        ))}
      </ul>
    </article>
  );
}

const AccountPageContent = observer(function AccountPageContent() {
  const router = useRouter();
  const { authStore, cartStore, orderStore } = useRootStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const showSuccess = searchParams.get('success') === '1';

  const handleLogout = () => {
    authStore.logout();
    cartStore.clear();
    router.push('/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && authStore.user) {
      orderStore.fetchOrders(authStore.user.id);
    }
  }, [mounted, authStore.user?.id, orderStore]);

  useEffect(() => {
    if (showSuccess) {
      toast.success('Payment successful');
    }
  }, [showSuccess]);

  if (!mounted) {
    return (
      <Container size="default">
        <div className={styles.page}>
          <Text view="p-20" color="secondary">
            Loading...
          </Text>
        </div>
      </Container>
    );
  }

  if (!authStore.isAuthenticated || !authStore.user) {
    return (
      <Container size="default">
        <div className={styles.page}>
          <Text tag="h1" view="title" className={styles.title}>
            Account
          </Text>
          <Text view="p-20" color="secondary">
            Please{' '}
            <Link href="/login" className={styles.link}>
              log in
            </Link>{' '}
            to view your account and order history.
          </Text>
        </div>
      </Container>
    );
  }

  const user = authStore.user;
  const orders = orderStore.orders;
  const loading = orderStore.loading;

  return (
    <Container size="default">
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Account
        </Text>

        {showSuccess && (
          <div className={styles.successBanner}>
            <Text view="p-18" weight="medium">
              Payment successful. Your order has been created.
            </Text>
          </div>
        )}

        <section className={styles.userSection}>
          <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
            Profile
          </Text>
          <div className={styles.userCard}>
            <div className={styles.userRow}>
              <Text view="p-16" color="secondary">
                Name
              </Text>
              <Text view="p-16">{user.username || '—'}</Text>
            </div>
            <div className={styles.userRow}>
              <Text view="p-16" color="secondary">
                Email
              </Text>
              <Text view="p-16">{user.email}</Text>
            </div>
            <div className={styles.userRow}>
              <Text view="p-16" color="secondary">
                Orders
              </Text>
              <Text view="p-16">{orders.length}</Text>
            </div>
            <div className={styles.logoutRow}>
              <Button type="button" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </section>

        <section className={styles.ordersSection}>
          <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
            Orders
          </Text>
          {loading ? (
            <Text view="p-18" color="secondary">
              Loading orders...
            </Text>
          ) : orders.length === 0 ? (
            <div className={styles.emptyOrders}>
              <Text view="p-18" color="secondary">
                You haven&apos;t placed any orders yet.
              </Text>
              <Link href="/products" className={styles.link}>
                Browse products
              </Link>
            </div>
          ) : (
            <ul className={styles.orderList}>
              {orders.map((order) => (
                <li key={order.orderId}>
                  <OrderCard order={order} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
});

function AccountPageFallback() {
  return (
    <Container size="default">
      <div className={styles.page}>
        <Text view="p-20" color="secondary">
          Loading...
        </Text>
      </div>
    </Container>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageFallback />}>
      <AccountPageContent />
    </Suspense>
  );
}
