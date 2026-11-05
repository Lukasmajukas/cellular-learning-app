import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Idea I69: a save that fails says so, tried in the real app. CELL_TEST_SAVE_FAIL=n makes the first n saves fail (like a
// full disk). The app saves once straight after it opens, so the notice is there from the start. It stays on every
// tab, counts the tries, and goes by itself (fading, the page gliding up into its space) as soon as a save works.
const SAVE = (reduceMotion = false) => ({ version: 1, progress: { 'u1-l1': 3 }, reviews: {}, seenChanges: [], welcomed: true,
  settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 1, look: 'night' } });
async function launch(fails: number, reduceMotion = false) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify(SAVE(reduceMotion)));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir, CELL_TEST_SAVE_FAIL: String(fails) } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w, dir, saved: () => JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8')) };
}
const pageY = (w: Page) => w.getByTestId('app-frame').locator('[data-testid^=screen-]').evaluate(e => e.getBoundingClientRect().y);

test('a failed save shows "Couldn\'t save your last change" on every tab, counts the tries, and goes once Try again works', async () => {
  const { app, w, saved } = await launch(2);
  const n = w.getByTestId('savefail');
  await expect(n).toBeVisible();
  await expect(n).toContainText("Couldn't save your last change");
  await expect(w.getByTestId('savefail-tries')).toHaveCount(0);
  expect(await w.evaluate(() => scrollY)).toBe(0);                 // the path stays at the top, under the notice
  await w.getByTestId('savefail-details').locator('summary').click();
  await expect(w.getByTestId('savefail-detail')).toContainText('CELL_TEST_SAVE_FAIL');
  await w.screenshot({ path: 'test-results/i69-savefail.png' });
  // A change while saving doesn't work: it's kept in the app, the notice stays (on this tab too) and counts the try.
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-goal-3').click();
  await expect(w.getByTestId('savefail-tries')).toHaveText(/^Tried 2 times\./);
  await expect(n).toBeVisible();
  expect(saved().settings.dailyGoal).toBe(1);                       // not in the file yet
  // Try again: this one works. The notice fades out, and the page glides up into its space (50+ fps).
  // (Picking a goal scrolled Settings down, past the notice: scroll back up to it, as you would to read it.)
  await w.evaluate(() => scrollTo(0, 0)); await w.waitForTimeout(300);
  const before = await pageY(w);
  const f = await film(w, ['[data-notice]', '[data-testid=screen-settings]'], () => w.getByTestId('savefail-retry').click(), 900);
  const ys = f.of('[data-testid=screen-settings]').map(x => x!.y), steps = ys.slice(1).map((y, i) => ys[i] - y);
  console.log(`page top ${before} -> ${ys.at(-1)}; biggest one-frame step ${Math.max(...steps).toFixed(1)} px; ${f.fps.toFixed(1)} fps`);
  await expect(n).toHaveCount(0);
  expect(await pageY(w)).toBeLessThan(before - 60);
  expect(steps.filter(s => s > 0.5).length).toBeGreaterThanOrEqual(8);
  // No jump: the biggest one-frame step is well under the whole move (here the notice is tall, its "What happened" open:
  // about 425 px, so an ease-out's first steps are near 95 px; a jump would be the whole 425 in one frame).
  expect(Math.max(...steps)).toBeLessThan((ys[0] - ys.at(-1)!) * 0.35);
  expect(f.of('[data-notice]').some(x => x && x.op > 0 && x.op < 1)).toBe(true);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  expect(saved().settings.dailyGoal).toBe(3);                       // the change kept in the app is now in the file
  await app.close();
});

test('a later change that saves fine also clears the notice (no Try again needed)', async () => {
  const { app, w, saved } = await launch(1);
  await expect(w.getByTestId('savefail')).toBeVisible();
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-sounds').click();
  await expect(w.getByTestId('savefail')).toHaveCount(0);
  expect(saved().settings.sounds).toBe(true);
  await app.close();
});

test('saves that work show nothing', async () => {
  const { app, w } = await launch(0);
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-sounds').click();
  await w.waitForTimeout(400);
  await expect(w.getByTestId('savefail')).toHaveCount(0);
  await app.close();
});

test('Reduce motion: the notice goes at once and the page moves up in one step', async () => {
  const { app, w } = await launch(1, true);
  await expect(w.getByTestId('savefail')).toBeVisible();
  const f = await film(w, ['[data-testid=screen-path]'], () => w.getByTestId('savefail-retry').click(), 600);
  const ys = f.of('[data-testid=screen-path]').map(x => x!.y), moving = ys.slice(1).map((y, i) => ys[i] - y).filter(s => s > 0.5);
  expect(moving.length).toBeLessThanOrEqual(1);
  expect(ys.at(-1)!).toBeLessThan(ys[0] - 60);
  await expect(w.getByTestId('savefail')).toHaveCount(0);
  await app.close();
});
