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

// How a band reads (redesign R14): four levels, each with its own token colour. The tile glows brighter the better you
// remember the band (`heatGlow`), and small signal bars say the same without colour (`heatBars`, 1-4; DESIGN.md: never
// colour alone). Fading = 70% or less, okay = 70-90%, strong = 90% and up; new = not quizzed yet (a dim dashed outline).
export type Level = 'new' | 'fading' | 'okay' | 'strong';
export const LEVELS: Level[] = ['strong', 'okay', 'fading', 'new'];
// Levels and bars go by the whole percent the tile shows, so "90%" is never called "okay" (89.6% showed as 90%: R14).
const pctOf = (score: number) => Math.round(score * 100);
export const heatLabel = (score: number | null): Level =>
  score === null ? 'new' : pctOf(score) >= 90 ? 'strong' : pctOf(score) >= 70 ? 'okay' : 'fading';
export const HEAT_TONE = { strong: 'onAir', okay: 'streak', fading: 'miss', new: 'locked' } as const satisfies Record<Level, string>;
export const LEVEL_WORD: Record<Level, string> = { strong: 'Strong', okay: 'Okay', fading: 'Fading', new: 'New' };
// How much of the level's colour a quizzed tile is filled with (mixed into `surface`); a unit test checks the words on it stay readable.
export const HEAT_TINT = 16;

// How bright the tile's glow layer is (its see-through-ness, 0 to 1): none for a new band, a faint 0.15 at 50% or less,
// rising evenly to full at 100%. A glow is its own layer; only this number changes (DESIGN.md section 7).
export function heatGlow(score: number | null): number {
  if (score === null) return 0;
  const t = Math.min(1, Math.max(0, (score - 0.5) / 0.5));
  return Math.round((0.15 + 0.85 * t) * 100) / 100;
}
// Signal bars on the tile, like a phone's: 1 = fading, 2-3 = okay, 4 = strong, 0 = new.
export const heatBars = (score: number | null): number =>
  score === null ? 0 : pctOf(score) < 70 ? 1 : pctOf(score) < 80 ? 2 : pctOf(score) < 90 ? 3 : 4;

// How many bands are at each level (the legend's counts).
export function heatCounts(cells: Cell[]): Record<Level, number> {
  const out: Record<Level, number> = { strong: 0, okay: 0, fading: 0, new: 0 };
  for (const x of cells) out[heatLabel(x.score)]++;
  return out;
}

// The lessons that ask about each band (tap a tile to see them): band id -> lessons in path order, with their unit number.
export type RawUnit = { id: string; title: string; lessons: (RawLesson & { id: string; title: string })[] };
export type BandLesson = { id: string; title: string; unit: number };
export function lessonsByBand(units: RawUnit[]): Record<string, BandLesson[]> {
  const out: Record<string, BandLesson[]> = {};
  units.forEach((u, k) => u.lessons.forEach(l => {
    for (const band of Object.keys(questionsByBand([l]))) {
      const list = (out[band] ??= []);
      if (!list.some(x => x.id === l.id)) list.push({ id: l.id, title: l.title, unit: k + 1 });
    }
  }));
  return out;
}
