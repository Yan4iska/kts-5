import Container from 'components/Container';

import styles from './AboutTimeline.module.scss';

const EVENTS = [
  { year: '2024', text: 'Project idea' },
  { year: '2025', text: 'React version created' },
  { year: '2026', text: 'Migration to Next.js App Router' },
];

export default function AboutTimeline() {
  return (
    <section className={styles.section} aria-labelledby="timeline-title">
      <Container size="default">
        <div className={styles.wrap}>
          <h2 id="timeline-title" className={styles.title}>
            Timeline
          </h2>
          <ul className={styles.list}>
            {EVENTS.map((event) => (
              <li key={event.year} className={styles.item}>
                <p className={styles.year}>{event.year}</p>
                <p className={styles.text}>{event.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
