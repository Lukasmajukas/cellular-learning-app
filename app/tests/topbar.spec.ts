import { _electron as electron, test, expect, type ElectronApplication } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson, film, snap } from './helpers';

// Redesign R07, tried in the real app: the top bar. When a lesson finishes, XP counts up with a "+N" rising off it,
// the flame flickers, the goal bar springs forward (and flashes, with its check popping on, when the goal is reached),
// and a newly earned streak freeze pops in, after the path's "coming on air" (one celebration at a time). At start-up,
// after quitting a lesson, or with Reduce motion, nothing moves.
// The broken-streak repair is a card now, and repairing makes the flame flicker too. Frame rate measured.
const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');
const key = (t: number) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const today = key(Date.now()), yesterday = key(Date.now() - DAY), twoDaysAgo = key(Date.now() - 2 * DAY);

const launch = async (game: Record<string, unknown> = {}, opts: { calm?: boolean } = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: {}, game,
    settings: { reduceMotion: !!opts.calm, sounds: false, dailyGoal: 1 } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  await resize(app, { w: 620, h: 960 });
  await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const resize = (app: ElectronApplication, s: { w: number; h: number }) =>
  app.evaluate(({ BrowserWindow }, s) => BrowserWindow.getAllWindows()[0].setContentSize(s.w, s.h), s);
// Six days in a row up to yesterday, 100 XP, no freeze: the next lesson makes it 7 days, which earns a freeze.
const SIX_DAYS = { streak: 6, lastDay: yesterday, xp: 100, xpToday: 0, xpDay: yesterday, doneToday: 0, doneDay: yesterday, freezes: 0 };
const S = { xp: '[data-testid=xp-total]', float: '[data-testid=xp-float]', flame: '[data-testid=streak-flame]', glow: '[data-testid=streak-glow]',
  fill: '[data-testid=goal-bar] [data-fill]', flash: '[data-testid=goal-flash]', check: '[data-testid=goal-check]', pill: '[data-testid=freezes]' };
const num = (t: string | undefined) => Number((t ?? '').replace(/[^0-9]/g, ''));
const distinct = (xs: (number | undefined)[]) => new Set(xs.filter(x => x !== undefined)).size;

test('finishing a lesson: XP counts up with a "+N" rising off it, the flame flickers, the goal bar springs and its check pops, a freeze pops in (50+ fps)', async () => {
  const { app, w } = await launch(SIX_DAYS);
  await expect(w.getByTestId('xp-total')).toHaveText('100 XP');
  await expect(w.getByTestId('streak')).toHaveText('6');
  await expect(w.getByTestId('freezes')).toHaveCount(0);
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  const shots: Buffer[] = [];
  const f = await film(w, Object.values(S), async () => {
    await w.getByTestId('finish').click();
    for (const t of [1250, 450, 300, 300, 450]) { await w.waitForTimeout(t); shots.push(await snap(w)); } // a flip book, looked at by eye
  }, 4000, S.xp);
  shots.forEach((b, i) => writeFileSync(`test-results/topbar-${i}.png`, b));
  const seen = (s: string) => f.of(s).filter(x => x !== null) as { op: number; sx: number; sy: number; x: number; y: number; tx: string }[];
  const target = Number(await w.getByTestId('xp-total').getAttribute('data-to'));
  expect(target).toBeGreaterThan(100);

  // XP counts up like a meter: from the old total, through many numbers, never going back, to the new one.
  const xs = seen(S.xp).map(x => num(x.tx));
  console.log(`XP ${xs.slice(0, 3)} ... ${xs.at(-1)}; ${distinct(xs)} numbers shown`);
  expect(xs[0]).toBe(100); expect(xs.at(-1)).toBe(target);
  expect(distinct(xs)).toBeGreaterThan(8);
  expect(xs.every((v, i) => i === 0 || v >= xs[i - 1])).toBe(true);
  // One celebration at a time (I29): this was the lesson's first finish, so the path's "coming on air" plays first and
  // the XP only starts counting after it (TOP_BAR.afterPath, 1.4 s after the top bar appears).
  const firstSeen = f.of(S.xp).findIndex(x => x !== null), firstUp = f.of(S.xp).findIndex(x => x !== null && num(x.tx) > 100);
  console.log(`XP starts counting ${(f.ts[firstUp] - f.ts[firstSeen]).toFixed(0)} ms after the top bar appears`);
  expect(f.ts[firstUp] - f.ts[firstSeen]).toBeGreaterThan(1300);
  // The "+N" says how much was added, rises and fades away.
  await expect(w.getByTestId('xp-float')).toHaveText(`+${target - 100}`);
  const fl = seen(S.float), shownFl = fl.filter(x => x.op > 0.5);
  expect(Math.max(...fl.map(x => x.op))).toBeGreaterThan(0.8); expect(fl.at(-1)!.op).toBeLessThan(0.05);
  expect(fl.at(-1)!.y).toBeLessThan(shownFl[0].y - 6);
  expect(Math.min(...shownFl.map(x => x.y))).toBeGreaterThanOrEqual(0); // it stays inside the window (R07: it was cut off at the top edge)
  // The flame flickers once (grows about a third, wiggles, settles) while its glow brightens and dims back to its still look.
  const fs = seen(S.flame).map(x => x.sx), gs = seen(S.glow).map(x => x.op);
  console.log(`flame scale max ${Math.max(...fs)} -> ${fs.at(-1)}; glow ${gs[0]} -> max ${Math.max(...gs)} -> ${gs.at(-1)}`);
  expect(Math.max(...fs)).toBeGreaterThan(1.2); expect(fs.at(-1)).toBeCloseTo(1, 2);
  expect(Math.max(...gs)).toBeGreaterThan(0.7); expect(gs.at(-1)).toBeCloseTo(0.25, 2);
  await expect(w.getByTestId('streak')).toHaveText('7');
  // The goal bar's fill slides from empty to full over many frames (a spring, not a jump); then it flashes and the check pops on.
  const gx = seen(S.fill).map(x => x.x);
  console.log(`goal fill x ${gx[0]} -> ${gx.at(-1)}, ${distinct(gx)} steps`);
  expect(gx.at(-1)! - gx[0]).toBeGreaterThan(60); expect(distinct(gx)).toBeGreaterThan(8);
  const flash = seen(S.flash).map(x => x.op), ck = seen(S.check).map(x => x.sx);
  expect(Math.max(...flash)).toBeGreaterThan(0.6); expect(flash.at(-1)).toBeLessThan(0.05);
  expect(ck[0]).toBeLessThan(0.2); expect(ck.at(-1)).toBeCloseTo(1, 1);
  await expect(w.getByTestId('goal-text')).toContainText('Daily goal: 1 of 1');
  await expect(w.getByTestId('goal-bar')).toHaveAttribute('data-value', '100');
  // Seven days in a row earned a streak freeze: its pill pops in.
  const pill = seen(S.pill).map(x => x.sx);
  expect(Math.max(...pill)).toBeGreaterThan(1.15); expect(pill.at(-1)).toBeCloseTo(1, 2);
  await expect(w.getByTestId('freezes')).toHaveText('1');
  console.log(`top bar moment: ${f.fps.toFixed(1)} fps`);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('nothing moves at start-up, on other tabs, or after quitting a lesson: the numbers are simply there', async () => {
  const { app, w } = await launch({ streak: 4, lastDay: today, xp: 120, xpToday: 30, xpDay: today, doneToday: 1, doneDay: today, freezes: 1 });
  const f = await film(w, [S.xp, S.flame, S.float, S.flash], async () => {
    await w.getByTestId('tab-settings').click(); await w.getByTestId('screen-settings').waitFor();
    await w.getByTestId('tab-path').click(); await w.getByTestId('screen-path').waitFor();
    await w.getByTestId('lesson-u1-l1').click(); await w.getByTestId('quit').click();
    await w.getByTestId('screen-path').waitFor();
  }, 2500);
  const xs = f.of(S.xp).filter(Boolean).map(x => x!.tx);
  expect(new Set(xs)).toEqual(new Set(['120 XP']));
  expect(f.of(S.flame).filter(Boolean).every(x => x!.sx === 1)).toBe(true);
  expect(f.of(S.float).every(x => x === null)).toBe(true);
  expect(f.of(S.flash).every(x => x === null)).toBe(true);
  await expect(w.getByTestId('xp-today')).toHaveText('+30 XP today');
  await expect(w.getByTestId('goal-text')).toContainText('1 of 1');
  await expect(w.getByTestId('goal-check')).toBeVisible();
  // The flame's still glow shows your streak is alive.
  expect(await w.locator(S.glow).evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.25, 2);
  await app.close();
});

test('with Reduce motion the numbers just change: no counting, no flicker, no "+N", no flash', async () => {
  const { app, w } = await launch(SIX_DAYS, { calm: true });
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  const f = await film(w, Object.values(S), () => w.getByTestId('finish').click(), 2000, S.xp);
  const xs = f.of(S.xp).filter(Boolean).map(x => num(x!.tx));
  expect(distinct(xs)).toBe(1);
  expect(xs[0]).toBe(Number(await w.getByTestId('xp-total').getAttribute('data-to')));
  expect(f.of(S.flame).filter(Boolean).every(x => x!.sx === 1)).toBe(true);
  expect(distinct(f.of(S.glow).filter(Boolean).map(x => x!.op))).toBe(1);
  for (const s of [S.float, S.flash]) expect(f.of(s).every(x => x === null), s).toBe(true);
  expect(f.of(S.check).filter(Boolean).every(x => x!.sx === 1)).toBe(true);
  expect(f.of(S.pill).filter(Boolean).every(x => x!.sx === 1)).toBe(true);
  await expect(w.getByTestId('streak')).toHaveText('7');
  await app.close();
});

test('a broken streak shows the repair card; repairing gives the streak back and the flame flickers', async () => {
  // A 5-day streak, last lesson two days ago, no freeze: yesterday was missed, so it shows 0 and can be repaired.
  const { app, w } = await launch({ streak: 5, lastDay: twoDaysAgo, xp: 80, xpToday: 0, xpDay: twoDaysAgo, doneToday: 0, doneDay: twoDaysAgo, freezes: 0 });
  await expect(w.getByTestId('streak')).toHaveText('0');
  await expect(w.getByTestId('repair-card')).toContainText('Save your 5-day streak');
  await expect(w.getByTestId('repair')).toHaveAccessibleName('Repair your 5-day streak');
  // No XP yet today: no "+0" beside the total (design review 1).
  await expect(w.getByTestId('xp-today')).toHaveCount(0);
  await w.getByTestId('repair-card').screenshot({ path: 'test-results/repair-card.png' });
  const f = await film(w, [S.flame, S.glow], () => w.getByTestId('repair').click(), 1600);
  await expect(w.getByTestId('streak')).toHaveText('5');
  await expect(w.getByTestId('repair-card')).toHaveCount(0);
  const fs = f.of(S.flame).filter(Boolean).map(x => x!.sx), gs = f.of(S.glow).filter(Boolean).map(x => x!.op);
  expect(Math.max(...fs)).toBeGreaterThan(1.2); expect(fs.at(-1)).toBeCloseTo(1, 2);
  expect(gs[0]).toBe(0); expect(gs.at(-1)).toBeCloseTo(0.25, 2); // a streak of 0 has no glow; the repaired one glows
  await app.close();
});
