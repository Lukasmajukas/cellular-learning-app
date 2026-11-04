import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';

const launch = () => electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });

// The lesson-complete "signal burst" (R12) replaced the confetti, which was drawn on a canvas by a background worker and
// never showed on the owner's Windows PC (T46, T57). The burst is drawn in the page, so its pieces can be measured.
const bursts = (w: import('@playwright/test').Page) => w.evaluate(() => (window as unknown as { __signalBursts?: number }).__signalBursts ?? 0);
// The burst's first ring, every frame for a second: how see-through it is and how big it has grown.
const ringFrames = (w: import('@playwright/test').Page) => w.evaluate(() => new Promise<{ op: number; sx: number }[]>(res => {
  const out: { op: number; sx: number }[] = []; const t0 = performance.now();
  const f = () => {
    const el = document.querySelector('[data-ring="0"]');
    if (el) { const cs = getComputedStyle(el), m = cs.transform === 'none' ? new DOMMatrix() : new DOMMatrix(cs.transform); out.push({ op: Number(cs.opacity), sx: Math.hypot(m.a, m.b) }); }
    if (performance.now() - t0 < 1000) requestAnimationFrame(f); else res(out);
  };
  requestAnimationFrame(f);
}));

test('the signal burst really shows, even when Windows says "reduce motion"', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.emulateMedia({ reducedMotion: 'reduce' }); await w.reload(); // what Windows "animation effects: off" tells the app (read when the page loads)
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  const ring = await ringFrames(w);
  await expect.poll(() => bursts(w), { timeout: 3000 }).toBe(1);
  console.log(`  ring frames ${ring.length}; up to op ${Math.max(...ring.map(f => f.op)).toFixed(2)}, scale ${Math.max(...ring.map(f => f.sx)).toFixed(2)}`);
  expect(Math.max(...ring.map(f => f.op)), 'the ring is seen').toBeGreaterThan(0.5);
  expect(Math.max(...ring.map(f => f.sx)), 'and it spreads out').toBeGreaterThan(1.5);
  await w.screenshot({ path: 'test-results/burst-after.png' });
  await app.close();
});

test('the in-app "reduce motion" switch still turns the burst off', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-motion').check();
  await w.getByTestId('tab-path').click();
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  await w.waitForTimeout(800);
  expect(await bursts(w)).toBe(0);
  await expect(w.locator('[data-testid=signal-burst]')).toHaveCount(0);
  await expect(w.locator('canvas')).toHaveCount(0);
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

test('leaving the lesson clears its burst, so it doesn\'t play over the path while "coming on air" plays (design review 1)', async () => {
  const app = await launch(); const w = await app.firstWindow();
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  await expect(w.locator('[data-testid=signal-burst]')).toHaveCount(1);        // the lesson-complete burst is playing
  await w.getByTestId('finish').click();
  await w.getByTestId('screen-path').waitFor();
  await expect.poll(() => w.locator('[data-testid=signal-burst]').count(), { timeout: 1000 }).toBe(0);
  await app.close();
});
