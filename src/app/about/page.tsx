import type { Metadata } from 'next';

import AboutPageContent from './AboutPageContent';

import styles from './AboutPage.module.scss';

export const metadata: Metadata = {
  title: 'About | Lalasia',
  description:
    'Building the future of online shopping. Learn about our mission, values, tech stack, and the story behind Lalasia.',
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <AboutPageContent />
    </main>
  );
}
