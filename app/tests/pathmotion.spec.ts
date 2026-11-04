import { _electron as electron, test, expect, type Page, type ElectronApplication } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';

// Redesign R06, tried in the real app: the path map moves. Circles pop in as they scroll into view (once per app start),
// the current lesson's rings breathe, and finishing a lesson plays "coming on air" (turns green with a ring burst, the
// line draws itself, the next lock flies off), plus a moment when a whole unit is done. Frame rate measured; Reduce motion stops it all.
const launch = async (progress: Record<string, number> = {}, opts: { sample?: boolean; calm?: boolean; size?: { w: number; h: number } } = {}) => {
  const { sample = true, calm = false, size = { w: 620, h: 960 } } = opts;
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress, settings: { reduceMotion: calm, sounds: false } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: sample ? '1' : '', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  await resize(app, size);
  await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const resize = (app: ElectronApplication, s: { w: number; h: number }) =>
  app.evaluate(({ BrowserWindow }, s) => BrowserWindow.getAllWindows()[0].setContentSize(s.w, s.h), s);

type Frame = Record<string, { op: number; sx: number; sy: number; y: number } | null>;
// Records, every frame for `ms`, each selector's own see-through-ness (op), its scale (x and y, from its transform) and
// its top edge. Elements are looked up again each frame, because some only appear during the movement.
// The frame rate (fps) counts only the frames of the movement itself: from the first frame where `from` is on the page
// (when given), leaving out the gap that frame closes (building the new screen is a one-time cost, not the animation)
// and any gap during a test screenshot taken with snap() (the test pausing the page, not the app being slow; found on
// the Windows build in R06). The slowest gaps are printed, so a slow run shows where the time went.
async function film(w: Page, sels: string[], act: () => Promise<void>, ms = 1900, from?: string) {
  await w.evaluate(([sels, ms]) => {
    const out = { frames: [] as Frame[], gaps: [] as number[], ts: [] as number[], pauses: [] as [number, number][] };
    (window as unknown as { __film: typeof out }).__film = out;
    const t0 = performance.now(); let last = t0;
    const f = (t: number) => {
      const fr: Frame = {};
      for (const s of sels as string[]) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (!el) { fr[s] = null; continue; }
        const cs = getComputedStyle(el), m = cs.transform === 'none' ? new DOMMatrix() : new DOMMatrix(cs.transform);
        fr[s] = { op: Math.round(Number(cs.opacity) * 1000) / 1000, sx: Math.round(Math.hypot(m.a, m.b) * 1000) / 1000, sy: Math.round(Math.hypot(m.c, m.d) * 1000) / 1000, y: Math.round(el.getBoundingClientRect().y * 10) / 10 };
      }
      out.frames.push(fr); out.gaps.push(t - last); out.ts.push(t); last = t;
      if (t - t0 < (ms as number)) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [sels, ms] as const);
  await act();
  await w.waitForTimeout(ms + 150);
  const r = await w.evaluate(() => (window as unknown as { __film: { frames: Frame[]; gaps: number[]; ts: number[]; pauses: [number, number][] } }).__film);
  const start = from ? Math.max(1, r.frames.findIndex(f => f[from])) : 0;
  const gaps = r.gaps.map((g, i) => ({ g, i })).filter(({ g, i }) => i > start &&
    !r.pauses.some(([a, b]) => r.ts[i] - g < b && r.ts[i] > a)).map(x => x.g);
  const of = (s: string) => r.frames.map(f => f[s]);
  console.log(`  slowest frames (ms): ${[...gaps].sort((a, b) => b - a).slice(0, 3).map(g => g.toFixed(0)).join(', ')}; ${r.pauses.length} screenshot pause(s) left out`);
  return { ...r, of, fps: 1000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length) };
}
// A screenshot during a film: the page is paused while it's taken, so film() leaves that time out of the frame rate.
async function snap(w: Page, path?: string) {
  const a = await w.evaluate(() => performance.now());
  const png = await w.screenshot(path ? { path } : {});
  await w.evaluate(a => { const b = performance.now(); (window as unknown as { __film: { pauses: [number, number][] } }).__film.pauses.push([a, b]); }, a);
  return png;
}
const distinct = (xs: (number | undefined)[]) => new Set(xs.filter(x => x !== undefined)).size;

// Finishes the sample lesson that's open, then presses "Continue" back to the path.
async function finishLesson(w: Page, id: string) {
  await w.getByTestId(`lesson-${id}`).click();
  await playSampleLesson(w);
}

test('circles pop in as they scroll into view, and only once: coming back to the path, they are simply there', async () => {
  const { app, w } = await launch({}, { sample: false });
  await w.waitForTimeout(1500);
  // The first lessons are on screen and have popped in; one far down the path is still waiting, unseen.
  await expect(w.getByTestId('pop-unit01-l1')).toHaveAttribute('data-pop', 'in');
  await expect(w.getByTestId('pop-unit05-l2')).toHaveAttribute('data-pop', 'waiting');
  expect(await w.getByTestId('pop-unit05-l2').evaluate(el => Number(getComputedStyle(el).opacity))).toBe(0);
  // Scroll it into view: it pops in (grows and fades in, with a little overshoot from the bouncy spring), at 50+ frames a second.
  const sel = '[data-testid=pop-unit05-l2]';
  const f = await film(w, [sel], () => w.getByTestId('row-unit05-l2').evaluate(el => el.scrollIntoView({ block: 'center' })), 1000);
  const sc = f.of(sel).map(x => x?.sx);
  console.log(`pop-in scale ${sc.slice(0, 4)} ... max ${Math.max(...sc.map(Number))} ... ${sc.at(-1)}, ${f.fps.toFixed(1)} fps`);
  expect(Math.min(...sc.map(Number))).toBeLessThan(0.75);
  expect(Math.max(...sc.map(Number))).toBeGreaterThan(1);      // the bounce
  expect(sc.at(-1)).toBeCloseTo(1, 1);
  expect(distinct(sc)).toBeGreaterThan(8);                      // really moving, not a jump
  expect(f.fps).toBeGreaterThanOrEqual(50);
  // Settings and back: every circle you saw is just there (no second pop-in), and the path still opens at your lesson.
  await w.getByTestId('tab-settings').click(); await w.getByTestId('screen-settings').waitFor();
  await w.getByTestId('tab-path').click(); await w.getByTestId('screen-path').waitFor();
  for (const id of ['unit01-l1', 'unit01-l2', 'unit05-l2']) await expect(w.getByTestId(`pop-${id}`)).toHaveAttribute('data-pop', 'still');
  await app.close();
});

test('the current lesson\'s rings breathe (one soft loop, 50+ fps); they stop while the window is hidden', async () => {
  const { app, w } = await launch({ 'u1-l1': 3 });
  await w.waitForTimeout(1500);
  const breath = w.getByTestId('row-u1-l2').getByTestId('lesson-breath');
  await expect(breath).toHaveAttribute('data-breathing', 'true');
  await expect(w.locator('[data-breathing=true]')).toHaveCount(1); // only one background loop on the screen
  const sel = '[data-testid=row-u1-l2] [data-testid=lesson-breath]';
  const f = await film(w, [sel], async () => {}, 2600);
  const ops = f.of(sel).map(x => x!.op), sc = f.of(sel).map(x => x!.sx);
  console.log(`breathing: see-through ${Math.min(...ops)}-${Math.max(...ops)}, scale ${Math.min(...sc)}-${Math.max(...sc)}, ${f.fps.toFixed(1)} fps`);
  expect(Math.min(...ops)).toBeLessThan(0.7); expect(Math.max(...ops)).toBeGreaterThan(0.95);
  expect(Math.max(...sc)).toBeGreaterThan(1.04); expect(Math.max(...sc)).toBeLessThanOrEqual(1.1);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  // The window is hidden (minimised): the loop stops. Shown again: it carries on.
  const setHidden = (hidden: boolean) => w.evaluate(h => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (h ? 'hidden' : 'visible') });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
  await setHidden(true);
  await expect(breath).toHaveAttribute('data-breathing', 'false');
  await setHidden(false);
  await expect(breath).toHaveAttribute('data-breathing', 'true');
  await app.close();
});

test('coming on air: the finished circle turns green with a ring burst, the line draws itself, the next lock flies off (50+ fps)', async () => {
  const { app, w } = await launch({ 'u1-l1': 3 });
  await w.waitForTimeout(1500);
  await finishLesson(w, 'u1-l2');
  const S = { ghost: '[data-testid=on-air-ghost]', ring: '[data-testid=on-air-ring]', draw: '[data-testid=line-draw-u1-l3]',
    lock: '[data-testid=lock-off]', next: '[data-testid=pop-u1-l3]', check: '[data-testid=row-u1-l2] [data-testid=lesson-check]' };
  const shots: Buffer[] = [];
  const f = await film(w, Object.values(S), async () => {
    await w.getByTestId('finish').click();
    for (const t of [250, 300, 300, 300, 300]) { await w.waitForTimeout(t); shots.push(await snap(w)); } // a flip book, looked at by eye
  }, 2600, S.ghost);
  shots.forEach((b, i) => writeFileSync(`test-results/on-air-${i}.png`, b));
  const seen = (s: string) => f.of(s).filter(x => x !== null) as { op: number; sx: number; sy: number; y: number }[];
  // 1. The blue "current" disc fades and shrinks away over the new green one; the check badge pops on.
  const ghost = seen(S.ghost).map(x => x.op);
  console.log(`ghost ${ghost.slice(0, 3)} ... ${ghost.at(-1)}; ${distinct(ghost)} steps`);
  expect(ghost[0]).toBeGreaterThan(0.9); expect(ghost.at(-1)).toBeLessThan(0.05); expect(distinct(ghost)).toBeGreaterThan(6);
  const check = seen(S.check).map(x => x.sx);
  expect(check[0]).toBeLessThan(0.2); expect(check.at(-1)).toBeCloseTo(1, 1);
  // 2. The ring burst spreads out (gets about twice as big) and fades.
  const ring = seen(S.ring);
  expect(Math.max(...ring.map(x => x.sx))).toBeGreaterThan(1.8); expect(ring.at(-1)!.op).toBeLessThan(0.05);
  // 3. The line to the next lesson draws itself: its mask grows along the curve over several frames, then goes away.
  expect(seen(S.draw).length).toBeGreaterThan(8);
  expect(f.of(S.draw).at(-1)).toBeNull();
  await expect(w.getByTestId('line-to-u1-l3')).toHaveAttribute('data-drawing', 'false');
  await expect(w.getByTestId('line-to-u1-l3')).toHaveAttribute('data-reached', 'true');
  // 4. The lock flies up and fades; the next circle pops up from nothing to full size, as the current lesson.
  const lock = seen(S.lock);
  expect(lock.at(-1)!.y).toBeLessThan(lock[0].y - 20); expect(lock.at(-1)!.op).toBeLessThan(0.05);
  const next = seen(S.next).map(x => x.sx);
  expect(next[0]).toBeLessThan(0.1); expect(Math.max(...next)).toBeGreaterThan(1); expect(next.at(-1)).toBeCloseTo(1, 1);
  await expect(w.getByTestId('lesson-u1-l3')).toHaveAttribute('data-status', 'current');
  await expect(w.getByTestId('lesson-u1-l2')).toHaveAttribute('data-status', 'done');
  console.log(`coming on air: ${f.fps.toFixed(1)} fps`);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  // It all fits in the celebration time (1.6 s): by the end of the film every extra layer is invisible.
  for (const s of [S.ghost, S.ring, S.lock]) expect(await w.locator(s).first().evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(0.05);
  // Both circles were on screen for it.
  const vis = async (id: string) => { const b = (await w.getByTestId(id).boundingBox())!, h = await w.evaluate(() => innerHeight); return b.y > 50 && b.y + b.height < h - 68; };
  expect(await vis('lesson-u1-l2')).toBe(true); expect(await vis('lesson-u1-l3')).toBe(true);
  await app.close();
});

test('finishing a whole unit: a wave of rings up the unit, the banner\'s "done" pops on, the next unit\'s bar draws itself', async () => {
  const { app, w } = await launch({ 'u1-l1': 3, 'u1-l2': 2 });
  await w.waitForTimeout(1500);
  await finishLesson(w, 'u1-l3');
  const S = { w1: '[data-testid=row-u1-l1] [data-testid=wave-ring]', w2: '[data-testid=row-u1-l2] [data-testid=wave-ring]',
    done: '[data-testid=banner-u1] [data-testid=banner-done]', sweep: '[data-testid=banner-sweep]', bar: '[data-testid=banner-u2] [data-testid=banner-bar]' };
  const f = await film(w, Object.values(S), async () => {
    await w.getByTestId('finish').click();
    await w.waitForTimeout(1100); await snap(w, 'test-results/unit-done.png');
  }, 2600, S.bar);

  const seen = (s: string) => f.of(s).filter(x => x !== null) as { op: number; sx: number; sy: number; y: number }[];
  await expect(w.getByTestId('banner-u1')).toHaveAttribute('data-moment', 'done');
  await expect(w.getByTestId('banner-u2')).toHaveAttribute('data-moment', 'opened');
  // The wave goes up the unit: lesson 2's ring starts growing before lesson 1's.
  const start = (s: string) => seen(s).findIndex(x => x.sx > 1.05);
  expect(start(S.w2)).toBeGreaterThan(0); expect(start(S.w1)).toBeGreaterThan(start(S.w2));
  expect(seen(S.done)[0].sx).toBeLessThan(0.2); expect(seen(S.done).at(-1)!.sx).toBeCloseTo(1, 1);
  expect(seen(S.sweep).length).toBeGreaterThan(8);
  const bar = seen(S.bar).map(x => x.sy);
  expect(bar[0]).toBeLessThan(0.1); expect(bar.at(-1)).toBeCloseTo(1, 1); expect(distinct(bar)).toBeGreaterThan(6);
  // The whole short unit, its banner and the next lesson all fit on screen, so all of it is framed.
  const top = (await w.getByTestId('top-bar').boundingBox())!, h = await w.evaluate(() => innerHeight);
  expect((await w.getByTestId('banner-u1').boundingBox())!.y).toBeGreaterThanOrEqual(top.y + top.height);
  const next = (await w.getByTestId('lesson-u2-l1').boundingBox())!; expect(next.y + next.height).toBeLessThanOrEqual(h - 68);
  console.log(`unit done: ${f.fps.toFixed(1)} fps`);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('replaying a finished lesson: no coming on air (nothing new came on air)', async () => {
  const { app, w } = await launch({ 'u1-l1': 1 });
  await w.waitForTimeout(1500);
  await finishLesson(w, 'u1-l1');
  await w.getByTestId('finish').click();
  await w.getByTestId('screen-path').waitFor();
  for (const id of ['on-air-ghost', 'on-air-ring', 'lock-off', 'wave-ring', 'banner-sweep']) await expect(w.getByTestId(id)).toHaveCount(0);
  await app.close();
});

test('with Reduce motion: no pop-ins, no breathing, no coming on air; everything is simply in its new place', async () => {
  const { app, w } = await launch({ 'u1-l1': 3 }, { calm: true });
  await w.waitForTimeout(300);
  for (const id of ['u1-l1', 'u1-l2', 'u2-l4']) await expect(w.getByTestId(`pop-${id}`)).toHaveAttribute('data-pop', 'still');
  await expect(w.getByTestId('lesson-breath')).toHaveAttribute('data-breathing', 'false');
  const sel = '[data-testid=lesson-breath]';
  const still = await film(w, [sel], async () => {}, 600);
  expect(distinct(still.of(sel).map(x => x?.op))).toBe(1);
  await finishLesson(w, 'u1-l2');
  const f = await film(w, ['[data-testid=on-air-ghost]', '[data-testid=lock-off]', '[data-testid=on-air-ring]', '[data-testid=line-draw-u1-l3]'],
    () => w.getByTestId('finish').click(), 1200);
  for (const fr of f.frames) expect(Object.values(fr).every(x => x === null)).toBe(true);
  await expect(w.getByTestId('lesson-u1-l3')).toHaveAttribute('data-status', 'current');
  await expect(w.getByTestId('line-to-u1-l3')).toHaveAttribute('data-drawing', 'false');
  await app.close();
});
