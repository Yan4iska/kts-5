import Button from 'components/Button';
import Container from 'components/Container';
import Link from 'next/link';

import styles from './AboutCTA.module.scss';

export default function AboutCTA() {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <Container size="default">
        <div className={styles.content}>
          <h2 id="cta-title" className={styles.title}>
            Start exploring the catalog
          </h2>
          <Link href="/products" className={styles.cta}>
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
