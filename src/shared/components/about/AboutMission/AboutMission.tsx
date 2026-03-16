import Container from 'components/Container';
import Image from 'next/image';

import styles from './AboutMission.module.scss';

const TITLE = 'Our mission';
const TEXT =
  'We build a platform where finding and buying products is simple and trustworthy. We focus on performance, clarity, and support so that every visit feels productive and every order is reliable. Our goal is to set a new standard for online shopping.';

const MISSION_IMAGE =
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';

export default function AboutMission() {
  return (
    <section className={styles.section} aria-labelledby="mission-title">
      <Container size="default">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 id="mission-title" className={styles.title}>
              {TITLE}
            </h2>
            <p className={styles.text}>{TEXT}</p>
          </div>
          <div className={styles.media}>
            <div className={styles.imageWrap}>
              <Image
                src={MISSION_IMAGE}
                alt="Team collaboration and mission"
                fill
                className={styles.image}
                sizes="(max-width: 900px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
