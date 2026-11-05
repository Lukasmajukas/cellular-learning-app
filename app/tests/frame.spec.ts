import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Redesign R04, tried in the real app: the app frame (top bar + bottom tabs), screens gliding into each other
// (frame rate measured), the app's own Reduce motion switch stopping the glides, and the keys 1-4, Enter and Esc.
const launch = async (progress: Record<string, number> = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  if (Object.keys(progress).length) writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};

// Clicks (or presses) something, then records an element's x, y and see-through-ness every frame for `ms`.
// The element is looked up again each frame, because the screen it belongs to only appears during the glide.
async function film(w: Page, selector: string, act: () => Promise<void>, ms = 700) {
  await w.evaluate(([sel, ms]) => {
    const out = { xs: [] as number[], ys: [] as number[], ops: [] as number[], gaps: [] as number[] };
    (window as unknown as { __film: typeof out }).__film = out;
    const t0 = performance.now(); let last = t0;
    const f = (t: number) => {
      const el = document.querySelector(sel as string);
      if (el) { const r = el.getBoundingClientRect(); out.xs.push(Math.round(r.x * 10) / 10); out.ys.push(Math.round(r.y * 10) / 10); out.ops.push(Number(getComputedStyle(el).opacity)); }
      out.gaps.push(t - last); last = t;
      if (t - t0 < (ms as number)) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [selector, ms] as const);
  await act();
  await w.waitForTimeout(ms + 100);
  const r = await w.evaluate(() => (window as unknown as { __film: { xs: number[]; ys: number[]; ops: number[]; gaps: number[] } }).__film);
  const gaps = r.gaps.slice(1);
  return { ...r, fps: 1000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length) };
}
// Frames seen strictly between where it started and where it ended up.
const between = (vs: number[], end = vs[vs.length - 1]) => vs.filter(v => Math.abs(v - end) > 1 && Math.abs(v - end) < Math.max(...vs.map(x => Math.abs(x - end)))).length;

test('switching tabs doesn\'t shift the frame sideways, even when only one tab needs a scrollbar (design review 1)', async () => {
  const { app, w } = await launch();
  // The owner's window height (960): the Review tab fits without a scrollbar there, the path doesn't. (R13 made the
  // Review tab taller than the test window's 760 px, so every tab scrolled at that size and the case was gone.)
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(480, 960));
  await w.waitForTimeout(300);
  const where = async () => ({ top: (await w.getByTestId('hud').boundingBox())!.x, tabs: (await w.getByTestId('tab-path').boundingBox())!.x,
    scrolls: await w.evaluate(() => document.documentElement.scrollHeight > innerHeight) });
  const path = await where();
  await w.getByTestId('tab-review').click(); await w.getByTestId('screen-review').waitFor();
  await w.waitForTimeout(600); // let the glide finish
  const review = await where();
  expect(path.scrolls).toBe(true); expect(review.scrolls).toBe(false); // the case that used to jump by the scrollbar's width
  expect(review.top).toBeCloseTo(path.top, 0);
  expect(review.tabs).toBeCloseTo(path.tabs, 0);
  await app.close();
});

test('the app frame: a top bar that stays put, four tabs big enough to tap, and the Review tab', async () => {
  const { app, w } = await launch();
  await expect(w.getByTestId('top-bar')).toBeVisible();
  await expect(w.getByTestId('tab-bar').getByRole('button')).toHaveCount(4);
  await expect(w.getByTestId('tab-bar')).toContainText('PathReviewHeatmapSettings');
  for (const id of ['tab-path', 'tab-review', 'tab-heatmap', 'tab-settings']) {
    const b = (await w.getByTestId(id).boundingBox())!;
    expect(b.width, id).toBeGreaterThanOrEqual(44); expect(b.height, id).toBeGreaterThanOrEqual(44);
  }
  await expect(w.getByTestId('tab-path')).toHaveAttribute('aria-current', 'page');
  // The tab bar sits on the bottom edge of the window; the top bar stays on the top edge while the path scrolls.
  const h = await w.evaluate(() => innerHeight);
  const bar = (await w.getByTestId('tab-bar').boundingBox())!;
  expect(Math.round(bar.y + bar.height)).toBe(h);
  await w.evaluate(() => window.scrollTo(0, 400));
  await w.waitForTimeout(100);
  expect(await w.evaluate(() => scrollY)).toBeGreaterThan(100);
  expect((await w.getByTestId('top-bar').boundingBox())!.y).toBe(0);
  await expect(w.getByTestId('streak')).toBeVisible();
  await expect(w.getByTestId('goal-text')).toContainText('Daily goal: 0 of 1');
  // The last lesson on the path isn't hidden behind the tab bar.
  await w.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await w.waitForTimeout(100);
  const last = (await w.locator('[data-testid^=lesson-]').last().boundingBox())!;
  expect(last.y + last.height).toBeLessThan(bar.y);
  // Review tab: nothing to review on a fresh save, so instead of a start button it offers the path (R13).
  await w.getByTestId('tab-review').click();
  await expect(w.getByTestId('review-screen')).toBeVisible();
  await expect(w.getByTestId('review-count')).toHaveText('Nothing to review yet');
  await expect(w.getByTestId('review-start')).toHaveCount(0);
  await expect(w.getByTestId('review-path')).toBeEnabled();
  await expect(w.getByTestId('tab-review')).toHaveAttribute('aria-current', 'page');
  await expect(w.getByTestId('tab-review-badge')).toHaveCount(0);
  await w.screenshot({ path: 'test-results/r04-review.png' });
  await app.close();
});

test('screens glide (50+ frames a second): tabs sideways, a lesson rises from below; the tab marker glides too', async () => {
  const { app, w } = await launch();
  const colX = (await w.getByTestId('screen-path').boundingBox())!.x;
  // Path -> Heatmap (to the right): the heatmap comes in from the right.
  const toHeat = await film(w, '[data-testid=screen-heatmap]', () => w.getByTestId('tab-heatmap').click());
  console.log(`heatmap x ${toHeat.xs.slice(0, 3)} ... ${toHeat.xs.at(-1)}, ${between(toHeat.xs)} frames in between, ${toHeat.fps.toFixed(1)} fps`);
  expect(toHeat.xs.at(-1)).toBeCloseTo(colX, 0);
  expect(Math.max(...toHeat.xs)).toBeGreaterThan(colX + 10);          // it started off to the right
  expect(between(toHeat.xs)).toBeGreaterThanOrEqual(3);               // and really moved, not jumped
  expect(Math.min(...toHeat.ops)).toBeLessThan(0.5);                  // fading in as it came
  expect(toHeat.fps).toBeGreaterThanOrEqual(50);
  // Heatmap -> Path (to the left): the path comes in from the left.
  const toPath = await film(w, '[data-testid=screen-path]', () => w.getByTestId('tab-path').click());
  expect(Math.min(...toPath.xs)).toBeLessThan(colX - 10);
  expect(toPath.fps).toBeGreaterThanOrEqual(50);
  // The marker over the tab you're on glides from tab to tab.
  const marker = await film(w, '[data-testid=tab-marker]', () => w.getByTestId('tab-settings').click(), 600);
  console.log(`tab marker x ${marker.xs[0]} -> ${marker.xs.at(-1)}, ${between(marker.xs)} frames in between`);
  expect(marker.xs.at(-1)! - marker.xs[0]).toBeGreaterThan(150);
  expect(between(marker.xs)).toBeGreaterThanOrEqual(3);
  await expect(w.getByTestId('settings')).toBeVisible();
  // A lesson rises from below and fills the window (no tabs); leaving it, the frame comes back.
  await w.getByTestId('tab-path').click(); await w.getByTestId('screen-path').waitFor();
  await w.waitForTimeout(1500); // let the lesson circles finish popping in (Playwright only clicks a thing that stands still)
  const rise = await film(w, '[data-testid=lesson-screen]', () => w.getByTestId('lesson-u1-l1').click());
  console.log(`lesson y ${rise.ys.slice(0, 3)} ... ${rise.ys.at(-1)}, ${between(rise.ys)} frames in between, ${rise.fps.toFixed(1)} fps`);
  expect(Math.max(...rise.ys)).toBeGreaterThan(rise.ys.at(-1)! + 20);
  expect(between(rise.ys)).toBeGreaterThanOrEqual(3);
  expect(rise.fps).toBeGreaterThanOrEqual(50);
  await expect(w.getByTestId('tab-bar')).toHaveCount(0);
  await w.getByTestId('quit').click();
  await expect(w.getByTestId('tab-bar')).toBeVisible();
  await expect(w.getByTestId('tab-path')).toHaveAttribute('aria-current', 'page');
  await app.close();
});

test('with the app\'s Reduce motion switch on, screens and the tab marker only fade: nothing slides', async () => {
  const { app, w } = await launch();
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-motion').check();
  // The Settings screen's resting place. Wait until it stops moving: the click above may land while it's still gliding in
  // (found in R07: read at once, it was caught at x = -21 now and then).
  let colX = NaN;
  for (let i = 0; i < 20; i++) {
    const x = (await w.getByTestId('screen-settings').boundingBox())!.x;
    if (Math.abs(x - colX) < 0.5) break;
    colX = x; await w.waitForTimeout(100);
  }
  const toHeat = await film(w, '[data-testid=screen-heatmap]', () => w.getByTestId('tab-heatmap').click(), 500);
  expect(toHeat.xs.every(x => Math.abs(x - colX) < 1), `heatmap x: ${toHeat.xs}`).toBe(true);
  const marker = await film(w, '[data-testid=tab-marker]', () => w.getByTestId('tab-path').click(), 500);
  expect(between(marker.xs), `marker x: ${marker.xs}`).toBe(0);
  await w.getByTestId('screen-path').waitFor();
  const rise = await film(w, '[data-testid=lesson-screen]', () => w.getByTestId('lesson-u1-l1').click(), 500);
  expect(new Set(rise.ys).size, `lesson y: ${rise.ys}`).toBe(1);
  await app.close();
});

test('keys: 1-4 pick an answer, Enter goes on, Esc leaves; a whole lesson without the mouse', async () => {
  const { app, w } = await launch();
  await expect(w.getByTestId('path-count')).toHaveText('0 of 7 lessons done');
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < 12; i++) {
    const done = w.getByTestId('done'), tile = w.locator('[data-pick="1"]:not([disabled])');
    await done.or(tile).first().waitFor();
    if (await done.isVisible()) break;
    // The tiles carry their number keys, 1, 2, 3...
    await expect(w.locator('[data-pick] [data-key]').first()).toHaveText('1');
    const first = await w.locator('[data-pick="1"]').getAttribute('data-testid');
    await w.keyboard.press('1');
    await expect(w.getByTestId('verdict')).toBeVisible();
    await expect(w.getByTestId(first!)).toHaveAttribute('data-state', /right|wrong/); // key 1 picked the tile numbered 1
    await w.keyboard.press('Enter');                                                   // Continue
    await expect(w.getByTestId('verdict')).toHaveCount(0);
  }
  await expect(w.getByTestId('done')).toBeVisible();
  await w.keyboard.press('Enter');                                                     // Back to the path
  await expect(w.getByTestId('path-count')).toHaveText('1 of 7 lessons done');
  // Esc leaves a lesson, and goes back to the path from another tab.
  await w.getByTestId('lesson-u1-l2').click(); await w.getByTestId('quit').waitFor();
  await w.keyboard.press('Escape');
  await expect(w.getByTestId('screen-path')).toBeVisible();
  await expect(w.getByTestId('lesson-u1-l2')).toHaveAttribute('data-status', 'current'); // left without finishing
  await w.getByTestId('tab-settings').click(); await w.getByTestId('settings').waitFor();
  await w.keyboard.press('Escape');
  await expect(w.getByTestId('tab-path')).toHaveAttribute('aria-current', 'page');
  await app.close();
});

test('keys in the other question types: Enter on a learn card, typing numbers in the box, Enter for Check after mouse clicks', async () => {
  test.setTimeout(90_000);
  const { app, w } = await launch({ 'u1-l1': 3, 'u1-l2': 3, 'u1-l3': 3, 'u2-l1': 3, 'u2-l2': 3 }); // the demo lesson (all types) is open
  await w.getByTestId('lesson-u2-l3').click();
  await w.getByTestId('learn-card').waitFor();
  await w.keyboard.press('Enter');                                                     // "Got it"
  await w.getByTestId('choice-0').waitFor();
  await w.locator('[data-testid=choice-0]').click(); await w.keyboard.press('Enter');  // mouse pick, then Enter = Continue
  await w.getByTestId('number-input').waitFor();
  await w.keyboard.type('617');                                                        // numbers go into the box, they don't pick
  await expect(w.getByTestId('number-input')).toHaveValue('617');
  await w.keyboard.press('Enter');                                                     // the box's own Check
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await w.keyboard.press('Enter');                                                     // Continue (the box is switched off now)
  await w.getByTestId('match-left-0').waitFor();
  for (let i = 0; i < 3; i++) { await w.getByTestId(`match-left-${i}`).click(); await w.getByTestId(`match-right-${i}`).click(); }
  await w.keyboard.press('Enter');                                                     // Check, although a match button has focus
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await app.close();
});
