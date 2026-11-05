import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R13: the notices at the top of the frame, tried in the real app. The "This changed" card (a carrier fact
// changed; "Got it" sends its questions back for review) and "your progress is safe" (the save file was damaged and a
// backup was loaded). The path stays at the top while a notice shows, so you see it. Closing a notice fades it out and
// the page glides up into its space instead of jumping (50+ fps). With Reduce motion it simply goes.
const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');
const day = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const CHANGES = [
  { id: 'test-1', date: '2026-10-28', title: 'A made-up change', text: 'Only for this test: a fact got a new as-of date.', source: 'Test source', questions: ['demo-1', 'demo-2'] },
  { id: 'test-2', date: '2026-10-30', title: 'Another made-up change', text: 'A second one, with no questions.', source: 'Test source' },
];
const card = { d: 5, s: 2, due: Date.now() + 5 * DAY, last: 0, reps: 1, lapses: 0 };
const SAVE = (reduceMotion = false) => ({ version: 1, progress: { 'u1-l1': 3, 'u1-l2': 3 }, reviews: { 'demo-1': card, 'demo-2': card, 'demo-3': card }, seenChanges: [],
  settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 1, look: 'night' } });
async function launch({ changes = [] as object[], damaged = false, reduceMotion = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  if (damaged) {
    mkdirSync(join(dir, 'backups'));
    writeFileSync(join(dir, 'backups', `save-${day(new Date(Date.now() - DAY))}.json`), JSON.stringify(SAVE(reduceMotion)));
    writeFileSync(join(dir, 'save.json'), '{ this is not json');
  } else writeFileSync(join(dir, 'save.json'), JSON.stringify(SAVE(reduceMotion)));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir,
    ...(changes.length ? { CELL_TEST_CHANGES: JSON.stringify(changes) } : {}) } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w, dir };
}
// The page under the notices (the path's title row) while a notice closes: it should glide up over several frames.
const closing = async (w: Page, click: () => Promise<void>) => {
  const f = await film(w, ['[data-testid=path-map]', '[data-notice]'], click, 900);
  const ys = f.of('[data-testid=path-map]').map(x => x!.y);
  const steps = ys.slice(1).map((y, i) => ys[i] - y);
  console.log(`page top ${ys[0]} -> ${ys.at(-1)}; biggest one-frame step ${Math.max(...steps).toFixed(1)} px; ${f.fps.toFixed(1)} fps`);
  return { ys, steps, fps: f.fps, notice: f.of('[data-notice]') };
};

test('"This changed": shown at the top (the path waits under it), "1 of 2", Got it fades it and the page glides up; the questions come back', async () => {
  const { app, w, dir } = await launch({ changes: CHANGES });
  await expect(w.getByTestId('change-card')).toBeVisible();
  expect(await w.evaluate(() => scrollY)).toBe(0);            // the path didn't scroll the card away
  await expect(w.getByTestId('change-title')).toHaveText('A made-up change');
  await expect(w.getByTestId('change-of')).toHaveText('1 of 2');
  await expect(w.getByTestId('change-meta')).toHaveText('As of 2026-10-28 · Source: Test source');
  await expect(w.getByTestId('change-review')).toHaveText('2 questions come back for review');
  await w.screenshot({ path: 'test-results/r13-change-card.png' });
  // Got it: the first card leaves and the second one comes in (no "of" any more, no questions).
  await w.getByTestId('change-ok').click();
  await expect(w.getByTestId('change-card')).toHaveCount(1);   // the first one has faded out
  await expect(w.getByTestId('change-title')).toHaveText('Another made-up change');
  await expect(w.getByTestId('change-of')).toHaveCount(0);
  await expect(w.getByTestId('change-review')).toHaveCount(0);
  await w.waitForTimeout(800);
  // The last one: it fades out, then the page glides up into its space (no jump), at 50+ fps.
  const c = await closing(w, () => w.getByTestId('change-ok').click());
  expect(c.ys.at(-1)!).toBeLessThan(c.ys[0] - 100);          // the page really moved up (the card was 200+ px tall)
  expect(c.steps.filter(s => s > 0.5).length).toBeGreaterThanOrEqual(8);   // over many frames ...
  expect(Math.max(...c.steps)).toBeLessThan(60);             // ... never in one big jump
  expect(c.notice.some(x => x && x.op > 0 && x.op < 1)).toBe(true); // the card faded on its way out
  expect(c.fps).toBeGreaterThanOrEqual(50);
  await expect(w.getByTestId('change-card')).toHaveCount(0);
  await app.close();
  const saved = JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8'));
  expect(saved.seenChanges).toEqual(['test-1', 'test-2']);
  expect(Object.keys(saved.reviews).sort()).toEqual(['demo-3']); // the changed fact's questions start again as new
});

test('"Your progress is safe": a damaged save file is restored from yesterday\'s backup; the notice says so and closes smoothly', async () => {
  const { app, w } = await launch({ damaged: true });
  await expect(w.getByTestId('notice')).toBeVisible();
  await expect(w.getByTestId('notice-text')).toHaveText('Your save file was damaged, so I restored your backup from yesterday. Anything you did after it may need doing again.');
  await expect(w.getByTestId('path-count')).toHaveText('2 of 7 lessons done'); // the backup's progress
  expect(await w.evaluate(() => scrollY)).toBe(0);
  await w.screenshot({ path: 'test-results/r13-restored.png' });
  const c = await closing(w, () => w.getByTestId('notice-close').click());
  expect(c.ys.at(-1)!).toBeLessThan(c.ys[0] - 60);
  expect(c.steps.filter(s => s > 0.5).length).toBeGreaterThanOrEqual(8);
  expect(Math.max(...c.steps)).toBeLessThan(40);
  expect(c.fps).toBeGreaterThanOrEqual(50);
  await expect(w.getByTestId('notice')).toHaveCount(0);
  await app.close();
});

test('Reduce motion: a notice closes at once and the page moves up at once (nothing glides)', async () => {
  const { app, w } = await launch({ changes: CHANGES.slice(1), reduceMotion: true });
  await expect(w.getByTestId('change-card')).toBeVisible();
  const c = await closing(w, () => w.getByTestId('change-ok').click());
  const moving = c.steps.filter(s => s > 0.5);
  expect(moving.length).toBeLessThanOrEqual(1);               // one step: straight to its new place
  expect(c.ys.at(-1)!).toBeLessThan(c.ys[0] - 100);
  await app.close();
});
