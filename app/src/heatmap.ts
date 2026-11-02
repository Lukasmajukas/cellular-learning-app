// The spectrum heatmap: for each band we teach, how well do you remember it right now?
// A band's score = the average "chance you still remember" (FSRS retrievability) over the questions
// that are tagged with that band in the lesson files. A band with no answered question yet is "new" (grey).
import { retrievability, type Reviews } from './fsrs';

export type RawLesson = { questions: { id: string; kind?: string; facts?: string[] }[] };
export type BandRow = { id: string; kind?: string; dl_low_mhz?: number | null; dl_high_mhz?: number | null; not_applicable?: boolean };
export type Group = 'low' | 'mid' | 'high';
export type Cell = { id: string; group: Group; low: number; score: number | null; questions: number };

// The owner's rule: low = below 1 GHz, high = mmWave (24 GHz and up), mid = in between.
export const groupOf = (lowMhz: number): Group => (lowMhz < 1000 ? 'low' : lowMhz >= 24000 ? 'high' : 'mid');

// band id -> IDs of the questions that mention it (e.g. facts: [band:B71, band:n71]).
export function questionsByBand(lessons: RawLesson[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const l of lessons) for (const q of l.questions) {
    if (q.kind === 'learn') continue;
    for (const f of q.facts ?? []) {
      const m = /^band:([^.]+)$/.exec(f);
      if (m && !(out[m[1]] ??= []).includes(q.id)) out[m[1]].push(q.id);
    }
  }
  return out;
}

export function buildHeatmap(bands: BandRow[], lessons: RawLesson[], reviews: Reviews, now: number): Cell[] {
  const byBand = questionsByBand(lessons);
  return bands.flatMap(b => {
    const ids = byBand[b.id];
    if (!ids || b.not_applicable || typeof b.dl_low_mhz !== 'number') return [];
    const cards = ids.map(id => reviews[id]).filter(Boolean);
    const score = cards.length ? cards.reduce((s, c) => s + retrievability(c, now), 0) / cards.length : null;
    return [{ id: b.id, group: groupOf(b.dl_low_mhz), low: b.dl_low_mhz, score, questions: ids.length }];
  }).sort((a, b) => a.low - b.low);
}

// Colour for a score: grey = new, red = fading, yellow = shaky, green = strong.
export function heatColor(score: number | null): string {
  if (score === null) return '#cfd8e0';
  const s = Math.min(1, Math.max(0, score));
  const hue = Math.round(((s - 0.5) / 0.5) * 120); // 50% or less = red (0), 100% = green (120)
  return `hsl(${Math.max(0, hue)}, 65%, 52%)`;
}
export const heatLabel = (score: number | null): string =>
  score === null ? 'new' : score >= 0.9 ? 'strong' : score >= 0.7 ? 'okay' : 'fading';
