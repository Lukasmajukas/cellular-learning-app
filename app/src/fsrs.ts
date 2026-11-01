// A small copy of the FSRS memory schedule: each question has a "stability" (days until you'd forget it
// about 1 time in 10). Right answers make the gap grow, wrong ones shrink it. Keyed by question ID.
export type Card = { d: number; s: number; due: number; last: number; reps: number; lapses: number };
export type Reviews = Record<string, Card>;
const w = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const DAY = 86_400_000, DECAY = -0.5, FACTOR = 19 / 81;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
export const retrievability = (c: Card, now: number) => Math.pow(1 + (FACTOR * Math.max(0, now - c.last)) / DAY / c.s, DECAY);
const d0 = (g: number) => clamp(w[4] - Math.exp(w[5] * (g - 1)) + 1, 1, 10);

// ok = right on the first try. Right counts as "Good" (3), wrong as "Again" (1).
export function review(card: Card | undefined, ok: boolean, now: number): Card {
  const g = ok ? 3 : 1;
  if (!card) {
    const s = w[g - 1];
    return { d: d0(g), s, due: now + Math.max(1, Math.round(s)) * DAY, last: now, reps: 1, lapses: ok ? 0 : 1 };
  }
  const r = retrievability(card, now);
  const d = clamp(w[7] * d0(3) + (1 - w[7]) * (card.d - w[6] * (g - 3)), 1, 10);
  const s = ok
    ? card.s * (1 + Math.exp(w[8]) * (11 - card.d) * Math.pow(card.s, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1))
    : Math.min(card.s, w[11] * Math.pow(card.d, -w[12]) * (Math.pow(card.s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r)));
  const days = Math.max(1, Math.round(s));
  return { d, s, due: now + days * DAY, last: now, reps: card.reps + 1, lapses: card.lapses + (ok ? 0 : 1) };
}
export const dueIds = (reviews: Reviews, now: number) => Object.keys(reviews).filter(id => reviews[id].due <= now).sort((a, b) => reviews[a].due - reviews[b].due);
