import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson, film } from './helpers';
import { REAL_PATH } from '../src/units';
import { isScored } from '../src/questions';

// Redesign R19: the real sounds, tried in the real app. A test can't listen, so the app writes down every sound it
// starts (window.__sounds: which one, how long after the moment it was set to start, how loud, and whether it was the
// real file), and how each file decoded (its length and loudest point, so silence would fail).
type Played = { name: string; delay: number; at: number; gain: number; real: boolean };
type Log = { played: Played[]; ready: number; failed: number; files: Record<string, { seconds: number; peak: number }> };
const launch = async (o: { settings?: object; progress?: object; reviews?: object; real?: boolean } = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: o.progress ?? {}, reviews: o.reviews ?? {}, seenChanges: [],
    settings: { sounds: true, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night', ...o.settings } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: o.real ? '' : '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w, dir };
};
const log = (w: Page) => w.evaluate(() => (window as unknown as { __sounds: Log }).__sounds);
const names = async (w: Page) => (await log(w)).played.map(p => p.name);
const ready = (w: Page) => expect.poll(async () => (await log(w)).ready, { timeout: 5000 }).toBe(7);

test('no sound before the first click; then all seven decode into real sound, each 2 s at most', async () => {
  const { app, w } = await launch();
  await w.waitForTimeout(1200);
  expect((await log(w)).ready).toBe(0);                    // the sound system isn't even set up yet
  await w.getByTestId('tab-settings').click();             // the first click
  await ready(w);
  const l = await log(w);
  expect(l.failed).toBe(0); expect(l.played).toEqual([]);  // a click alone plays nothing
  console.log(Object.entries(l.files).map(([n, f]) => `${n} ${f.seconds.toFixed(2)} s peak ${f.peak.toFixed(2)}`).join('; '));
  for (const f of Object.values(l.files)) { expect(f.seconds).toBeLessThanOrEqual(2); expect(f.peak).toBeGreaterThan(0.1); }
  await app.close();
});

test('a lesson: each answer gives right or not quite (no tap on pick-one), then lesson complete, unlock and the streak', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  await ready(w);
  await playSampleLesson(w);                                  // answers "first choice" each time
  const answers = (await names(w));
  expect(answers.length).toBeGreaterThan(0);
  expect(answers.every(n => n === 'right' || n === 'notQuite' || n === 'complete')).toBe(true);
  expect(answers).not.toContain('tap');
  const done = (await log(w)).played.find(p => p.name === 'complete')!;
  expect(done).toMatchObject({ delay: 0.1, real: true });     // with the burst's first ring
  expect(done.gain).toBeCloseTo(0.6 * 0.6, 5);                // its level at the quiet default volume (60%)
  await w.getByTestId('finish').click();
  await w.getByTestId('path-map').waitFor();
  // Back on the path: the next lesson comes on air with Beacon's pulse (0.95 s, I64), then the top bar adds it up and the streak grows (1.65 s).
  await expect.poll(() => names(w)).toContain('streak');
  const after = (await log(w)).played.slice(answers.length).sort((a, b) => a.delay - b.delay);   // both are set up as the path opens
  expect(after.map(p => p.name)).toEqual(['unlock', 'streak']);
  expect(after[0].delay).toBeCloseTo(0.95, 5); expect(after[1].delay).toBeCloseTo(1.65, 5);
  await app.close();
});

test('"on air" (I64): the unlock sound starts in the same moment as Beacon\'s happy ring pulse on the path; 50+ fps', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  await ready(w);
  await playSampleLesson(w);
  await w.waitForTimeout(1700);                               // the lesson-complete celebration is over
  const before = (await names(w)).length;
  const P = '[data-testid=path-beacon-spot] [data-part=pulse]';
  const r = await film(w, [P], () => w.getByTestId('finish').click(), 1900, '[data-testid=path-beacon-spot]');
  const unlock = (await log(w)).played.slice(before).find(p => p.name === 'unlock')!;
  expect(unlock).toMatchObject({ real: true });
  const i = r.frames.findIndex(f => (f[P]?.op ?? 0) > 0.05);  // the pulse's first frame
  expect(i, 'Beacon pulses').toBeGreaterThan(0);
  const peak = Math.max(...r.of(P).map(f => f?.op ?? 0)), gap = r.ts[i] - unlock.at;
  console.log(`  pulse ${gap >= 0 ? gap.toFixed(0) + ' ms after' : (-gap).toFixed(0) + ' ms before'} the sound starts; pulse peak ${peak}; ${r.fps.toFixed(1)} fps`);
  // One frame is about 17 ms, and the pulse waits for a timer and a repaint: 40 ms (2-3 frames) either way is "together".
  // Before I64 the sound started 100 ms before the pulse.
  expect(Math.abs(gap)).toBeLessThanOrEqual(40);
  expect(peak).toBeGreaterThan(0.5);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('picks that are not the answer yet (match tiles) give a soft tap; Sounds off keeps a lesson quiet', async () => {
  const done = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2'].map(id => [id, 3]));
  const { app, w } = await launch({ progress: done });
  await w.getByTestId('lesson-u2-l3').click();
  await ready(w);
  await w.getByTestId('learn-ok').click();
  await w.getByTestId('choice-0').click(); await w.getByTestId('next').click();
  await w.getByTestId('number-input').fill('617'); await w.getByTestId('check').click(); await w.getByTestId('next').click();
  const before = (await names(w)).length;
  await w.getByTestId('match-left-0').click(); await w.getByTestId('match-right-0').click();
  const taps = (await log(w)).played.slice(before);
  expect(taps.map(p => p.name)).toEqual(['tap', 'tap']);
  expect(taps[0].gain).toBeCloseTo(0.25 * 0.6, 5);           // the softest sound
  await app.close();

  const quiet = await launch({ settings: { sounds: false } });
  await quiet.w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(quiet.w);
  await quiet.w.getByTestId('finish').click(); await quiet.w.getByTestId('path-map').waitFor();
  await quiet.w.waitForTimeout(1900);
  expect(await names(quiet.w)).toEqual([]);
  await quiet.app.close();
});

test('the daily review starts with a radar ping', async () => {
  const ids = [...new Set(REAL_PATH.flatMap(u => u.lessons.flatMap(l => l.questions)).filter(isScored).map(q => q.id))].slice(0, 3);
  const DAY = 86_400_000, due = Date.now() - DAY;
  const reviews = Object.fromEntries(ids.map(id => [id, { d: 5, s: 3, due, last: due - 3 * DAY, reps: 2, lapses: 0 }]));
  const { app, w } = await launch({ real: true, progress: { 'unit01-l1': 3 }, reviews });
  await w.getByTestId('tab-review').click(); await w.getByTestId('review-screen').waitFor();
  await ready(w);
  await w.getByTestId('review-start').click();
  expect((await log(w)).played[0]).toMatchObject({ name: 'review', delay: 0, real: true });
  await app.close();
});

test('volume: 60% to start; arrow keys change it, you hear the new loudness, and it is saved', async () => {
  const { app, w, dir } = await launch({ settings: { sounds: false } });
  await w.getByTestId('tab-settings').click();
  await expect(w.getByTestId('volume-value')).toHaveText('60%');
  await ready(w);
  await w.getByTestId('set-volume').focus();
  for (let i = 0; i < 3; i++) await w.keyboard.press('ArrowLeft');
  await expect(w.getByTestId('volume-value')).toHaveText('30%');
  await expect(w.getByTestId('set-volume')).toHaveAttribute('aria-valuetext', '30%');
  const heard = (await log(w)).played;
  expect(heard.map(p => p.name)).toEqual(['right', 'right', 'right']);      // one per step, even with Sounds off (you asked)
  expect(heard.at(-1)!.gain).toBeCloseTo(0.55 * 0.3, 5);
  await w.screenshot({ path: 'test-results/r19-volume.png' });
  await expect.poll(() => JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8')).settings.volume).toBe(30);
  await app.close();
});
