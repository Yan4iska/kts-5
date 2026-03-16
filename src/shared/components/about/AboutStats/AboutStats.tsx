'use client';

import Container from 'components/Container';
import AnimatedCounter from 'components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './AboutStats.module.scss';

const STATS = [
  { value: 1000, suffix: '+', label: 'Products' },
  { value: 25, suffix: '+', label: 'Categories' },
  { value: 10, suffix: 'k+', label: 'Users' },
  { value: 99, suffix: '%', label: 'Customer satisfaction' },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const ANIMATION_DURATION_MS = 1800;

export default function AboutStats() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  const onIntersect = useCallback<IntersectionObserverCallback>(([entry]) => {
    if (!entry.isIntersecting || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setShouldAnimate(true);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '-60px 0px 0px 0px',
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Statistics"
    >
      <Container size="default">
        <motion.ul
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STATS.map((stat) => (
            <motion.li key={stat.label} className={styles.item} variants={item}>
              <span className={styles.value}>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={ANIMATION_DURATION_MS}
                  start={shouldAnimate}
                />
              </span>
              <span className={styles.label}>{stat.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
