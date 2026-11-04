// Streak (days in a row), XP (points) and signal bars (how well a lesson went).
// freezes: spare "days off" (earn 1 every 7 streak days, keep at most 2). doneToday: lessons/reviews finished today (for the goal bar).
// lost/lostDay: the streak you had before a break, so you can repair it for 48 hours.
export type Game = { streak: number; lastDay: string; xp: number; xpToday: number; xpDay: string; doneToday: number; doneDay: string; freezes: number; lost: number; lostDay: string };
export const EMPTY_GAME: Game = { streak: 0, lastDay: '', xp: 0, xpToday: 0, xpDay: '', doneToday: 0, doneDay: '', freezes: 0, lost: 0, lostDay: '' };
export const MAX_FREEZES = 2;
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayNum = (k: string) => { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86_400_000); };

export const xpFor = (firstRight: number, retriesRight: number, perfect: boolean) => firstRight * 10 + retriesRight * 5 + (perfect ? 20 : 0);
// A lesson finished today: the streak goes up by 1 if yesterday was the last day, resets to 1 after a gap, stays the same if already counted today.
export function recordDay(g: Game, xp: number, now: Date): Game {
  const today = dayKey(now);
  const gap = g.lastDay ? dayNum(today) - dayNum(g.lastDay) : Infinity;
  // One missed day with a freeze in the bank: the freeze is used up and the streak carries on.
  const frozen = gap === 2 && g.freezes > 0 && g.streak > 0;
  const broken = gap > 2 || (gap === 2 && !frozen);
  const streak = gap === 0 ? g.streak : gap === 1 || frozen ? g.streak + 1 : 1;
  let freezes = g.freezes - (frozen ? 1 : 0);
  if (streak > g.streak && streak % 7 === 0) freezes = Math.min(MAX_FREEZES, freezes + 1);
  const lost = broken && g.streak > 1 ? { lost: g.streak, lostDay: g.lastDay } : { lost: g.lost, lostDay: g.lostDay };
  return { ...g, ...lost, streak, freezes, lastDay: today, xp: g.xp + xp, xpDay: today, xpToday: (g.xpDay === today ? g.xpToday : 0) + xp,
    doneDay: today, doneToday: (g.doneDay === today ? g.doneToday : 0) + 1 };
}
// Lessons/reviews finished today.
export const doneToday = (g: Game, now: Date) => (g.doneDay === dayKey(now) ? g.doneToday : 0);
// Streak you could repair right now (0 = nothing to repair). The window is 48 hours after the missed day: 3 days after the last active day.
export function repairable(g: Game, now: Date): number {
  const today = dayNum(dayKey(now));
  if (g.lost > 0 && g.lostDay && today - dayNum(g.lostDay) <= 3 && g.streak < g.lost + 1) return g.lost;
  const gap = g.lastDay ? today - dayNum(g.lastDay) : 0;
  return g.streak > 1 && gap >= 2 && gap <= 3 && !(gap === 2 && g.freezes > 0) ? g.streak : 0;
}
// Repair: before today's lesson, pretend yesterday was done; after it, give back the old streak plus today.
export function repairStreak(g: Game, now: Date): Game {
  const n = repairable(g, now); if (!n) return g;
  const today = dayNum(dayKey(now));
  if (g.lost > 0 && g.lostDay && today - dayNum(g.lostDay) <= 3 && g.lastDay === dayKey(now)) return { ...g, streak: g.lost + 1, lost: 0, lostDay: '' };
  return { ...g, lastDay: dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12)), lost: 0, lostDay: '' };
}
// If a day was skipped, the streak is already broken: show 0 until the next lesson.
// A freeze covers exactly one missed day.
export const liveStreak = (g: Game, now: Date) => {
  const gap = g.lastDay ? dayNum(dayKey(now)) - dayNum(g.lastDay) : 0;
  return gap > 2 || (gap === 2 && !(g.freezes > 0)) ? 0 : g.streak;
};
// 0 to 5 bars from the share of questions right on the first try.
export const signalBars = (right: number, total: number) => (total === 0 ? 0 : Math.max(1, Math.round((5 * right) / total)));
