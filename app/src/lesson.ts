// Sample questions only. These are NOT real band facts: the real ones come from content/ later.
import type { Choice } from './questions';
export type Question = { id: string; prompt: string; choices: string[]; answer: number };
export const SAMPLE: Question[] = [
  { id: 'demo-1', prompt: 'Sample: which is a lower-frequency "reach far" kind of band?', choices: ['Low-band', 'High-band'], answer: 0 },
  { id: 'demo-2', prompt: 'Sample: a tower has 3 sectors. How many "faces" is that?', choices: ['1', '3', '6'], answer: 1 },
  { id: 'demo-3', prompt: 'Sample: which word means one channel for up and down, by time?', choices: ['FDD', 'TDD'], answer: 1 },
];
export const SAMPLE_ITEMS: Choice[] = SAMPLE.map(q => ({ ...q, kind: 'choice' as const }));
export const isCorrect = (q: Question, i: number) => q.answer === i;
export const stars = (right: number, total: number) => (right === total ? 3 : right >= total - 1 ? 2 : 1);
