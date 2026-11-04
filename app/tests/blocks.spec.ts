import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Redesign R03: the building blocks, tried in the real app. Settings is built from them; they spring when pressed;
// the switch knob slides smoothly (frame rate measured); and "Reduce motion" stops all of it.
const launch = async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const openBlocks = async (w: Page) => { await w.evaluate(() => { location.hash = '#blocks'; location.reload(); }); await w.getByTestId('blocks').waitFor(); };

// Watches an element every frame for `ms` while `act` runs. Returns its x positions and the gaps between frames.
async function watch(w: Page, testId: string, act: () => Promise<void>, ms = 700) {
  await w.evaluate(([id, ms]) => {
    const out = { xs: [] as number[], gaps: [] as number[] }; (window as unknown as { __watch: typeof out }).__watch = out;
    const t0 = performance.now(); let last = t0;
    const f = (t: number) => {
      const el = document.querySelector(`[data-testid="${id}"]`);
      if (el) out.xs.push(Math.round(el.getBoundingClientRect().x * 10) / 10);
      out.gaps.push(t - last); last = t;
      if (t - t0 < (ms as number)) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [testId, ms] as const);
  await act();
  await w.waitForTimeout(ms + 100);
  return w.evaluate(() => (window as unknown as { __watch: { xs: number[]; gaps: number[] } }).__watch);
}
const scaleOf = (w: Page, testId: string) => w.getByTestId(testId).evaluate(el => {
  const m = getComputedStyle(el).transform; if (m === 'none') return 1;
  return Number(m.match(/matrix\(([^,]+)/)?.[1] ?? 1);
});

test('Settings is built from the blocks: four switches, a goal choice, big enough to click, and it all still saves', async () => {
  const { app, w } = await launch();
  await w.getByTestId('open-settings').click();
  await expect(w.getByRole('switch')).toHaveCount(4);
  await expect(w.locator('[data-testid=settings] input[type=checkbox]:not([role=switch]), [data-testid=settings] select')).toHaveCount(0);
  // Everything you click is at least 44 x 44 (DESIGN.md section 4).
  for (const id of ['settings-back', 'set-sounds', 'set-motion', 'set-fps', 'set-day', 'set-goal-1', 'set-goal-5', 'backup-now', 'show-file']) {
    const b = (await w.getByTestId(id).boundingBox())!;
    expect(b.width, id).toBeGreaterThanOrEqual(44); expect(b.height, id).toBeGreaterThanOrEqual(44);
  }
  // Clicking the words of a row flips its switch; the Space key flips it back.
  await expect(w.getByTestId('set-fps')).not.toBeChecked();
  await w.getByText('Show frame rate').click();
  await expect(w.getByTestId('set-fps')).toBeChecked();
  await w.getByTestId('set-fps').focus(); await w.keyboard.press('Space');
  await expect(w.getByTestId('set-fps')).not.toBeChecked();
  // The daily goal: a row of pills. Arrow keys move the choice too.
  await w.getByTestId('set-goal-3').click();
  await expect(w.getByTestId('set-goal-3')).toHaveAttribute('aria-checked', 'true');
  await w.keyboard.press('ArrowRight');
  await expect(w.getByTestId('set-goal-5')).toHaveAttribute('aria-checked', 'true');
  await expect(w.getByTestId('set-goal-5')).toBeFocused();
  await w.getByTestId('settings-back').click();
  await expect(w.getByTestId('goal-text')).toContainText('of 5');
  await w.screenshot({ path: 'test-results/r03-settings.png' });
  await app.close();
});

test('the switch knob slides smoothly (50+ frames a second), buttons squish when pressed, and Reduce motion stops both', async () => {
  const { app, w } = await launch();
  await w.getByTestId('open-settings').click();
  const knob = 'set-sounds-knob';
  const from = (await w.getByTestId(knob).boundingBox())!.x;
  const seen = await watch(w, knob, () => w.getByTestId('set-sounds').click());
  const to = seen.xs[seen.xs.length - 1];
  const between = seen.xs.filter(x => x < Math.max(from, to) - 1 && x > Math.min(from, to) + 1);
  const gaps = seen.gaps.slice(1), fps = 1000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length);
  console.log(`knob ${from} -> ${to}, ${between.length} frames in between, ${fps.toFixed(1)} fps`);
  expect(Math.abs(to - from)).toBeGreaterThan(15);
  expect(between.length).toBeGreaterThanOrEqual(3);      // it really moved through the middle, not jumped
  expect(fps).toBeGreaterThanOrEqual(50);
  // A press squishes the back button (scale below 1 while the mouse is down), and it springs back after.
  await expect(w.getByTestId('settings')).toBeVisible();
  const back = (await w.getByTestId('settings-back').boundingBox())!;
  await w.mouse.move(back.x + 22, back.y + 22); await w.mouse.down(); await w.waitForTimeout(250);
  const pressed = await scaleOf(w, 'settings-back');
  await w.mouse.move(5, 500); await w.mouse.up(); await w.waitForTimeout(500); // slide off before letting go, so it's not a click
  console.log('back button scale while pressed:', pressed);
  expect(pressed).toBeLessThan(0.97);
  expect(await scaleOf(w, 'settings-back')).toBeCloseTo(1, 2);

  // Now with the app's own Reduce motion switch on: the knob jumps (no in-between frames) and nothing squishes.
  await w.getByTestId('set-motion').check();
  const still = await watch(w, knob, () => w.getByTestId('set-sounds').click(), 500);
  const a = still.xs[0], b = still.xs[still.xs.length - 1];
  expect(Math.abs(b - a)).toBeGreaterThan(15);
  expect(still.xs.filter(x => x < Math.max(a, b) - 1 && x > Math.min(a, b) + 1)).toEqual([]);
  await w.mouse.move(back.x + 22, back.y + 22); await w.mouse.down(); await w.waitForTimeout(250);
  expect(await scaleOf(w, 'settings-back')).toBe(1);
  await w.mouse.move(5, 500); await w.mouse.up();
  await app.close();
});

test('the blocks page shows every block; the sheet slides up, and the tiles never use colour alone', async () => {
  const { app, w } = await launch();
  await openBlocks(w);
  for (const id of ['block-button-signal', 'block-pill', 'block-choice', 'block-switch', 'block-progress', 'block-tile-idle', 'block-bubble'])
    await expect(w.getByTestId(id)).toBeVisible();
  // Right and wrong tiles carry a tick / cross icon with words for screen readers, and the right one glows.
  await expect(w.getByTestId('block-tile-right').getByRole('img', { name: 'right answer' })).toBeVisible();
  await expect(w.getByTestId('block-tile-wrong').getByRole('img', { name: 'your pick, not right' })).toBeVisible();
  await expect(w.getByTestId('block-tile-right').locator('[data-glow]')).toHaveCount(1);
  // The progress bar fills by sliding, not by changing width.
  await w.getByTestId('block-progress-more').click();
  await expect(w.getByTestId('block-progress')).toHaveAttribute('data-value', '67');
  // The bottom sheet slides up from below the window.
  const h = await w.evaluate(() => innerHeight);
  const ys = await w.evaluate(() => new Promise<number[]>(res => {
    const out: number[] = []; const t0 = performance.now();
    (document.querySelector('[data-testid=block-sheet-wrong]') as HTMLElement).click();
    const f = () => { const el = document.querySelector('[data-testid=block-sheet]'); if (el) out.push(el.getBoundingClientRect().y);
      if (performance.now() - t0 < 700) requestAnimationFrame(f); else res(out); };
    requestAnimationFrame(f);
  }));
  const final = ys[ys.length - 1];
  console.log('sheet top seen at', ys.slice(0, 4), '... final', final, 'window', h);
  expect(final).toBeLessThan(h - 100);
  expect(ys.some(y => y > final + 40)).toBe(true);
  await expect(w.getByTestId('block-sheet-title')).toHaveText('Not quite');
  await w.screenshot({ path: 'test-results/r03-blocks.png' });
  await w.getByTestId('block-sheet-close').click();
  await expect(w.getByTestId('block-sheet')).toHaveCount(0);
  // With the page's Reduce motion switch on, the sheet appears without sliding.
  await w.getByTestId('block-reduce').check();
  await w.getByTestId('block-sheet-right').click();
  await w.waitForTimeout(30);
  expect((await w.getByTestId('block-sheet').boundingBox())!.y).toBeLessThan(h - 100);
  await app.close();
});
