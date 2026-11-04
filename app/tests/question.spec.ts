import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R09: the question screen in the look A layout, tried in the real app. The top row (leave, progress bar,
// "1 / 12"), Beacon at the left with its speech bubble, the "PICK ONE" label, the question and the numbered tiles all
// line up on one left edge; after an answer the bottom sheet slides up onto the window's bottom edge, its Continue button
// in the sheet's colour (red after "Not quite": design review 1), without hiding the right tile; with Reduce motion it
// doesn't slide.
const launch = async (progress: Record<string, number> = {}, reduceMotion = false) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress,
    settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 2, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const box = async (w: Page, id: string) => (await w.getByTestId(id).first().boundingBox())!;
const SHEET = '[data-testid=feedback]';

test('the question screen lines up as in look A: top row, Beacon with its bubble, PICK ONE, the question, numbered tiles', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  await w.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
  await w.waitForTimeout(500); // the lesson finishes rising
  // Top row: leave, the bar (empty at the start), the counter.
  await expect(w.getByTestId('lesson-count')).toHaveText(/^1 \/ \d+$/);
  await expect(w.getByTestId('lesson-progress')).toHaveAttribute('data-value', '0');
  const quit = await box(w, 'quit'), bar = await box(w, 'lesson-progress'), count = await box(w, 'lesson-count');
  expect(quit.x + quit.width).toBeLessThan(bar.x);
  expect(bar.x + bar.width).toBeLessThan(count.x);
  expect(Math.abs((quit.y + quit.height / 2) - (count.y + count.height / 2))).toBeLessThan(4); // one row
  // Beacon at the left, its bubble to its right, their bottoms near each other (the bubble's corner points at Beacon).
  const beacon = await box(w, 'beacon'), says = await box(w, 'beacon-says');
  expect(beacon.width).toBeCloseTo(58, 0);
  expect(beacon.x + beacon.width).toBeLessThanOrEqual(says.x);
  expect(Math.abs((beacon.y + beacon.height) - (says.y + says.height))).toBeLessThan(20);
  await expect(w.getByTestId('beacon-says')).not.toBeEmpty();
  // The label, the question and the tiles share one left edge, under Beacon.
  await expect(w.getByTestId('kind-label')).toHaveText(/^pick one$/i);
  expect(await w.getByTestId('kind-label').evaluate(el => getComputedStyle(el).textTransform)).toBe('uppercase');
  const label = await box(w, 'kind-label'), prompt = await box(w, 'prompt');
  const tile = (await w.locator('[data-pick="1"]').boundingBox())!;
  expect(Math.abs(label.x - prompt.x)).toBeLessThan(1.5);
  expect(Math.abs(prompt.x - tile.x)).toBeLessThan(1.5);
  expect(Math.abs(beacon.x - label.x)).toBeLessThan(12);
  expect(label.y).toBeGreaterThan(beacon.y + beacon.height - 1);
  expect(prompt.y).toBeGreaterThan(label.y);
  expect(await w.getByTestId('prompt').evaluate(el => [getComputedStyle(el).fontSize, getComputedStyle(el).textAlign])).toEqual(['23px', expect.stringMatching(/^(left|start)$/)]);
  await w.screenshot({ path: 'test-results/r09-question.png' });
  await app.close();
});

test('after an answer the sheet sits on the window\'s bottom edge, Continue matches it, the right tile stays in view', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const seen = new Set<string>();
  for (let i = 0; i < 12 && seen.size < 2; i++) {
    const tiles = w.locator('[data-testid^=choice-]:not([disabled])');
    await tiles.first().waitFor();
    const before = await w.getByTestId('beacon-says').textContent(), counted = await w.getByTestId('lesson-count').textContent();
    // Try the second tile first: a miss is likelier there, so both sheets show up quickly.
    await (await tiles.count() > 1 && !seen.has('wrong') ? tiles.nth(1) : tiles.first()).click();
    const sheet = w.locator(SHEET);
    await expect(sheet).toBeVisible();
    const tone = (await sheet.getAttribute('data-tone'))!;
    await expect(w.getByTestId('verdict')).toHaveText(tone === 'right' ? 'Right!' : 'Not quite');
    await expect(w.getByTestId('next')).toHaveAttribute('data-kind', tone === 'right' ? 'onAir' : 'miss');
    await expect(w.getByTestId('beacon')).toHaveAttribute('data-face', tone === 'right' ? 'happy' : 'oops');
    await expect(w.getByTestId('beacon-says')).not.toHaveText(before!);       // Beacon says something new
    if (tone === 'wrong') await expect(w.getByTestId('right-answer')).toContainText('Right answer:');
    await w.waitForTimeout(700); // the sheet lands (and the page scrolls, if it has to)
    const s = (await sheet.boundingBox())!, vh = await w.evaluate(() => window.innerHeight);
    expect(Math.abs(s.y + s.height - vh), 'the sheet sits on the bottom edge').toBeLessThan(1.5);
    expect(s.x).toBe(0);
    const right = (await w.locator('[data-state=right]').boundingBox())!;
    expect(right.y + right.height, 'the right tile is above the sheet').toBeLessThanOrEqual(s.y + 1);
    if (!seen.has(tone)) await w.screenshot({ path: `test-results/r09-sheet-${tone}.png` });
    seen.add(tone);
    await w.getByTestId('next').click();
    await expect(w.getByTestId('verdict')).toHaveCount(0);
    await expect(w.getByTestId('lesson-count')).not.toHaveText(counted!);        // the counter moved on
  }
  expect([...seen].sort()).toEqual(['right', 'wrong']);
  expect(Number(await w.getByTestId('lesson-progress').getAttribute('data-value'))).toBeGreaterThan(0);
  await app.close();
});

test('the sheet slides up smoothly (50+ fps) and Beacon\'s bubble pops in', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const tile = w.locator('[data-testid^=choice-]:not([disabled])').first();
  await tile.waitFor(); await w.waitForTimeout(500);
  const r = await film(w, [SHEET, '[data-testid=beacon-says]'], () => tile.click(), 900, SHEET);
  const ys = r.of(SHEET).filter(Boolean).map(f => f!.y);
  console.log(`  sheet y ${ys[0]} -> ${ys.at(-1)} in ${new Set(ys).size} steps, ${r.fps.toFixed(1)} fps`);
  expect(ys[0]).toBeGreaterThan(ys.at(-1)! + 50);           // it starts low and rises
  expect(new Set(ys).size).toBeGreaterThan(6);              // over many frames, not a jump
  expect(Math.min(...ys)).toBeGreaterThan(ys.at(-1)! - 4);  // no big overshoot past where it lands
  const pop = r.of('[data-testid=beacon-says]').filter(Boolean).map(f => f!.sx);
  expect(Math.min(...pop)).toBeLessThan(0.97);              // the new bubble pops in
  expect(pop.at(-1)).toBeCloseTo(1, 2);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('with Reduce motion the sheet and the bubble don\'t move; they just appear', async () => {
  const { app, w } = await launch({}, true);
  await w.getByTestId('lesson-u1-l1').click();
  const tile = w.locator('[data-testid^=choice-]:not([disabled])').first();
  await tile.waitFor(); await w.waitForTimeout(300);
  const r = await film(w, [SHEET, '[data-testid=beacon-says]'], () => tile.click(), 600, SHEET);
  const sheet = r.of(SHEET).filter(Boolean).map(f => f!), says = r.of('[data-testid=beacon-says]').filter(Boolean).map(f => f!);
  expect(new Set(sheet.map(f => f.y)).size, `sheet y: ${sheet.map(f => f.y)}`).toBe(1);
  expect(new Set(says.map(f => f.sx)).size).toBe(1);
  expect(sheet.at(-1)!.op).toBe(1);
  await app.close();
});

test('on a picture question the page scrolls so the right tile shows above the sheet', async () => {
  const { app, w } = await launch({ 'u1-l1': 3, 'u1-l2': 3, 'u1-l3': 3, 'u2-l1': 3, 'u2-l2': 3, 'u2-l3': 3 });
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(620, 700));
  await w.getByTestId('lesson-u2-l4').click();
  await w.getByTestId('photo').waitFor(); await w.waitForTimeout(500);
  await expect(w.getByTestId('kind-label')).toHaveText(/^pick one$/i);
  await w.locator('[data-testid^=choice-]:not([disabled])').first().click();
  await expect(w.locator(SHEET)).toBeVisible();
  await w.waitForTimeout(1000); // the sheet lands and the page scrolls smoothly
  const s = (await w.locator(SHEET).boundingBox())!, right = (await w.locator('[data-state=right]').boundingBox())!;
  expect(right.y + right.height, 'the right tile is above the sheet').toBeLessThanOrEqual(s.y + 1);
  expect(right.y).toBeGreaterThanOrEqual(0);
  await w.screenshot({ path: 'test-results/r09-photo-sheet.png' });
  await app.close();
});
