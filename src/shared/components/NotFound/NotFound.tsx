import Button from 'components/Button';
import Container from 'components/Container';
import Text from 'components/Text';
import Link from 'next/link';

import styles from './NotFound.module.scss';

const NotFound = () => (
  <Container size="default">
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <Text tag="h1" view="title" className={styles.title}>
        Page not found
      </Text>
      <Text tag="p" view="p-20" color="secondary" className={styles.description}>
        The page you’re looking for doesn’t exist or has been moved.
      </Text>
      <Link href="/" className={styles.link}>
        <Button>Go to home</Button>
      </Link>
    </div>
  </Container>
);

export default NotFound;
