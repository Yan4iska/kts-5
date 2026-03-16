import Button from 'components/Button';
import Container from 'components/Container';
import Link from 'next/link';

import styles from './AboutHero.module.scss';

const HEADLINE = 'Building the future of online shopping';
const DESCRIPTION =
  'We combine a modern tech stack with a focus on experience to create a shopping platform that is fast, reliable, and enjoyable for everyone.';

export default function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.gradient} aria-hidden />
      <Container size="expand">
        <div className={styles.content}>
          <h1 className={styles.headline}>{HEADLINE}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>
          <Link href="/products" className={styles.cta}>
            <Button>Explore Products</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
