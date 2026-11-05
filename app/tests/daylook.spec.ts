import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R20 (Day look). A Day save opens in Day from the very first moment (the window's own colour and the page's
// first paint; before R20 the app always started in Night and switched once the save had loaded, a dark flash), the
// building blocks page follows the saved look too, and switching the look fades a cover in the old look's background
// away over 0.3 s (idea I56) instead of every colour snapping at once.
const NIGHT_BG = 'rgb(8, 16, 29)', DAY_BG = 'rgb(243, 247, 252)';
const launch = async (settings: object = {}, hash = '') => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: {}, reviews: {}, seenChanges: [],
    settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night', ...settings } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  if (hash) await w.evaluate(h => { location.hash = h; location.reload(); }, hash);
  return { app, w };
};
const windowBg = (app: Awaited<ReturnType<typeof launch>>['app']) =>
  app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].getBackgroundColor().toUpperCase());

test('a Day save opens in Day from the first paint: no dark flash, and the window itself is Day', async () => {
  const { app, w } = await launch({ look: 'day' });
  await w.waitForLoadState('domcontentloaded');
  // Every frame from as early as the test can look until the path is up: the page's colours are Day's.
  const seen = await w.evaluate(() => new Promise<string[]>(done => {
    const out: string[] = [];
    const f = () => {
      out.push(`${document.documentElement.dataset.look}|${getComputedStyle(document.body).backgroundColor}`);
      if (document.querySelector('[data-testid=path-count]') && out.length > 20) done(out); else requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }));
  console.log(`${seen.length} frames: ${[...new Set(seen)].join(', ')}`);
  expect([...new Set(seen)]).toEqual([`day|${DAY_BG}`]);
  expect(await windowBg(app)).toBe('#F3F7FC');
  await app.close();
});

test('the building blocks page follows the saved look', async () => {
  const { app, w } = await launch({ look: 'day' }, '#blocks');
  await w.getByTestId('blocks').waitFor();
  await expect(w.locator('html')).toHaveAttribute('data-look', 'day');
  expect(await w.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(DAY_BG);
  await app.close();
});

test('switching the look: a cover in the old background fades away in 0.3 s (see-through-ness only), 50+ fps', async () => {
  const { app, w } = await launch();
  await w.getByTestId('path-count').waitFor();
  await w.getByTestId('tab-settings').click(); await w.getByTestId('settings').waitFor();
  await w.waitForTimeout(600);
  expect(await windowBg(app)).toBe('#08101D');
  const cover = '[data-testid=look-fade]';
  const f = await film(w, [cover], () => w.getByTestId('set-look-day').click(), 700, cover);
  const ops = f.of(cover).filter(Boolean).map(x => x!.op);
  const t = f.ts.filter((_, i) => f.frames[i][cover]);
  console.log(`cover ${ops.slice(0, 4).join(', ')} ... ${ops.at(-1)}; on screen ${(t.at(-1)! - t[0]).toFixed(0)} ms; ${f.fps.toFixed(1)} fps`);
  expect(ops[0]).toBeGreaterThan(0.8);                         // it starts as the old look ...
  expect(ops.at(-1)!).toBeLessThan(0.1);                       // ... and is (nearly) gone at the end
  for (let i = 1; i < ops.length; i++) expect(ops[i]).toBeLessThanOrEqual(ops[i - 1] + 0.001); // fading only, never back
  expect(t.at(-1)! - t[0]).toBeGreaterThan(200); expect(t.at(-1)! - t[0]).toBeLessThan(450);
  expect(f.of(cover).filter(Boolean).every(x => x!.sx === 1 && x!.x === 0)).toBe(true); // nothing moves or grows
  expect(f.fps).toBeGreaterThanOrEqual(50);
  await expect(w.locator(cover)).toHaveCount(0);               // gone once faded: it never stays over the app
  await expect(w.locator('html')).toHaveAttribute('data-look', 'day');
  await expect.poll(() => windowBg(app)).toBe('#F3F7FC');     // the window's own colour follows (R20)
  // Back to Night: this time the cover is Day's background.
  await w.getByTestId('set-look-night').click();
  await expect(w.locator(cover)).toHaveAttribute('data-from', 'day');
  await expect(w.locator(cover)).toHaveCount(0);
  await expect.poll(() => windowBg(app)).toBe('#08101D');
  await app.close();
});

test('with Reduce motion the cover only does the quick fade (150 ms)', async () => {
  const { app, w } = await launch({ reduceMotion: true });
  await w.getByTestId('path-count').waitFor();
  await w.getByTestId('tab-settings').click(); await w.getByTestId('settings').waitFor();
  const cover = '[data-testid=look-fade]';
  const f = await film(w, [cover], () => w.getByTestId('set-look-day').click(), 500, cover);
  const t = f.ts.filter((_, i) => f.frames[i][cover]);
  console.log(`reduce motion: on screen ${(t.at(-1)! - t[0]).toFixed(0)} ms`);
  expect(t.at(-1)! - t[0]).toBeLessThan(260);
  await expect(w.locator(cover)).toHaveCount(0);
  await app.close();
});
