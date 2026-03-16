import Container from 'components/Container';

import styles from './AboutTech.module.scss';

const TECH = [
  { name: 'Next.js', logo: '▲', description: 'React framework with App Router and server components.' },
  { name: 'TypeScript', logo: 'TS', description: 'Type-safe JavaScript for reliable code.' },
  { name: 'MobX', logo: 'M', description: 'Reactive state management for the client.' },
  { name: 'Stripe', logo: 'S', description: 'Secure payments and checkout flows.' },
  { name: 'Swiper', logo: '◀▶', description: 'Touch-enabled sliders and carousels.' },
];

export default function AboutTech() {
  return (
    <section className={styles.section} aria-labelledby="tech-title">
      <Container size="default">
        <h2 id="tech-title" className={styles.title}>
          Technology stack
        </h2>
        <ul className={styles.grid}>
          {TECH.map((item) => (
            <li key={item.name} className={styles.card}>
              <div className={styles.logo} aria-hidden>
                {item.logo}
              </div>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.desc}>{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
