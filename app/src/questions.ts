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
export type Item = Learn | Choice | Match | NumberQ | Order | Scenario;
export type Scored = Exclude<Item, Learn>;
export const isScored = (i: Item): i is Scored => i.kind !== 'learn';

// What the player gave: choice = index, match = for each left side the index of the right side picked,
// number = the typed text, order = labels in the order the player put them, scenario = for each clue the index picked.
export type Answer = number | number[] | string | string[];

export const parseNumber = (t: string): number | null => {
  const n = Number(t.trim().replace(/,/g, '.').replace(/\s*(mhz|b|n)?$/i, ''));
  return t.trim() === '' || Number.isNaN(n) ? null : n;
};
export const correctOrder = (q: Order): string[] =>
  [...q.items].sort((a, b) => a.value - b.value).map(i => i.label);

export function mark(q: Scored, a: Answer): boolean {
  switch (q.kind) {
    case 'choice': return a === q.answer;
    case 'match': return Array.isArray(a) && a.length === q.pairs.length && q.pairs.every((_, i) => (a as number[])[i] === i);
    case 'number': { const n = typeof a === 'string' ? parseNumber(a) : null; return n !== null && Math.abs(n - q.answer) <= q.tolerance; }
    case 'order': return Array.isArray(a) && a.join('|') === correctOrder(q).join('|');
    case 'scenario': return Array.isArray(a) && a.length === q.clues.length && q.clues.every((c, i) => (a as number[])[i] === c.answer);
  }
}
// The right answer, in words, for the feedback line.
export function rightAnswerText(q: Scored): string {
  switch (q.kind) {
    case 'choice': return q.choices[q.answer];
    case 'match': return q.pairs.map(p => `${p[0]} = ${p[1]}`).join('; ');
    case 'number': return `${q.answer}${q.unit ? ' ' + q.unit : ''}`;
    case 'order': return correctOrder(q).join(' → ');
    case 'scenario': return q.clues.map(c => `${c.text} = ${c.choices[c.answer]}`).join('; ');
  }
}
