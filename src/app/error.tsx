'use client';

import Button from 'components/Button';
import Container from 'components/Container';
import Text from 'components/Text';

import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container size="default">
      <div className={styles.page}>
        <Text tag="h1" view="title" className={styles.title}>
          Something went wrong
        </Text>
        <Text tag="p" view="p-20" color="secondary" className={styles.message}>
          {error.message || 'An unexpected error occurred.'}
        </Text>
        <Button onClick={reset}>Try again</Button>
      </div>
    </Container>
  );
}
