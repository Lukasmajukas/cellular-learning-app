// Streak (days in a row), XP (points) and signal bars (how well a lesson went).
export type Game = { streak: number; lastDay: string; xp: number; xpToday: number; xpDay: string };
export const EMPTY_GAME: Game = { streak: 0, lastDay: '', xp: 0, xpToday: 0, xpDay: '' };
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayNum = (k: string) => { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86_400_000); };

export const xpFor = (firstRight: number, retriesRight: number, perfect: boolean) => firstRight * 10 + retriesRight * 5 + (perfect ? 20 : 0);
// A lesson finished today: the streak goes up by 1 if yesterday was the last day, resets to 1 after a gap, stays the same if already counted today.
export function recordDay(g: Game, xp: number, now: Date): Game {
  const today = dayKey(now);
  const gap = g.lastDay ? dayNum(today) - dayNum(g.lastDay) : Infinity;
  const streak = gap === 0 ? g.streak : gap === 1 ? g.streak + 1 : 1;
  return { streak, lastDay: today, xp: g.xp + xp, xpDay: today, xpToday: (g.xpDay === today ? g.xpToday : 0) + xp };
}
// If a day was skipped, the streak is already broken: show 0 until the next lesson.
export const liveStreak = (g: Game, now: Date) => (g.lastDay && dayNum(dayKey(now)) - dayNum(g.lastDay) > 1 ? 0 : g.streak);
// 0 to 5 bars from the share of questions right on the first try.
export const signalBars = (right: number, total: number) => (total === 0 ? 0 : Math.max(1, Math.round((5 * right) / total)));
