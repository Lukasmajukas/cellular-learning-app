import { _electron as electron, test, expect, type ElectronApplication, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sideways } from './helpers';

// Redesign R22: every screen works from a phone-narrow window (360 x 560, the smallest the window can be made) to full
// screen (1920 x 1080). Nothing scrolls sideways, the top bar fits, Settings rows keep their words readable, every
// question type and lesson complete fit, and on a big screen the column stays 440 px wide in the middle.
const today = () => { const d = new Date(), p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
const launch = async (done: string[], env: Record<string, string> = {}, fresh = false) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  // Big numbers on purpose (a long streak, five-digit XP, two freezes), so the top bar is as full as it gets.
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: Object.fromEntries(done.map(id => [id, 3])), reviews: {}, seenChanges: [],
    settings: { sounds: false, reduceMotion: true, showFps: false, dailyGoal: 2, look: 'night' },
    ...(fresh ? {} : { game: { streak: 128, lastDay: today(), xp: 12345, xpToday: 30, xpDay: today(), doneToday: 1, doneDay: today(), freezes: 2, lost: 0, lostDay: '' } }) }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir, ...env } });
  const w = await app.firstWindow();
  return { app, w };
};
const size = (app: ElectronApplication, W: number, H: number) =>
  app.evaluate(({ BrowserWindow }, s) => { const b = BrowserWindow.getAllWindows()[0]; b.setContentSize(s.W, s.H); return b.getContentSize(); }, { W, H });
const UNIT1 = ['u1-l1', 'u1-l2', 'u1-l3'];
// Everything in the top bar sits inside the window.
const topBarFits = (w: Page) => w.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  return [...document.querySelectorAll<HTMLElement>('[data-testid=top-bar] *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 0.5 || r.left < -0.5); }).map(e => e.dataset.testid ?? e.tagName);
});
// The narrowest words column of any Settings row (R22: a wide control moves under the words instead of squeezing them).
const narrowestWords = (w: Page) => w.evaluate(() => Math.min(...[...document.querySelectorAll('[data-testid=settings] [data-part=hint]')].map(h => h.parentElement!.getBoundingClientRect().width)));

// Answers whatever question is showing, by mouse (right or wrong doesn't matter here), and goes on. False at the end.
async function answer(w: Page) {
  const done = w.getByTestId('done'), any = w.locator('[data-testid=learn-ok], [data-testid^=choice-]:not([disabled]), [data-testid=number-input]:not([disabled]), [data-testid=match-grid], [data-testid=order-pool], [data-testid=clue-0], [data-testid=photo]');
  await done.or(any.first()).first().waitFor();
  if (await done.isVisible()) return false;
  if (await w.getByTestId('learn-ok').isVisible()) { await w.getByTestId('learn-ok').click(); return true; }
  if (await w.locator('[data-testid^=choice-]').first().isVisible()) await w.locator('[data-testid^=choice-]').first().click();
  else if (await w.getByTestId('number-input').isVisible()) { await w.getByTestId('number-input').fill('700'); await w.getByTestId('check').click(); }
  else if (await w.getByTestId('match-grid').isVisible()) { for (const t of await w.locator('[data-testid^=match-right-]').all()) await t.click(); await w.getByTestId('check').click(); }
  else if (await w.getByTestId('order-pool').isVisible()) { while (await w.locator('[data-testid^=order-item-]').count()) await w.locator('[data-testid^=order-item-]').first().click(); await w.getByTestId('check').click(); }
  else if (await w.getByTestId('clue-0').isVisible()) { for (const g of await w.locator('[role=group]').all()) await g.locator('button').first().click(); await w.getByTestId('check').click(); }
  await w.getByTestId('next').waitFor();
  expect(await sideways(w), `after answering ${await w.getByTestId('kind-label').textContent()}`).toBe(0);
  await w.getByTestId('next').click();
  await expect(w.getByTestId('verdict')).toHaveCount(0);
  return true;
}

test('the window can\'t be made smaller than 360 x 560', async () => {
  const { app, w } = await launch(UNIT1);
  await w.getByTestId('path-count').waitFor();
  const [cw, ch] = await size(app, 300, 400);
  expect(cw).toBeGreaterThanOrEqual(360);
  expect(ch).toBeGreaterThanOrEqual(560);
  await app.close();
});

test('phone-narrow 360 x 560: every tab, Settings and the heatmap sheet fit; nothing scrolls sideways', async () => {
  const { app, w } = await launch(UNIT1);
  await w.getByTestId('path-count').waitFor();
  await size(app, 360, 560);
  for (const tab of ['path', 'review', 'heatmap', 'settings']) {
    await w.getByTestId(`tab-${tab}`).click(); await w.waitForTimeout(300);
    expect(await sideways(w), tab).toBe(0);
    expect(await topBarFits(w), tab).toEqual([]);
  }
  // The top bar: today's "+30" steps aside; streak, XP, freezes and the goal all show.
  await expect(w.getByTestId('xp-today')).toBeHidden();
  for (const id of ['streak', 'xp-total', 'freezes', 'goal-text']) await expect(w.getByTestId(id)).toBeVisible();
  // Settings: no row's words get narrower than 100 px; the volume slider and "Back up now" sit under their words.
  expect(await narrowestWords(w)).toBeGreaterThanOrEqual(100);
  const words = (await w.getByTestId('volume-row').locator('[data-part=hint]').boundingBox())!, slider = (await w.getByTestId('set-volume').boundingBox())!;
  expect(slider.y).toBeGreaterThan(words.y + words.height - 1);
  await w.screenshot({ path: 'test-results/r22-360-settings.png', fullPage: true });
  // The heatmap's sheet.
  await w.getByTestId('tab-heatmap').click(); await w.getByTestId('heat-B71').click();
  await expect(w.getByTestId('heat-sheet')).toBeVisible();
  expect(await sideways(w)).toBe(0);
  await w.keyboard.press('Escape');
  // On a 620 px window "+30" is back.
  await size(app, 620, 960);
  await expect(w.getByTestId('xp-today')).toBeVisible();
  expect(await topBarFits(w)).toEqual([]);
  await app.close();
});

test('phone-narrow 360 x 560: every question type and lesson complete fit', async () => {
  test.setTimeout(120_000);
  const { app, w } = await launch([...UNIT1, 'u2-l1', 'u2-l2']);
  await w.getByTestId('path-count').waitFor();
  await size(app, 360, 560);
  await w.getByTestId('lesson-u2-l3').click();
  const kinds = new Set<string>();
  for (let i = 0; i < 20; i++) {
    const label = w.getByTestId('kind-label');
    if (await label.isVisible().catch(() => false)) {
      kinds.add((await label.textContent())!.toLowerCase());
      expect(await sideways(w), `${await label.textContent()}`).toBe(0);
    }
    if (!(await answer(w))) break;
  }
  expect([...kinds]).toEqual(expect.arrayContaining(['something new', 'pick one', 'type the number', 'match the pairs', 'put them in order', 'read the clues']));
  // Lesson complete: Beacon's bubble stays inside the window (under the title: I61); "+N XP" stays on one line.
  await expect(w.getByTestId('done')).toBeVisible();
  await w.waitForTimeout(400);
  expect(await sideways(w)).toBe(0);
  const vw = await w.evaluate(() => document.documentElement.clientWidth);
  const says = (await w.getByTestId('beacon-says').boundingBox())!;
  expect(says.x + says.width).toBeLessThanOrEqual(vw);
  // I61: under the title here, pointing up at Beacon, not squeezed beside its head.
  await expect(w.getByTestId('beacon-says')).toHaveAttribute('data-point', 'up');
  expect(says.y).toBeGreaterThan((await w.getByTestId('done').boundingBox())!.y);
  expect((await w.getByTestId('xp').boundingBox())!.height).toBeLessThan(50);
  await w.screenshot({ path: 'test-results/r22-360-complete.png' });
  await app.close();
});

test('phone-narrow 360 x 560: the welcome fits', async () => {
  const { app, w } = await launch([], { CELL_SKIP_WELCOME: '' }, true);   // a brand-new save (one with XP counts as welcomed)
  await w.getByTestId('welcome').waitFor();
  await size(app, 360, 560);
  expect(await sideways(w)).toBe(0);
  await w.keyboard.press('Enter');
  await expect(w.getByTestId('welcome')).toHaveAttribute('data-page', '1');
  await w.waitForTimeout(500);
  expect(await sideways(w)).toBe(0);
  await app.close();
});

test('full screen 1920 x 1080: the column stays 440 px wide in the middle', async () => {
  const { app, w } = await launch(UNIT1);
  await w.getByTestId('path-count').waitFor();
  await size(app, 1920, 1080);
  for (const [tab, col] of [['path', 'path-map'], ['review', 'review-screen'], ['heatmap', 'heatmap'], ['settings', 'settings']]) {
    await w.getByTestId(`tab-${tab}`).click(); await w.waitForTimeout(300);
    expect(await sideways(w), tab).toBe(0);
    // Centred like the top bar's column (both leave the scrollbar's strip on the right, design review 1).
    const bar = (await w.getByTestId('top-bar').locator('> div').boundingBox())!;
    const b = (await w.getByTestId(col).first().boundingBox())!;
    expect(b.width, tab).toBeLessThanOrEqual(440.5);
    expect(Math.abs(b.x + b.width / 2 - (bar.x + bar.width / 2)), tab).toBeLessThan(1);
  }
  await app.close();
});
