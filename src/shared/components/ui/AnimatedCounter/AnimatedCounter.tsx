'use client';

import { useEffect, useRef, useState } from 'react';

type AnimatedCounterProps = {
  /** Target value to count up to */
  value: number;
  /** Animation duration in ms (default 1800) */
  duration?: number;
  /** Suffix after the number (e.g. "+", "%", "k+") */
  suffix?: string;
  /** When true, start the count-up animation (e.g. from IntersectionObserver) */
  start: boolean;
};

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}

export default function AnimatedCounter({
  value,
  duration = 1800,
  suffix = '',
  start,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasStartedRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!start || hasStartedRef.current) return;
    hasStartedRef.current = true;
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);
      const current = Math.floor(eased * value);
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [start, value, duration]);

  return (
    <>
      {displayValue.toLocaleString()}
      {suffix}
    </>
  );
}
