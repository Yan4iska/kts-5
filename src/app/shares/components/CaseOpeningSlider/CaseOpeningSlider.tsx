'use client';

import Button from 'components/Button';
import Text from 'components/Text';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buildPrizeList, getInitialPrizeList, pickWinner, WINNER_INDEX } from './prizes';
import type { Prize } from './prizes';
import styles from './CaseOpeningSlider.module.scss';

const CARD_SIZE = 100;
const CARD_GAP = 12;
const ITEM_WIDTH = CARD_SIZE + CARD_GAP;
const ANIMATION_DURATION_MS = 5000;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type Props = {
  onWin: (percent: number) => void;
};

const PrizeCard = React.memo(function PrizeCard({
  prize,
  isWinner,
}: {
  prize: Prize;
  isWinner: boolean;
  index: number;
}) {
  return (
    <div
      className={`${styles.card} ${styles[`tier_${prize.tier}`]} ${
        isWinner ? styles.winner : ''
      }`}
    >
      <Text view="p-20" weight="bold">
        {prize.percent}%
      </Text>
    </div>
  );
});

export default function CaseOpeningSlider({ onWin }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [prizeList, setPrizeList] = useState<Prize[]>(getInitialPrizeList);
  const [showResult, setShowResult] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const runRoll = useCallback(() => {
    if (rolling) return;

    const viewportEl = viewportRef.current;
    const listEl = listRef.current;
    if (!viewportEl || !listEl) return;

    const won = pickWinner();
    const list = buildPrizeList(won);
    setPrizeList(list);
    setWinner(null);
    setShowResult(false);
    setRolling(true);

    const viewportWidth = viewportEl.clientWidth;
    const centerOffset = viewportWidth / 2 - ITEM_WIDTH / 2;
    const targetTranslateX = centerOffset - WINNER_INDEX * ITEM_WIDTH;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const eased = easeOutCubic(t);
      const currentX = targetTranslateX * eased;
      listEl.style.transform = `translate3d(${currentX}px, 0, 0)`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        listEl.style.transform = `translate3d(${targetTranslateX}px, 0, 0)`;
        setWinner(won);
        setShowResult(true);
        onWin(won.percent);
        setRolling(false);
      }
    };

    listEl.style.transform = 'translate3d(0, 0, 0)';
    rafRef.current = requestAnimationFrame(tick);
  }, [rolling, onWin]);

  const displayList = useMemo(() => prizeList, [prizeList]);

  return (
    <div className={styles.wrap}>
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.blurLeft} />
        <div className={styles.track}>
          <div
            ref={listRef}
            className={styles.list}
            style={{
              width: displayList.length * ITEM_WIDTH - CARD_GAP,
              willChange: rolling ? 'transform' : 'auto',
            }}
          >
            {displayList.map((p, i) => (
              <PrizeCard
                key={`${i}-${p.percent}-${p.tier}`}
                prize={p}
                isWinner={winner !== null && i === WINNER_INDEX}
                index={i}
              />
            ))}
          </div>
        </div>
        <div className={styles.blurRight} />
        <div className={styles.centerMarker} aria-hidden />
      </div>

      {showResult && winner && (
        <motion.div
          className={styles.resultMessage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Text tag="p" view="p-20" weight="bold" className={styles.resultText}>
            You won a {winner.percent}% discount!
          </Text>
        </motion.div>
      )}

      <Button
        className={styles.openBtn}
        onClick={runRoll}
        disabled={rolling}
      >
        {rolling ? 'Opening...' : 'Open case'}
      </Button>
    </div>
  );
}
