export type PrizeTier = 'blue' | 'pink' | 'red' | 'darkred' | 'gold';

export type Prize = {
  percent: number;
  tier: PrizeTier;
};

function tierFor(percent: number): PrizeTier {
  if (percent <= 40) return 'blue';
  if (percent <= 50) return 'pink';
  if (percent <= 60) return 'red';
  if (percent <= 70) return 'darkred';
  return 'gold';
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TIERS: { tier: PrizeTier; min: number; max: number; weight: number }[] = [
  { tier: 'blue', min: 5, max: 40, weight: 60 },
  { tier: 'pink', min: 41, max: 50, weight: 20 },
  { tier: 'red', min: 51, max: 60, weight: 10 },
  { tier: 'darkred', min: 61, max: 70, weight: 7 },
  { tier: 'gold', min: 71, max: 99, weight: 3 },
];

const TOTAL_WEIGHT = TIERS.reduce((s, t) => s + t.weight, 0);

export function pickWinner(): Prize {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const t of TIERS) {
    r -= t.weight;
    if (r <= 0) {
      const percent = randInt(t.min, t.max);
      return { percent, tier: tierFor(percent) };
    }
  }
  const last = TIERS[TIERS.length - 1];
  const percent = randInt(last.min, last.max);
  return { percent, tier: last.tier };
}

const BLUE_PERCENTS = [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40];
const PINK_PERCENTS = [41, 43, 45, 47, 50];
const RED_PERCENTS = [51, 54, 57, 60];
const DARK_RED_PERCENTS = [62, 65, 68, 70];
const GOLD_PERCENTS = [71, 75, 80, 85, 90, 95, 99];

function randomFillerPrize(): Prize {
  const tierRoll = Math.random();
  if (tierRoll < 0.6) {
    const p = BLUE_PERCENTS[Math.floor(Math.random() * BLUE_PERCENTS.length)];
    return { percent: p, tier: 'blue' };
  }
  if (tierRoll < 0.8) {
    const p = PINK_PERCENTS[Math.floor(Math.random() * PINK_PERCENTS.length)];
    return { percent: p, tier: 'pink' };
  }
  if (tierRoll < 0.9) {
    const p = RED_PERCENTS[Math.floor(Math.random() * RED_PERCENTS.length)];
    return { percent: p, tier: 'red' };
  }
  if (tierRoll < 0.97) {
    const p = DARK_RED_PERCENTS[Math.floor(Math.random() * DARK_RED_PERCENTS.length)];
    return { percent: p, tier: 'darkred' };
  }
  const p = GOLD_PERCENTS[Math.floor(Math.random() * GOLD_PERCENTS.length)];
  return { percent: p, tier: 'gold' };
}

export const LIST_LENGTH = 100;
export const WINNER_INDEX = 72;

export function buildPrizeList(winner: Prize): Prize[] {
  const list: Prize[] = [];
  for (let i = 0; i < LIST_LENGTH; i++) {
    list.push(i === WINNER_INDEX ? winner : randomFillerPrize());
  }
  return list;
}

const DETERMINISTIC_FILLER: Prize[] = [
  ...BLUE_PERCENTS.slice(0, 10).map((p) => ({ percent: p, tier: 'blue' as PrizeTier })),
  ...PINK_PERCENTS.map((p) => ({ percent: p, tier: 'pink' as PrizeTier })),
  ...RED_PERCENTS.map((p) => ({ percent: p, tier: 'red' as PrizeTier })),
  ...DARK_RED_PERCENTS.map((p) => ({ percent: p, tier: 'darkred' as PrizeTier })),
  ...GOLD_PERCENTS.map((p) => ({ percent: p, tier: 'gold' as PrizeTier })),
];

function getDeterministicFiller(index: number): Prize {
  return DETERMINISTIC_FILLER[index % DETERMINISTIC_FILLER.length];
}

export function getInitialPrizeList(): Prize[] {
  const list: Prize[] = [];
  for (let i = 0; i < LIST_LENGTH; i++) {
    list.push(
      i === WINNER_INDEX
        ? { percent: 10, tier: 'blue' }
        : getDeterministicFiller(i)
    );
  }
  return list;
}
