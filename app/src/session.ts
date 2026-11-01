// The order questions come in during one lesson. A missed question comes back once, a few steps later.
import { isScored, type Item } from './questions';
export type Run = { queue: Item[]; index: number; seen: string[]; retried: string[]; firstRight: string[]; firstMissed: string[] };
export const RETRY_GAP = 3;
export const startRun = (items: Item[]): Run => ({ queue: items, index: 0, seen: [], retried: [], firstRight: [], firstMissed: [] });
export const current = (r: Run): Item | undefined => r.queue[r.index];
export const finished = (r: Run) => r.index >= r.queue.length;
export const scoredCount = (r: Run) => r.queue.filter(isScored).filter((q, i, a) => a.findIndex(x => x.id === q.id) === i).length;

// ok: was the answer right? Learn cards call this with ok = true. Returns the next state.
export function advance(r: Run, ok: boolean): Run {
  const it = r.queue[r.index];
  if (!it) return r;
  const first = !r.seen.includes(it.id);
  const next: Run = { ...r, index: r.index + 1, seen: first ? [...r.seen, it.id] : r.seen };
  if (!isScored(it)) return next;
  if (first) { if (ok) next.firstRight = [...r.firstRight, it.id]; else next.firstMissed = [...r.firstMissed, it.id]; }
  if (!ok && first && !r.retried.includes(it.id)) {
    const q = [...r.queue]; q.splice(Math.min(next.index + RETRY_GAP - 1, q.length), 0, it);
    next.queue = q; next.retried = [...r.retried, it.id];
  }
  return next;
}
