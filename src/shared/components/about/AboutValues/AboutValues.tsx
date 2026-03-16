import Container from 'components/Container';

import styles from './AboutValues.module.scss';

const VALUES = [
  {
    icon: '◆',
    title: 'Innovation',
    description: 'We continuously improve our platform with modern tools and best practices.',
  },
  {
    icon: '◇',
    title: 'Reliability',
    description: 'Stable infrastructure and clear processes so you can shop with confidence.',
  },
  {
    icon: '○',
    title: 'Customer Focus',
    description: 'Every decision is made with the end user and their experience in mind.',
  },
  {
    icon: '▢',
    title: 'Transparency',
    description: 'Honest pricing, clear policies, and straightforward communication.',
  },
];

export default function AboutValues() {
  return (
    <section className={styles.section} aria-labelledby="values-title">
      <Container size="default">
        <h2 id="values-title" className={styles.title}>
          Our values
        </h2>
        <ul className={styles.grid}>
          {VALUES.map((item) => (
            <li key={item.title} className={styles.card}>
              <div className={styles.icon} aria-hidden>
                {item.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
