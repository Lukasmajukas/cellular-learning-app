import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';

const launch = () => electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });

// Confetti is drawn by a background worker, so its pixels can't be read back. We count the bursts the app fired
// and check that a visible full-window canvas exists; the screenshot is looked at by eye.
const bursts = (w: import('@playwright/test').Page) => w.evaluate(() => (window as unknown as { __confettiBursts?: number }).__confettiBursts ?? 0);
const canvasBox = (w: import('@playwright/test').Page) => w.evaluate(() => {
  const c = document.querySelector('canvas'); if (!c) return null;
  const r = c.getBoundingClientRect(); return { w: r.width, h: r.height, z: getComputedStyle(c).zIndex, vis: getComputedStyle(c).visibility };
});

test('confetti really shows, even when Windows says "reduce motion"', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.emulateMedia({ reducedMotion: 'reduce' }); await w.reload(); // what Windows "animation effects: off" tells the app (read when the page loads)
  await w.getByTestId('lesson-u1-l1').click();
  await w.getByTestId('choice-0').click();
  await expect.poll(() => bursts(w), { timeout: 3000 }).toBe(1);
  await w.waitForTimeout(250);
  const box = await canvasBox(w);
  expect(box && box.w > 300 && box.h > 300 && box.vis === 'visible').toBeTruthy();
  await w.screenshot({ path: 'test-results/confetti.png' });
  await app.close();
});

test('the in-app "reduce motion" switch still turns confetti off', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-motion').check();
  await w.getByTestId('tab-path').click();
  await w.getByTestId('lesson-u1-l1').click();
  await w.getByTestId('choice-0').click();
  await w.waitForTimeout(800);
  expect(await bursts(w)).toBe(0);
  expect(await canvasBox(w)).toBeNull();
  await app.close();
});

test('animations move when Windows says "reduce motion" (this passes on the old code too, so it only guards against regressions); frame-rate badge is off by default and works when switched on', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.emulateMedia({ reducedMotion: 'reduce' }); await w.reload(); // what Windows "animation effects: off" tells the app (read when the page loads)
  await expect(w.getByTestId('fps')).toHaveCount(0);
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-fps').check();
  await w.getByTestId('tab-path').click();
  await expect(w.getByTestId('fps')).toBeVisible();
  await w.getByTestId('lesson-u1-l1').click();
  await w.getByTestId('choice-0').click();
  await w.getByTestId('next').click();
  // The 2nd question's card slides in from the side. Sample its position every frame: it must be seen off its final spot.
  const xs = await w.evaluate(() => new Promise<number[]>(res => {
    const out: number[] = []; const t0 = performance.now();
    const f = () => {
      const el = Array.from(document.querySelectorAll('[data-testid=prompt]')).find(e => e.textContent?.includes('3 sectors'));
      if (el) out.push(el.getBoundingClientRect().x);
      if (performance.now() - t0 < 1500) requestAnimationFrame(f); else res(out);
    };
    requestAnimationFrame(f);
  }));
  const final = xs[xs.length - 1];
  console.log('card positions seen:', xs.length, 'first', xs[0], 'final', final);
  expect(xs.some(x => Math.abs(x - final) > 5)).toBe(true);
  await expect(w.getByTestId('fps')).toHaveText(/\d+ fps/);
  console.log('badge:', await w.getByTestId('fps').textContent());
  await app.close();
});

test('leaving the lesson clears its confetti, so it doesn\'t fall over the path while "coming on air" plays (design review 1)', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  await expect.poll(() => canvasBox(w), { timeout: 3000 }).not.toBeNull(); // the lesson-complete burst is falling
  await w.getByTestId('finish').click();
  await w.getByTestId('screen-path').waitFor();
  await expect.poll(() => canvasBox(w), { timeout: 1000 }).toBeNull();     // gone well before it would have ended (about 3 s)
  await app.close();
});
