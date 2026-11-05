import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R21: first start, empty screens, start-up.
// - The app's own start screen is the window's very first picture (the window waits for it), stays until the app is
//   ready, then fades away (see-through-ness only); never a blank frame in between, even on a slow start.
// - A brand-new save gets a two-page welcome (what the app teaches, then the daily goal), by mouse or keyboard, once.
//   A save that has played before never sees it.
// - The empty heatmap has a friendly card; a progress file that can't be opened and a crash get kind error screens
//   with "Try again".
type Save = Record<string, unknown>;
const NIGHT_BG = 'rgb(8, 16, 29)', DAY_BG = 'rgb(243, 247, 252)';
async function launch(save: Save | null, env: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  if (save) writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: {}, reviews: {}, seenChanges: [], ...save,
    settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night', ...(save.settings as object ?? {}) } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir, CELL_SKIP_WELCOME: '', ...env } });
  const w = await app.firstWindow();
  return { app, w, dir, saved: () => JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8')) };
}
const PLAYED = { progress: { 'u1-l1': 3 } };

// Every frame from as early as the test can look until `until` shows: is the start screen up (and how see-through),
// is the app drawn, and the page's colour. Never neither: no blank frame.
const watchStart = (w: Page, until: string) => w.evaluate(until => new Promise<{ boot: number | null; app: boolean; bg: string; t: number }[]>(done => {
  const out: { boot: number | null; app: boolean; bg: string; t: number }[] = [];
  const f = (t: number) => {
    const boot = document.getElementById('boot');
    out.push({ boot: boot ? Number(getComputedStyle(boot).opacity) : null, app: (document.getElementById('root')?.children.length ?? 0) > 0,
      bg: getComputedStyle(boot ?? document.body).backgroundColor, t });
    if (document.querySelector(until) && !boot) done(out); else requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}), until);

test('the start screen is the first picture, stays until the app is ready, then fades into the path: no blank frame', async () => {
  const { app, w } = await launch(PLAYED);
  await w.waitForLoadState('domcontentloaded');
  // The window only shows once the page has drawn its first picture, and that picture is the start screen.
  const at = await w.evaluate(() => ({ boot: !!document.getElementById('boot'), name: document.querySelector('#boot .boot-name')?.textContent,
    beacon: !!document.querySelector('[data-testid=start-beacon]'), look: document.documentElement.dataset.look, bg: getComputedStyle(document.getElementById('boot')!).backgroundColor }));
  expect(at).toEqual({ boot: true, name: 'Cell Learning', beacon: true, look: 'night', bg: NIGHT_BG });
  const frames = await watchStart(w, '[data-testid=path-count]');
  const up = frames.filter(f => f.boot !== null), fading = up.filter(f => f.boot! < 0.999);
  console.log(`${frames.length} frames: start screen on ${up.length} (fading on ${fading.length}), app drawn from frame ${frames.findIndex(f => f.app)}`);
  expect(frames.filter(f => f.boot === null && !f.app)).toEqual([]);          // never a blank frame
  expect(fading.every(f => f.app)).toBe(true);                                // it only fades once the app is there under it
  for (let i = 1; i < up.length; i++) expect(up[i].boot!).toBeLessThanOrEqual(up[i - 1].boot! + 1e-6); // only fades out
  expect(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isVisible())).toBe(true);
  await app.close();
});

test('a slow start keeps the start screen up (in Day for a Day save) until the save has loaded', async () => {
  const { app, w } = await launch({ ...PLAYED, settings: { look: 'day' } }, { CELL_TEST_LOAD_DELAY: '2500' });
  await w.getByTestId('start-screen').waitFor();
  const t0 = Date.now();
  const frames = await watchStart(w, '[data-testid=path-count]');
  console.log(`slow start: start screen up for ${Date.now() - t0} ms more, over ${frames.length} frames`);
  expect(Date.now() - t0).toBeGreaterThan(1500);
  expect(frames.filter(f => f.boot === null && !f.app)).toEqual([]);
  expect([...new Set(frames.filter(f => f.boot !== null).map(f => f.bg))]).toEqual([DAY_BG]);
  await app.close();
});

test('the start screen fades away in 0.3 s, see-through-ness only, at 50+ fps (0.15 s with Reduce motion)', async () => {
  for (const calm of [false, true]) {
    const { app, w } = await launch({ ...PLAYED, settings: { reduceMotion: calm } }, { CELL_TEST_LOAD_DELAY: '1500' });
    await w.getByTestId('start-screen').waitFor();
    const f = await film(w, ['#boot'], async () => {}, 2300);
    const on = f.frames.map((x, i) => ({ x: x['#boot'], t: f.ts[i] })).filter(({ x }) => x && x.op < 0.999 && x.op > 0);
    const took = on.length ? on.at(-1)!.t - on[0].t : 0;
    const moved = f.frames.some(x => x['#boot'] && (x['#boot'].sx !== 1 || x['#boot'].x !== 0 || x['#boot'].y !== 0));
    console.log(`${calm ? 'calm' : 'normal'}: fading for ${took.toFixed(0)} ms over ${on.length} frames, ${f.fps.toFixed(1)} fps`);
    expect(moved).toBe(false);
    expect(took).toBeLessThan(calm ? 200 : 380);
    if (!calm) { expect(took).toBeGreaterThan(200); expect(f.fps).toBeGreaterThanOrEqual(50); }
    await expect(w.getByTestId('start-screen')).toHaveCount(0);
    await app.close();
  }
});

test('first start: the welcome by mouse, then the first lesson; the goal is saved and the welcome never comes back', async () => {
  const { app, w, dir, saved } = await launch(null);
  await w.getByTestId('welcome-page-0').waitFor();
  await expect(w.getByTestId('welcome-says')).toContainText("I'm Beacon");
  await expect(w.getByTestId('welcome-teaches')).toContainText('US LTE and 5G bands');
  await expect(w.getByTestId('tab-bar')).toHaveCount(0);                          // the welcome comes before the app's frame
  await w.getByTestId('welcome-next').click();
  await w.getByTestId('welcome-page-1').waitFor();
  await expect(w.getByTestId('welcome-goal-1')).toHaveAttribute('aria-checked', 'true'); // the default goal is picked already
  await w.getByTestId('welcome-goal-2').click();
  await expect(w.getByTestId('welcome-goal-2')).toHaveAttribute('aria-checked', 'true');
  await w.getByTestId('welcome-start').click();
  await w.getByTestId('quit').waitFor();                                         // straight into the first lesson
  await expect(w.getByTestId('lesson-screen')).toBeVisible();
  await expect.poll(() => saved().welcomed).toBe(true);
  expect(saved().settings.dailyGoal).toBe(2);
  await w.getByTestId('quit').click();
  await expect(w.getByTestId('goal-text')).toHaveText(/of 2/);
  await app.close();
  // Next time: straight to the path.
  const again = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir, CELL_SKIP_WELCOME: '' } });
  const w2 = await again.firstWindow();
  await w2.getByTestId('path-count').waitFor();
  await expect(w2.getByTestId('welcome')).toHaveCount(0);
  await again.close();
});

test('the welcome by keyboard: Enter goes on, 1-4 pick a goal, Esc goes back; "Look around first" opens the path', async () => {
  const { app, w, saved } = await launch(null);
  await w.getByTestId('welcome-page-0').waitFor();
  await w.waitForTimeout(400);
  await w.keyboard.press('Enter'); await w.getByTestId('welcome-page-1').waitFor();
  await w.keyboard.press('4');
  await expect(w.getByTestId('welcome-goal-5')).toHaveAttribute('aria-checked', 'true');
  await w.keyboard.press('Escape'); await w.getByTestId('welcome-page-0').waitFor();
  await w.keyboard.press('Enter'); await w.getByTestId('welcome-page-1').waitFor();
  await expect(w.getByTestId('welcome-goal-5')).toHaveAttribute('aria-checked', 'true'); // your pick is kept
  await w.getByTestId('welcome-look').click();
  await w.getByTestId('path-count').waitFor();
  await expect.poll(() => saved().settings.dailyGoal).toBe(5);
  expect(saved().welcomed).toBe(true);
  await app.close();
});

test('the welcome\'s pages glide sideways (transform and see-through-ness only) at 50+ fps', async () => {
  const { app, w } = await launch(null);
  await w.getByTestId('welcome-page-0').waitFor();
  await w.waitForTimeout(600);
  const page = '[data-testid=welcome-page-1]';
  const f = await film(w, [page, '[data-testid=welcome-page-0]'], () => w.getByTestId('welcome-next').click(), 900, page);
  const xs = f.of(page).filter(Boolean).map(p => p!.x);
  console.log(`page 2 x: ${xs[0]} -> ${xs.at(-1)}; ${f.fps.toFixed(1)} fps`);
  expect(xs[0]).toBeGreaterThan(xs.at(-1)!);                                     // in from the right
  expect(f.of(page).filter(Boolean).every(p => p!.sx === 1)).toBe(true);           // no growing or shrinking
  expect(f.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('a save that has played before (from before the welcome existed) never sees it', async () => {
  const { app, w } = await launch(PLAYED);
  await w.getByTestId('path-count').waitFor();
  await expect(w.getByTestId('welcome')).toHaveCount(0);
  await app.close();
});

test('the empty heatmap says what will happen and sends you to your first lesson', async () => {
  const { app, w } = await launch({ welcomed: true });
  await w.getByTestId('path-count').waitFor();
  await w.getByTestId('tab-heatmap').click();
  await expect(w.getByTestId('heat-empty')).toContainText('Nothing lit up yet');
  await w.getByTestId('heat-empty-path').click();
  await w.getByTestId('path-count').waitFor();
  await expect(w.getByTestId('tab-path')).toHaveAttribute('aria-current', /page|true/);
  await app.close();
});

test('a progress file that can\'t be opened: a kind screen, nothing written, and Try again opens the app', async () => {
  const { app, w, saved } = await launch({ ...PLAYED, game: { xp: 77 } }, { CELL_TEST_LOAD_FAIL: '1' });
  const before = JSON.stringify(saved());
  await w.getByTestId('trouble-load').waitFor();
  await expect(w.getByTestId('start-screen')).toHaveCount(0);
  await expect(w.getByTestId('trouble-load')).toContainText("I couldn't open your progress");
  await expect(w.getByTestId('trouble-beacon')).toHaveAttribute('data-face', 'oops');
  await w.getByTestId('trouble-details').locator('summary').click();
  await expect(w.getByTestId('trouble-detail')).toContainText('CELL_TEST_LOAD_FAIL');
  await w.waitForTimeout(500);
  expect(JSON.stringify(saved())).toBe(before);                                    // nothing was written over it
  await w.keyboard.press('Enter');                                                 // Try again
  await w.getByTestId('path-count').waitFor();
  await expect(w.getByTestId('xp-total')).toHaveAttribute('data-to', '77');                           // the real progress, not blanks
  await app.close();
});

test('a crash shows "Something went wrong" instead of a blank window, and Try again brings the app back', async () => {
  const { app, w } = await launch(PLAYED, { CELL_TEST_CRASH: '1' });
  await w.getByTestId('trouble-crash').waitFor();
  await expect(w.getByTestId('start-screen')).toHaveCount(0);
  await expect(w.getByTestId('trouble-crash')).toContainText('Something went wrong');
  await expect(w.getByTestId('trouble-file')).toHaveCount(0);                      // only the load screen offers the file
  await w.getByTestId('trouble-retry').click();
  await w.getByTestId('path-count').waitFor();
  await app.close();
});
