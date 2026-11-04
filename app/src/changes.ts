// "This changed" cards: when a carrier fact changes (content/changes.json), show one card and restart that fact's review timers.
import type { Reviews } from './fsrs';
import type { SaveState } from './storage';

export type Change = { id: string; date: string; title: string; text: string; source: string; questions?: string[] };

// seenChanges === null means "this save has never looked at the list": treat everything already there as old news (no flood of cards on first start).
export function startChanges(s: SaveState, all: Change[]): SaveState {
  return s.seenChanges === null ? { ...s, seenChanges: all.map(c => c.id) } : s;
}
export const pendingChanges = (s: SaveState, all: Change[]): Change[] => all.filter(c => !(s.seenChanges ?? []).includes(c.id));

// "Got it": the card is marked seen and the listed questions come back as brand new (their old timers are dropped).
export function acknowledge(s: SaveState, c: Change): SaveState {
  const reviews: Reviews = { ...s.reviews };
  for (const q of c.questions ?? []) delete reviews[q];
  return { ...s, reviews, seenChanges: [...(s.seenChanges ?? []), c.id] };
}
