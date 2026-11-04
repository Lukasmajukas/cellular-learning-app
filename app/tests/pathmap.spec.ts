import { _electron as electron, test, expect, type Page, type ElectronApplication } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';

// Redesign R05, tried in the real app: the path map's new layout. Unit banners, lesson circles zig-zagging with their
// names beside them, the dotted signal line, the done / current / locked looks, and the path opening at your current lesson.
const launch = async (progress: Record<string, number> = {}, sample = true, size = { w: 620, h: 960 }) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  if (Object.keys(progress).length) writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: sample ? '1' : '', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  await resize(app, size);
  await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const resize = (app: ElectronApplication, s: { w: number; h: number }) =>
  app.evaluate(({ BrowserWindow }, s) => BrowserWindow.getAllWindows()[0].setContentSize(s.w, s.h), s);
const box = async (w: Page, id: string) => (await w.getByTestId(id).boundingBox())!;
const mid = (b: { x: number; y: number; width: number; height: number }) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
// Is it inside the part of the window you can see (between the top bar and the tab bar)?
async function onScreen(w: Page, id: string) {
  const b = await box(w, id), top = (await box(w, 'top-bar')).height, tabs = await box(w, 'tab-bar');
  return b.y >= top && b.y + b.height <= tabs.y;
}
// The real path: unit 1 and lessons 1-2 of unit 2 done, so the current lesson (unit02-l3) is far down the page.
const FAR = { 'unit01-l1': 3, 'unit01-l2': 3, 'unit01-l3': 2, 'unit01-l4': 1, 'unit01-check': 2, 'unit02-l1': 3, 'unit02-l2': 1 };

test('unit banners: "Unit N", the name, lessons done, and a colour plus a word for where you are', async () => {
  const { app, w } = await launch({ 'u1-l1': 3, 'u1-l2': 2, 'u1-l3': 1 });
  const b1 = w.getByTestId('banner-u1'), b2 = w.getByTestId('banner-u2');
  await expect(b1).toContainText('Unit 1'); await expect(b1).toContainText('Sample unit A: the basics'); await expect(b1).toContainText('3 / 3');
  await expect(b1).toHaveAttribute('data-status', 'done'); await expect(b1).toContainText('done');
  await expect(b2).toContainText('Unit 2'); await expect(b2).toContainText('0 / 4'); await expect(b2).toHaveAttribute('data-status', 'open');
  await app.close();
  const fresh = await launch();
  await expect(fresh.w.getByTestId('banner-u1')).toHaveAttribute('data-status', 'open');
  await expect(fresh.w.getByTestId('banner-u2')).toHaveAttribute('data-status', 'locked');
  await fresh.app.close();
});

test('lesson circles zig-zag left and right, each name sits beside its circle (not under it), on the open side', async () => {
  const { app, w } = await launch({ 'u1-l1': 3 });
  await w.waitForTimeout(1500); // the pop-ins
  const ids = ['u2-l1', 'u2-l2', 'u2-l3', 'u2-l4'];
  const xs: number[] = [];
  for (const [i, id] of ids.entries()) {
    const c = await box(w, `lesson-${id}`), n = await box(w, `name-${id}`), m = mid(c);
    xs.push(m.x);
    await expect(w.getByTestId(`row-${id}`)).toHaveAttribute('data-side', i % 2 ? 'right' : 'left');
    // Beside: the name's middle is level with the circle's middle, and the two don't overlap sideways.
    expect(Math.abs(mid(n).y - m.y), id).toBeLessThan(4);
    if (i % 2) expect(n.x + n.width, id).toBeLessThanOrEqual(c.x - 8); else expect(n.x, id).toBeGreaterThanOrEqual(c.x + c.width + 8);
  }
  for (let i = 1; i < xs.length; i++) expect(Math.abs(xs[i] - xs[i - 1])).toBeGreaterThan(120); // a real zig-zag, not a wobble
  // Each lesson takes the same height, and they go down the page in order.
  const ys = await Promise.all(ids.map(async id => mid(await box(w, `lesson-${id}`)).y));
  for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeCloseTo(112, 0);
  await app.close();
});

test('done, current and locked each have their own look (size, icon, outline), not only a colour', async () => {
  const { app, w } = await launch({ 'u1-l1': 2 });
  await w.waitForTimeout(1500);
  const look = (id: string) => w.getByTestId(`lesson-${id}`).evaluate(el => {
    const s = getComputedStyle(el);
    return { w: el.getBoundingClientRect().width, icon: el.querySelector('svg')?.getAttribute('data-icon'), border: s.borderTopStyle,
      check: !!el.querySelector('[data-testid=lesson-check]') };
  });
  const done = await look('u1-l1'), cur = await look('u1-l2'), lock = await look('u1-l3');
  expect(done).toMatchObject({ w: 64, icon: 'tower', border: 'solid', check: true });
  expect(cur).toMatchObject({ w: 80, icon: 'tower', border: 'solid', check: false });
  expect(lock).toMatchObject({ w: 56, icon: 'lock', border: 'dashed', check: false });
  // The current one has its two rings and glow; the name says "Up next"; a finished one shows its stars (2 filled, 1 outline).
  const row = w.getByTestId('row-u1-l2');
  await expect(row.getByTestId('lesson-ring')).toHaveCount(2);
  await expect(row.getByTestId('lesson-glow')).toHaveCount(1);
  await expect(w.getByTestId('name-u1-l2')).toContainText('Up next');
  await expect(w.getByTestId('lesson-ring')).toHaveCount(2); // only the current lesson has rings
  await expect(w.getByTestId('stars-u1-l1')).toHaveAttribute('data-count', '2');
  await expect(w.getByTestId('stars-u1-l1').locator('svg')).toHaveCount(3);
  await expect(w.getByTestId('lesson-u1-l3')).toBeDisabled();
  await app.close();
});

test('the dotted signal line joins the circles: bright up to the current lesson, dim towards locked ones', async () => {
  const { app, w } = await launch({ 'u1-l1': 3 });
  await w.waitForTimeout(1500);
  // One piece between each pair of lessons in a unit.
  await expect(w.getByTestId('line-u1').locator('path')).toHaveCount(2);
  await expect(w.getByTestId('line-u2').locator('path')).toHaveCount(3);
  await expect(w.getByTestId('line-to-u1-l2')).toHaveAttribute('data-reached', 'true');
  await expect(w.getByTestId('line-to-u1-l3')).toHaveAttribute('data-reached', 'false');
  const piece = await w.getByTestId('line-to-u1-l2').evaluate(el => {
    const s = getComputedStyle(el), p = el as SVGPathElement, len = p.getTotalLength(), r = el.getBoundingClientRect();
    return { dash: s.strokeDasharray, cap: s.strokeLinecap, len, stroke: s.stroke, top: r.top, bottom: r.bottom };
  });
  expect(piece.cap).toBe('round'); expect(piece.dash).toMatch(/^0(px)?,? 10(px)?$/); // dots
  // It runs from the middle of one circle to the middle of the next.
  const a = mid(await box(w, 'lesson-u1-l1')), b = mid(await box(w, 'lesson-u1-l2'));
  expect(Math.abs(piece.top - a.y)).toBeLessThan(3); expect(Math.abs(piece.bottom - b.y)).toBeLessThan(3);
  expect(piece.len).toBeGreaterThan(Math.hypot(b.x - a.x, b.y - a.y));
  const dim = await w.getByTestId('line-to-u1-l3').evaluate(el => getComputedStyle(el).stroke);
  expect(dim).not.toBe(piece.stroke);
  await app.close();
});

test('the path opens at your current lesson, with its unit banner when that fits; again after a lesson and after other tabs', async () => {
  const { app, w } = await launch(FAR, false);
  await w.waitForTimeout(300);
  expect(await w.evaluate(() => scrollY)).toBeGreaterThan(500);
  await expect(w.getByTestId('lesson-unit02-l3')).toHaveAttribute('data-status', 'current');
  expect(await onScreen(w, 'lesson-unit02-l3')).toBe(true);
  expect(await onScreen(w, 'banner-unit02')).toBe(true); // you can see which unit you're in
  // Scroll away, visit Settings, come back: it opens at the current lesson again.
  await w.evaluate(() => window.scrollTo(0, 0));
  await w.getByTestId('tab-settings').click(); await w.getByTestId('screen-settings').waitFor();
  await w.getByTestId('tab-path').click(); await w.getByTestId('screen-path').waitFor();
  await w.waitForTimeout(600);
  expect(await onScreen(w, 'lesson-unit02-l3')).toBe(true);
  await w.screenshot({ path: 'test-results/path-opens-at-current.png' });
  await app.close();
});

test('after finishing a lesson, the path opens at the next one', async () => {
  // The sample path in a short window, so lesson 4 is below the fold.
  const { app, w } = await launch({ 'u1-l1': 3, 'u1-l2': 3 }, true, { w: 620, h: 600 });
  await w.waitForTimeout(1500);
  await w.getByTestId('lesson-u1-l3').click();
  await playSampleLesson(w);
  await w.getByTestId('finish').click();
  await expect(w.getByTestId('lesson-u2-l1')).toHaveAttribute('data-status', 'current');
  await w.waitForTimeout(600);
  expect(await w.evaluate(() => scrollY)).toBeGreaterThan(100);
  expect(await onScreen(w, 'lesson-u2-l1')).toBe(true);
  await app.close();
});

test('a narrow window (360 px): nothing sticks out sideways, and every name stays whole', async () => {
  const { app, w } = await launch({ 'unit01-l1': 3 }, false, { w: 360, h: 800 });
  await w.waitForTimeout(1500);
  expect(await w.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const width = await w.evaluate(() => innerWidth);
  for (const id of ['unit02-l2', 'unit03-l3', 'unit02-check', 'unit03-l1']) {
    const n = await box(w, `name-${id}`), c = await box(w, `lesson-${id}`);
    expect(n.x, id).toBeGreaterThanOrEqual(0); expect(n.x + n.width, id).toBeLessThanOrEqual(width);
    expect(n.height, id).toBeLessThan(112); // fits in its row
    expect(n.x + n.width <= c.x || n.x >= c.x + c.width, id).toBe(true); // still beside the circle
  }
  await app.close();
});

test('the daily review card: "Daily review" with a due count, or "nothing due today"', async () => {
  const { app, w } = await launch();
  await expect(w.getByTestId('daily-review')).toContainText('Daily review');
  await expect(w.getByTestId('daily-review')).toContainText('nothing due today');
  await expect(w.getByTestId('daily-review')).toBeDisabled();
  const b = await box(w, 'daily-review');
  expect(b.height).toBeGreaterThanOrEqual(44);
  await app.close();
});
