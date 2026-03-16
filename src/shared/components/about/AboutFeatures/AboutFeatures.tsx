import Container from 'components/Container';

import styles from './AboutFeatures.module.scss';

const FEATURES = [
  'Product catalog',
  'Infinite scrolling',
  'Stripe payments',
  'Discount cases system',
  'Responsive design',
];

export default function AboutFeatures() {
  return (
    <section className={styles.section} aria-labelledby="features-title">
      <Container size="default">
        <div className={styles.wrap}>
          <h2 id="features-title" className={styles.title}>
            Project features
          </h2>
          <ul className={styles.list}>
            {FEATURES.map((feature) => (
              <li key={feature} className={styles.item}>
                <span className={styles.bullet} aria-hidden />
                <span className={styles.label}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
