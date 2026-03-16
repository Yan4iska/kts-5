'use client';

import {
  AboutHero,
  AboutStats,
  AboutMission,
  AboutValues,
  AboutTech,
  AboutFeatures,
  AboutTimeline,
  AboutCTA,
} from 'components/about';
import { motion } from 'framer-motion';

import styles from './AboutPage.module.scss';

const stagger = 0.08;
const duration = 0.4;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function AboutPageContent() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, ease }}
      >
        <AboutHero />
      </motion.div>
      <motion.section
        className={`${styles.section} ${styles.sectionFirst}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 1, ease }}
      >
        <AboutStats />
      </motion.section>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 2, ease }}
      >
        <AboutMission />
      </motion.section>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 3, ease }}
      >
        <AboutValues />
      </motion.section>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 4, ease }}
      >
        <AboutTech />
      </motion.section>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 5, ease }}
      >
        <AboutFeatures />
      </motion.section>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 6, ease }}
      >
        <AboutTimeline />
      </motion.section>
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: stagger * 7, ease }}
      >
        <AboutCTA />
      </motion.section>
    </>
  );
}
