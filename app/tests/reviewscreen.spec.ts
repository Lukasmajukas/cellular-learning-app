import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';
import { REAL_PATH } from '../src/units';
import { isScored } from '../src/questions';

// Redesign R13: the Review tab, the "drive test", tried in the real app. A radar scope with one blip per question
// waiting (at most 20 today), farther out the longer it has waited; the blips pop in one after another the first time
// you look (not again when you come back); a soft sweep turns while questions wait (the screen's one background loop).
// Also its other two looks (all clear, nothing yet) and Reduce motion (nothing moves).
const DAY = 86_400_000, HOUR = 3_600_000;
const IDS = [...new Set(REAL_PATH.flatMap(u => u.lessons.flatMap(l => l.questions)).filter(isScored).map(q => q.id))];
const timer = (due: number) => ({ d: 5, s: 3, due, last: due - 3 * DAY, reps: 2, lapses: 0 });
// `late[i]` days past due for question i (negative = not due yet).
const reviewsOf = (late: number[]) => Object.fromEntries(late.map((d, i) => [IDS[i], timer(Date.now() - d * DAY)]));
const launch = async (reviews: object, reduceMotion = false) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: { 'unit01-l1': 3 }, reviews, seenChanges: [],
    settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 1, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const toReview = async (w: Page) => { await w.getByTestId('tab-review').click(); await w.getByTestId('review-screen').waitFor(); };
const B = (n: number) => `[data-testid=blip]:nth-of-type(${n})`;   // the n-th blip (the blips are the scope's only <span>s)

test('drive test: one blip per question waiting, popping in one after another; the sweep turns; 50+ fps', async () => {
  const late = [0.2, 0.5, 2, 3, 9, 12, 0.1, 20, 4, 1.5, 30, 0.6];
  const { app, w } = await launch(reviewsOf(late));
  const f = await film(w, [B(1), B(6), B(12), '[data-testid=scope-sweep]'], () => toReview(w), 1500, B(1));
  const first = f.of(B(1)).filter(Boolean), last = f.of(B(12)).filter(Boolean), sweep = f.of('[data-testid=scope-sweep]').filter(Boolean);
  console.log(`blip 1 scale ${first.slice(0, 4).map(x => x!.sx)} ... ${first.at(-1)!.sx}; blip 12 ${last.slice(0, 4).map(x => x!.sx)}; ${f.fps.toFixed(1)} fps`);
  // Each blip starts small and see-through, and ends at its size; the 12th starts later than the 1st (one after another).
  expect(first[0]!.sx).toBeLessThan(0.5); expect(first.at(-1)!.sx).toBeCloseTo(1, 2); expect(first.at(-1)!.op).toBe(1);
  const grown = (fr: typeof first) => fr.findIndex(x => x!.sx > 0.5);
  expect(grown(last)).toBeGreaterThan(grown(first));
  // The sweep turns: its transform keeps changing (a rotation), the whole time.
  const turns = new Set(sweep.map(x => `${x!.sx},${x!.x}`)).size; // sx = length of the matrix's first column: 1 for a pure turn
  expect(sweep.every(x => Math.abs(x!.sx - 1) < 0.01)).toBe(true);
  const angles = await w.evaluate(async () => {
    const el = document.querySelector('[data-testid=scope-sweep]')!, a = () => { const m = new DOMMatrix(getComputedStyle(el).transform); return Math.atan2(m.b, m.a) * 180 / Math.PI; };
    const out = [a()]; for (let i = 0; i < 3; i++) { await new Promise(r => setTimeout(r, 300)); out.push(a()); } return out;
  });
  console.log(`sweep angles ${angles.map(a => a.toFixed(0))} (${turns} looks)`);
  expect(new Set(angles.map(a => Math.round(a))).size).toBeGreaterThanOrEqual(3);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  // The words: 12 waiting, about 6 minutes; the blips sit on the right rings (today / this week / longer).
  await expect(w.getByTestId('scope-count')).toHaveText('12');
  await expect(w.getByTestId('review-count')).toHaveText('12 questions are waiting');
  await expect(w.getByTestId('review-hint')).toHaveText('About 6 minutes. Oldest first.');
  await expect(w.getByTestId('tab-review-badge')).toHaveText('12');
  const orbits = await w.locator('[data-testid=blip]').evaluateAll(els => els.map(e => Number((e as HTMLElement).dataset.orbit)));
  expect(orbits).toEqual([...late].sort((a, b) => b - a).map(d => (d < 1 ? 0 : d < 7 ? 1 : 2))); // oldest first
  await w.screenshot({ path: 'test-results/r13-review-due.png' });
  // Back on the path and here again: the blips are already known, so none pops in again.
  await w.getByTestId('tab-path').click(); await w.getByTestId('screen-path').waitFor();
  const again = await film(w, [B(1), B(12)], () => toReview(w), 700, B(1));
  expect(again.of(B(1)).filter(Boolean).every(x => x!.sx === 1 && x!.op === 1)).toBe(true);
  expect(again.of(B(12)).filter(Boolean).every(x => x!.sx === 1)).toBe(true);
  // Start the review: the lesson screen opens with the due questions.
  await w.getByTestId('review-start').click();
  await expect(w.getByTestId('lesson-screen')).toBeVisible();
  await app.close();
});

test('drive test: more than 20 waiting shows 20 blips and "the oldest 20"; the count still says all of them', async () => {
  const { app, w } = await launch(reviewsOf(Array.from({ length: 26 }, (_, i) => 1 + i)));
  await toReview(w);
  await expect(w.getByTestId('scope-count')).toHaveText('26');
  await expect(w.locator('[data-testid=blip]')).toHaveCount(20);
  await expect(w.getByTestId('review-hint')).toHaveText('Today: the oldest 20, about 10 minutes.');
  await app.close();
});

test('all clear: no blips, no sweep, when the next question comes back, what is coming up, and a way to the path', async () => {
  const soon = Object.fromEntries([[IDS[0], timer(Date.now() + 5 * HOUR)], [IDS[1], timer(Date.now() + 3 * DAY)], [IDS[2], timer(Date.now() + 30 * DAY)]]);
  const { app, w } = await launch(soon);
  await toReview(w);
  await expect(w.getByTestId('review-screen')).toHaveAttribute('data-look', 'clear');
  await expect(w.getByTestId('review-count')).toHaveText('All clear for now');
  await expect(w.getByTestId('review-hint')).toHaveText('The next question comes back in 5 hours.');
  await expect(w.getByTestId('review-next24')).toContainText('+1');
  await expect(w.getByTestId('review-next7')).toContainText('+2');
  await expect(w.locator('[data-testid=blip]')).toHaveCount(0);
  await expect(w.getByTestId('scope-sweep')).toHaveCount(0);
  await expect(w.getByTestId('tab-review-badge')).toHaveCount(0);
  await w.screenshot({ path: 'test-results/r13-review-clear.png' });
  await w.getByTestId('review-path').click();
  await expect(w.getByTestId('screen-path')).toBeVisible();
  await expect(w.getByTestId('tab-path')).toHaveAttribute('aria-current', 'page');
  await app.close();
});

test('nothing yet: before any lesson, the Review tab explains itself and sends you to your first lesson', async () => {
  const { app, w } = await launch({});
  await toReview(w);
  await expect(w.getByTestId('review-screen')).toHaveAttribute('data-look', 'empty');
  await expect(w.getByTestId('review-count')).toHaveText('Nothing to review yet');
  await expect(w.getByTestId('review-coming')).toHaveCount(0);
  await expect(w.getByTestId('review-path')).toHaveText('Go to your first lesson');
  await app.close();
});

test('Reduce motion: the blips are simply there and the sweep stands still', async () => {
  const { app, w } = await launch(reviewsOf([0.5, 2, 9]), true);
  const f = await film(w, [B(1), B(3), '[data-testid=scope-sweep]'], () => toReview(w), 900, B(1));
  for (const s of [B(1), B(3)]) expect(f.of(s).filter(Boolean).every(x => x!.sx === 1 && x!.op === 1), s).toBe(true);
  const sweep = f.of('[data-testid=scope-sweep]').filter(Boolean).map(x => `${x!.sx},${x!.sy},${x!.x},${x!.y}`);
  expect(new Set(sweep).size).toBe(1);
  const angle = () => w.evaluate(() => getComputedStyle(document.querySelector('[data-testid=scope-sweep]')!).transform);
  const a = await angle(); await w.waitForTimeout(500); expect(await angle()).toBe(a);
  await app.close();
});
