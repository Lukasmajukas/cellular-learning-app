import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';
import { SAMPLE } from '../src/lesson';
import { BEACON_LINES } from '../src/questionScreen';

// Redesign R18, "Beacon reacts", tried in the real app:
// - the path: Beacon stands beside your current lesson ("you are here"), on the side away from its name, clear of the
//   name and the circle; it blinks but its rings stay still (idea I35: the lesson's rings already breathe, 2 loops);
//   after you finish a lesson it arrives with the new current lesson and is happy for a moment;
// - questions (idea I39): Beacon speaks before the first question, after each answer and when a missed one comes back
//   (thinking, idea I43), and is quiet the rest of the time; a right comeback says "fixed";
// - lesson complete: Beacon says a line beside its head; the lesson's top row turns into its name (I46); the block sits in
//   the middle of a tall window (I48); Esc keeps the result, like "Back to the path".
const launch = async (progress: Record<string, number> = {}, reduceMotion = false) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress,
    settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 2, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const box = async (w: Page, sel: string) => (await w.locator(sel).first().boundingBox())!;
const overlap = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const answer = async (w: Page, ok: boolean) => {
  await w.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
  const prompt = await w.getByTestId('prompt').textContent(), q = SAMPLE.find(x => x.prompt === prompt)!;
  await w.getByTestId(`choice-${ok ? q.answer : q.choices.findIndex((_, k) => k !== q.answer)}`).click();
  await w.getByTestId('next').waitFor();
};
const next = async (w: Page) => { await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' }); };
const lines = (m: keyof typeof BEACON_LINES) => new RegExp(`^(${BEACON_LINES[m].map(l => l.replace(/[.*+?^${}()|[\]\\!]/g, '\\$&')).join('|')})$`);

for (const [progress, id, side] of [[{}, 'u1-l1', 'left'], [{ 'u1-l1': 3 }, 'u1-l2', 'right']] as const) {
  test(`the path: Beacon stands beside the current lesson (${side}), away from its name; it blinks, its rings stay still`, async () => {
    const { app, w } = await launch(progress);
    await w.waitForTimeout(900); // the circles pop in
    const beacons = w.getByTestId('path-beacon');
    await expect(beacons).toHaveCount(1);                                    // one Beacon on the whole path
    await expect(w.getByTestId('path-beacon-spot')).toHaveAttribute('data-side', side);
    const b = await box(w, '[data-testid=path-beacon]'), circle = await box(w, `[data-testid=lesson-${id}]`), name = await box(w, `[data-testid=name-${id}]`);
    expect(b.width).toBeCloseTo(48, 0);
    expect(overlap(b, circle), 'Beacon never covers the lesson circle').toBe(false);
    expect(overlap(b, name), 'or its name').toBe(false);
    // On the side away from the name: left of the circle when the name is on the right, and the other way round.
    if (side === 'left') { expect(b.x + b.width).toBeLessThanOrEqual(circle.x); expect(name.x).toBeGreaterThan(circle.x); }
    else { expect(b.x).toBeGreaterThanOrEqual(circle.x + circle.width); expect(name.x + name.width).toBeLessThan(circle.x); }
    expect(Math.abs((b.y + b.height) - (circle.y + circle.height)), 'its feet level with the circle\'s bottom').toBeLessThan(2);
    // Inside the column, not cut off at the window's edge.
    const vw = await w.evaluate(() => document.documentElement.clientWidth);
    expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(vw);
    // Two loops on the screen at most: the lesson's breathing rings and Beacon's blink. Beacon's own rings stay still.
    await expect(beacons).toHaveAttribute('data-looping', 'true');
    await expect(beacons).toHaveAttribute('data-breathing', 'false');
    await expect(w.getByTestId('lesson-breath')).toHaveAttribute('data-breathing', 'true');
    await expect(w.getByTestId(`lesson-${id}`)).toHaveAttribute('aria-label', /you are here$/);
    await w.screenshot({ path: `test-results/r18-path-${side}.png` });
    await app.close();
  });
}

test('after a lesson, Beacon arrives with the new current lesson, is happy for a moment, then waits; 50+ fps', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < SAMPLE.length; i++) { await answer(w, true); if (i < SAMPLE.length - 1) await next(w); }
  await w.getByTestId('next').click();
  await w.getByTestId('finish').waitFor(); await w.waitForTimeout(1700);
  const faces: string[] = [];
  const r = await film(w, ['[data-testid=path-beacon-spot]'], async () => {
    await w.getByTestId('finish').click();
    // Note Beacon's face every 100 ms while the path comes on air.
    for (let t = 0; t < 30; t++) { faces.push((await w.getByTestId('path-beacon').getAttribute('data-face').catch(() => null)) ?? '-'); await w.waitForTimeout(100); }
  }, 1900, '[data-testid=path-beacon-spot]');
  console.log(`  faces: ${faces.join(' ')}; ${r.fps.toFixed(1)} fps`);
  await expect(w.getByTestId('path-beacon-spot')).toHaveAttribute('data-side', 'right');  // beside u1-l2 now
  const happy = faces.indexOf('happy');
  expect(happy, 'Beacon is happy when the new lesson arrives').toBeGreaterThan(0);
  expect(faces.slice(0, happy).every(f => f === 'idle' || f === '-')).toBe(true);
  await expect(w.getByTestId('path-beacon')).toHaveAttribute('data-face', 'idle', { timeout: 3000 }); // and then waits
  // It arrives with the circle: it starts small (the circle's pop) and ends at full size.
  const sx = r.of('[data-testid=path-beacon-spot]').filter(Boolean).map(f => f!.sx);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  expect(sx.at(-1)).toBeCloseTo(1, 2);
  await app.close();
});

test('questions: Beacon speaks before the first one, after each answer and on a comeback, and is quiet otherwise', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const says = w.getByTestId('beacon-says'), beacon = w.getByTestId('beacon');
  // 1st question: a line before you answer.
  await w.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
  await expect(says).toHaveText(lines('ask'));
  await answer(w, false);                                      // miss it: it comes back later
  await expect(says).toHaveText(lines('wrong'));
  await expect(beacon).toHaveAttribute('data-face', 'oops');
  await next(w);
  // 2nd question: nothing has happened yet, so Beacon is quiet (the bubble fades out).
  await expect(says).toHaveCount(0);
  await expect(beacon).toHaveAttribute('data-face', 'idle');
  const spot = (await box(w, '[data-testid=beacon-spot]')).height;
  expect(spot, 'the spot keeps its height without a bubble').toBeGreaterThanOrEqual(78);
  await answer(w, true);
  await expect(says).toHaveText(lines('right'));
  await next(w);
  for (let i = 2; i < SAMPLE.length; i++) { await expect(says).toHaveCount(0); await answer(w, true); await next(w); }
  // The missed one is back: Beacon thinks it over and says so (I43).
  await expect(w.getByTestId('comeback')).toBeVisible();
  await expect(says).toHaveText(lines('comeback'));
  await expect(beacon).toHaveAttribute('data-face', 'thinking');
  await w.screenshot({ path: 'test-results/r18-comeback.png' });
  await answer(w, true);
  await expect(says).toHaveText(lines('fixed'));
  await expect(beacon).toHaveAttribute('data-face', 'happy');
  await app.close();
});

test('lesson complete: Beacon says a line beside its head; the top row becomes the lesson\'s name; the block is centred; Esc keeps the result', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < SAMPLE.length; i++) { await answer(w, true); await w.getByTestId('next').click(); }
  await w.getByTestId('done').waitFor(); await w.mouse.move(2, 2); await w.waitForTimeout(1700);
  // I46: no close button, bar or counter; the lesson's name in green instead.
  await expect(w.getByTestId('quit')).toHaveCount(0);
  await expect(w.getByTestId('lesson-progress')).toHaveCount(0);
  await expect(w.getByTestId('done-title')).toHaveText('Sample lesson 1');
  // Beacon's line: perfect (every one right the first time), beside its head, clear of the title and the stars.
  await expect(w.getByTestId('beacon-says')).toHaveText(lines('perfect'));
  const b = await box(w, '[data-testid=complete] [data-testid=beacon]'), says = await box(w, '[data-testid=beacon-says]');
  const title = await box(w, '[data-testid=done]'), stars = await box(w, '[data-testid=stars]'), head = await box(w, '[data-testid=done-head]');
  const vw = await w.evaluate(() => document.documentElement.clientWidth), vh = await w.evaluate(() => window.innerHeight);
  // To the right of Beacon's head, just past its outer ring (radius 30 in the 100-wide drawing) ...
  expect(says.x).toBeGreaterThanOrEqual(b.x + b.width * 0.8 - 1);
  expect(says.x).toBeLessThan(b.x + b.width * 0.8 + 12);
  expect(says.y + says.height).toBeLessThan(b.y + b.height * 0.5);     // ... at its head
  console.log(`  beacon x ${b.x} w ${b.width}; bubble x ${says.x} w ${says.width}; window ${vw}`);
  expect(says.x + says.width).toBeLessThanOrEqual(vw - 8);             // inside the window
  for (const o of [title, stars, head]) expect(overlap(says, o)).toBe(false);
  // I48: the block sits in the middle of the window (below the name row), and the page doesn't scroll.
  const end = await box(w, '[data-testid=complete]');
  const mid = (head.y + head.height + vh) / 2, at = end.y + end.height / 2;
  console.log(`  block ${end.y.toFixed(0)}-${(end.y + end.height).toFixed(0)}, middle ${at.toFixed(0)} (room's middle ${mid.toFixed(0)}), window ${vh}`);
  expect(Math.abs(at - mid)).toBeLessThan(24);
  expect(await w.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThanOrEqual(0);
  await w.screenshot({ path: 'test-results/r18-complete.png' });
  // Esc goes back to the path and keeps the lesson (it used to leave without saving it).
  await w.keyboard.press('Escape');
  await w.getByTestId('path-count').waitFor();
  await expect(w.getByTestId('lesson-u1-l1')).toHaveAttribute('data-status', 'done');
  await expect(w.getByTestId('path-count')).toHaveText(/^1 of /);
  await app.close();
});

test('lesson complete after a fix: Beacon says you fixed the tricky ones', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  await answer(w, false); await next(w);
  for (let i = 0; i < 12; i++) {
    if (await w.getByTestId('done').isVisible()) break;
    await answer(w, true); await w.getByTestId('next').click();
    await w.getByTestId('done').or(w.locator('[data-testid^=choice-]:not([disabled])')).first().waitFor();
  }
  await expect(w.getByTestId('fixed')).toBeVisible();
  await expect(w.getByTestId('beacon-says')).toHaveText(lines('fixedAll'));
  await app.close();
});

test('with Reduce motion: the path\'s Beacon stands still, and the lesson-complete line is simply there', async () => {
  const { app, w } = await launch({}, true);
  await expect(w.getByTestId('path-beacon')).toHaveAttribute('data-looping', 'false');
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < SAMPLE.length; i++) { await answer(w, true); await w.getByTestId('next').click(); }
  await w.getByTestId('done').waitFor();
  const r = await film(w, ['[data-testid=beacon-says]'], async () => {}, 400);
  const sx = r.of('[data-testid=beacon-says]').filter(Boolean).map(f => f!.sx);
  expect(new Set(sx).size, `bubble scale: ${sx}`).toBe(1);
  await app.close();
});
