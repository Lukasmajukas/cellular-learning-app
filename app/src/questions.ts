// Question types for lessons, and how each one is marked.
// "Item" is the finished form (all numbers already filled in from the bands file).
export type Badge = { status: string; asOf: string };
type Base = { id: string; why?: string; badge?: Badge };
export type Learn = Base & { kind: 'learn'; title?: string; text: string; bars?: string[] };
export type Choice = Base & { kind: 'choice'; prompt: string; choices: string[]; answer: number };
export type Match = Base & { kind: 'match'; prompt: string; pairs: [string, string][] };
export type NumberQ = Base & { kind: 'number'; prompt: string; answer: number; tolerance: number; unit?: string };
export type OrderItem = { label: string; value: number; low: number; high: number };
export type Order = Base & { kind: 'order'; prompt: string; items: OrderItem[] };
export type Clue = { text: string; choices: string[]; answer: number; why?: string };
// Scenario puzzle: a short story with several clues. For each clue the player picks what it tells them; every clue must be right.
export type Scenario = Base & { kind: 'scenario'; prompt: string; clues: Clue[] };
// A rectangle on a picture, as fractions of its width and height (0 to 1).
export type Rect = { x: number; y: number; w: number; h: number };
export type Photo = { id: string; src: string; alt: string; credit: string };
// Photo question: a picture above the choices. The outline (if any) marks the deciding part in the feedback.
export type PhotoChoice = Base & { kind: 'photo-choice'; prompt: string; photo: Photo; choices: string[]; answer: number; outline?: Rect };
// Tap-the-clue: tap the right spot on the picture. `clue` names what to find; `target` is the right area.
export type TapClue = Base & { kind: 'tap-clue'; prompt: string; photo: Photo; clue: string; target: Rect };
export type Item = Learn | Choice | Match | NumberQ | Order | Scenario | PhotoChoice | TapClue;
export type Scored = Exclude<Item, Learn>;
export const isScored = (i: Item): i is Scored => i.kind !== 'learn';

// What the player gave: choice = index, match = for each left side the index of the right side picked,
// photo-choice = index, tap-clue = [x, y] as fractions, number = the typed text, order = labels in the order the player put them, scenario = for each clue the index picked.
export type Answer = number | number[] | string | string[];

// Reads what the player typed. "1,710" and "104,972" (US thousands commas, the way the prompts write them) are
// 1710 and 104972; "1 710" too. A lone comma that isn't a thousands group ("1,5") is a decimal point.
// "37 GHz" is 37000 (MHz). A trailing "MHz" is ignored.
export const parseNumber = (t: string): number | null => {
  let s = t.trim().toLowerCase(), scale = 1;
  if (/\s*ghz$/.test(s)) { scale = 1000; s = s.replace(/\s*ghz$/, ''); }
  else s = s.replace(/\s*(mhz|b|n)?$/, '');
  s = s.trim();
  if (/^-?\d{1,3}([, ]\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/[, ]/g, '');
  else s = s.replace(/,/g, '.');
  const n = Number(s);
  return s === '' || Number.isNaN(n) ? null : n * scale;
};
// A fresh random order for answer buttons (0..n-1), so the right answer isn't always in the same place.
export function shuffleOrder(n: number, rand: () => number = Math.random): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const correctOrder = (q: Order): string[] =>
  [...q.items].sort((a, b) => a.value - b.value).map(i => i.label);

export function mark(q: Scored, a: Answer): boolean {
  switch (q.kind) {
    case 'choice': return a === q.answer;
    case 'match': return Array.isArray(a) && a.length === q.pairs.length && q.pairs.every((_, i) => (a as number[])[i] === i);
    case 'number': { const n = typeof a === 'string' ? parseNumber(a) : null; return n !== null && Math.abs(n - q.answer) <= q.tolerance; }
    case 'order': return Array.isArray(a) && a.join('|') === correctOrder(q).join('|');
    case 'scenario': return Array.isArray(a) && a.length === q.clues.length && q.clues.every((c, i) => (a as number[])[i] === c.answer);
    case 'photo-choice': return a === q.answer;
    case 'tap-clue': return Array.isArray(a) && a.length === 2 && inside(q.target, a[0] as number, a[1] as number);
  }
}
export const inside = (r: Rect, x: number, y: number) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
// The right answer, in words, for the feedback line.
export function rightAnswerText(q: Scored): string {
  switch (q.kind) {
    case 'choice': return q.choices[q.answer];
    case 'match': return q.pairs.map(p => `${p[0]} = ${p[1]}`).join('; ');
    case 'number': return `${q.answer}${q.unit ? ' ' + q.unit : ''}`;
    case 'order': return correctOrder(q).join(' → ');
    case 'scenario': return q.clues.map(c => `${c.text} = ${c.choices[c.answer]}`).join('; ');
    case 'photo-choice': return q.choices[q.answer];
    case 'tap-clue': return `the ${q.clue} (outlined on the picture)`;
  }
}
