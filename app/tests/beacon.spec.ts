import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R17: Beacon, the new mascot, tried in the real app (replaces T45's mascot test). Its six faces stay inside their
// box; the rings breathe around the head (not off to one side: the T45 lesson); it blinks; it cheers smoothly (frame rate);
// it reacts to an answer within 0.1 s; and with "Reduce motion" (or a hidden window) nothing moves.
const launch = async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const openBlocks = async (w: Page) => {
  await w.evaluate(() => { location.hash = '#blocks'; location.reload(); });
  await w.getByTestId('block-beacon-card').waitFor();
  await w.getByTestId('block-beacon-card').evaluate(el => el.scrollIntoView({ block: 'start' }));
};
const DEMO = '[data-testid=block-beacon-demo]';
const part = (p: string, of = DEMO) => `${of} [data-part=${p}]`;

// Where the parts are right now: every part's box inside the drawing's box, and the rings' centre against the head's.
const measure = (w: Page, beacon: string) => w.evaluate(sel => {
  const svg = document.querySelector(sel)!, box = svg.getBoundingClientRect();
  const r = (p: string) => svg.querySelector(`[data-part=${p}]`)?.getBoundingClientRect();
  const head = r('face-disc')!, rings = r('rings')!;
  const parts = ['tower', 'face-disc', 'face', 'eyes', 'drop', 'dots', 'z'].map(r).filter(Boolean) as DOMRect[];
  return {
    inside: parts.every(b => b.left >= box.left - 0.5 && b.right <= box.right + 0.5 && b.top >= box.top - 0.5 && b.bottom <= box.bottom + 0.5),
    off: Math.hypot(rings.x + rings.width / 2 - (head.x + head.width / 2), rings.y + rings.height / 2 - (head.y + head.height / 2)),
    ringW: rings.width, boxW: box.width,
  };
}, beacon);

test('all six faces are drawn, each one different, and every part stays inside Beacon\'s box', async () => {
  const { app, w } = await launch();
  await openBlocks(w);
  const looks = new Set<string>();
  for (const f of ['idle', 'happy', 'oops', 'thinking', 'cheering', 'sleepy']) {
    const b = w.getByTestId(`block-beacon-${f}`);
    await expect(b).toBeVisible();
    await expect(b).toHaveAttribute('data-face', f);
    await expect(b).toHaveAttribute('aria-label', /^Beacon, /);
    await expect(b).toHaveAttribute('data-looping', 'false'); // the row of examples stands still
    const m = await measure(w, `[data-testid=block-beacon-${f}]`);
    expect(m.inside, f).toBe(true);
    expect(m.off, f).toBeLessThan(0.5);
    looks.add(await b.locator('[data-part=face]').innerHTML());
  }
  expect(looks.size).toBe(6);
  // The extras that tell some faces apart.
  await expect(w.locator(part('dots', '[data-testid=block-beacon-thinking]'))).toHaveCount(1);
  await expect(w.locator(part('z', '[data-testid=block-beacon-sleepy]'))).toHaveCount(1);
  await expect(w.locator(part('drop', '[data-testid=block-beacon-oops]'))).toHaveCount(1);
  await w.getByTestId('block-beacon-card').screenshot({ path: 'test-results/beacon-faces.png' });
  await app.close();
});

test('the rings breathe around the head (never off to one side) and Beacon blinks within 7 s', async () => {
  const { app, w } = await launch();
  await openBlocks(w);
  await expect(w.locator(DEMO)).toHaveAttribute('data-looping', 'true');
  // The T45 lesson: a part that turns or grows must do it about its own centre. Checked while the rings breathe.
  const widths: number[] = [];
  for (let i = 0; i < 12; i++) {
    const m = await measure(w, DEMO);
    expect(m.inside).toBe(true);
    expect(m.off).toBeLessThan(1);
    widths.push(m.ringW);
    await w.waitForTimeout(200);
  }
  expect(Math.max(...widths) / Math.min(...widths)).toBeGreaterThan(1.02); // they really breathe ...
  expect(Math.max(...widths) / Math.min(...widths)).toBeLessThan(1.1);     // ... softly
  // The blink: the eyes squeeze to about 10% of their height for a moment, every 4-7 s. Watched for 7.4 s.
  const r = await film(w, [part('eyes')], async () => {}, 7400);
  const sy = r.of(part('eyes')).map(f => f?.sy ?? 1);
  expect(Math.min(...sy)).toBeLessThan(0.5);
  // ... and opens again after it. (Not "open in the last frame": a second blink can start just as the 7.4 s end, I10.)
  expect(Math.max(...sy.slice(sy.findIndex(v => v < 0.5)))).toBeGreaterThan(0.9);
  console.log(`  blink: eyes down to ${Math.min(...sy).toFixed(2)} of their height; ${r.fps.toFixed(1)} fps while breathing`);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('cheering: the head hops three times and two rings burst out, then it rests; happy sends one ring (50+ fps)', async () => {
  const { app, w } = await launch();
  await openBlocks(w);
  const before = await w.locator(part('face-disc')).evaluate(el => el.getBoundingClientRect().y);
  const r = await film(w, [part('face-disc'), part('burst'), part('tower')], () => w.getByTestId('block-beacon-set-cheering').click(), 1700);
  await expect(w.locator(DEMO)).toHaveAttribute('data-face', 'cheering');
  const ys = r.of(part('face-disc')).map(f => f!.y), towerYs = r.of(part('tower')).map(f => f!.y);
  const lift = before - Math.min(...ys);
  const box = await measure(w, DEMO);
  console.log(`  cheer: head up ${lift.toFixed(1)} px (Beacon is ${box.boxW.toFixed(0)} px wide), ${r.fps.toFixed(1)} fps`);
  expect(lift).toBeGreaterThan(3);              // it really hops ...
  expect(lift).toBeLessThan(box.boxW);          // ... never farther than its own width
  expect(Math.abs(ys.at(-1)! - before)).toBeLessThan(0.3); // ... and lands where it started
  expect(Math.max(...towerYs) - Math.min(...towerYs)).toBe(0); // the tower stays put
  // Three hops: the head goes up and comes back down three times.
  let hops = 0; for (let i = 1; i < ys.length; i++) if (ys[i - 1] < before - 0.5 && ys[i] >= before - 0.5) hops++;
  expect(hops).toBeGreaterThanOrEqual(2); // the last, smallest hop is about 1 px, so it may not cross the line
  const burst = r.of(part('burst')).map(f => f?.op ?? 0);
  expect(Math.max(...burst)).toBeGreaterThan(0.5); expect(burst.at(-1)).toBeLessThan(0.05);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  expect(box.inside).toBe(true);
  // Happy: one ring pulses out of the head and fades.
  const h = await film(w, [part('pulse')], () => w.getByTestId('block-beacon-set-happy').click(), 900);
  const pulse = h.of(part('pulse')).map(f => f?.op ?? 0);
  expect(Math.max(...pulse)).toBeGreaterThan(0.5); expect(pulse.at(-1)).toBeLessThan(0.05);
  await w.getByTestId('block-beacon-card').screenshot({ path: 'test-results/beacon-happy.png' });
  await app.close();
});

test('with Reduce motion (or the window hidden) Beacon stands still; the face still changes', async () => {
  const { app, w } = await launch();
  await openBlocks(w);
  // A hidden window pauses the loops (DESIGN.md section 7). Hiding the real window doesn't change the page's visibility on
  // the cloud's pretend screen (tried in R17), so the page is told "hidden" the way Chromium tells it, then "visible" again.
  const seen = (state: string) => w.evaluate(s => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => s });
    document.dispatchEvent(new Event('visibilitychange'));
  }, state);
  await seen('hidden');
  await expect(w.locator(DEMO)).toHaveAttribute('data-looping', 'false');
  await seen('visible');
  await expect(w.locator(DEMO)).toHaveAttribute('data-looping', 'true');
  // Reduce motion (this page's own switch).
  await w.getByTestId('block-reduce').evaluate(el => el.scrollIntoView({ block: 'center' }));
  await w.getByTestId('block-reduce').click();
  await w.getByTestId('block-beacon-card').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await expect(w.locator(DEMO)).toHaveAttribute('data-looping', 'false');
  const sels = [part('rings'), part('eyes'), part('face-disc'), part('burst'), part('pulse')];
  const r = await film(w, sels, async () => {
    await w.getByTestId('block-beacon-set-cheering').click();
    await w.waitForTimeout(600);
    await w.getByTestId('block-beacon-set-happy').click();
  }, 1500);
  await expect(w.locator(DEMO)).toHaveAttribute('data-face', 'happy');
  for (const s of sels) {
    const fr = r.of(s).filter(Boolean).map(f => f!);
    expect(new Set(fr.map(f => `${f.sx},${f.sy}`)).size, s).toBe(1);
    if (s !== part('eyes')) expect(new Set(fr.map(f => f.y)).size, s).toBe(1); // (the eyes' box changes with the face: a new drawing, not a move)
  }
  expect(Math.max(...r.of(part('burst')).map(f => f?.op ?? 0))).toBe(0);
  expect(Math.max(...r.of(part('pulse')).map(f => f?.op ?? 0))).toBe(0);
  await app.close();
});

test('in a lesson Beacon reacts within 0.1 s of an answer, and cheers (bigger) when the lesson is done', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const b = w.getByTestId('beacon');
  await expect(b).toHaveAttribute('data-face', 'idle');
  // Time from the click to the new face, measured inside the page.
  await w.evaluate(() => {
    const st = (window as unknown as { __react: { click: number; face: number; to: string } }).__react = { click: 0, face: 0, to: '' };
    document.addEventListener('click', () => { st.click = performance.now(); }, { capture: true, once: true });
    new MutationObserver((_, o) => { st.face = performance.now(); st.to = document.querySelector('[data-testid=beacon]')!.getAttribute('data-face')!; o.disconnect(); })
      .observe(document.querySelector('[data-testid=beacon]')!, { attributes: true, attributeFilter: ['data-face'] });
  });
  await w.locator('[data-testid=choice-0]:not([disabled])').click();
  await w.getByTestId('next').waitFor();
  const st = await w.evaluate(() => (window as unknown as { __react: { click: number; face: number; to: string } }).__react);
  console.log(`  Beacon turned "${st.to}" ${(st.face - st.click).toFixed(0)} ms after the click`);
  expect(['happy', 'oops']).toContain(st.to);
  expect(st.face - st.click).toBeGreaterThanOrEqual(0);
  expect(st.face - st.click).toBeLessThan(100);
  const small = (await b.boundingBox())!.width;
  // Play to the end.
  await w.getByTestId('next').click();
  for (let i = 0; i < 12; i++) {
    const done = w.getByTestId('done'), choice = w.locator('[data-testid=choice-0]:not([disabled])');
    await done.or(choice).first().waitFor();
    if (await done.isVisible()) break;
    await choice.click(); await w.getByTestId('next').click();
  }
  await expect(b).toHaveAttribute('data-face', 'cheering');
  // Since R12 (idea I34) the big Beacon grows in from the question size with a spring, so wait for it to finish growing
  // (the Windows build once caught it mid-grow, at 86.9 px).
  await expect.poll(async () => (await b.boundingBox())!.width, { timeout: 2000 }).toBeGreaterThan(small * 1.5);
  await app.close();
});
