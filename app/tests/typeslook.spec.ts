import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Redesign R10: the other question types in the Night Signal look, tried in the real app with the demo lesson
// (learn card, pick one, type the number, match the pairs, put them in order, a carrier question, read the clues).
// Everything sits on the question's left edge with a full-width Check; after Check each tile, chip, slot and the number
// box shows right or wrong (with a tick or a cross); the "Not quite" sheet stays short, with the long parts behind a
// quiet button (idea I38).
const launch = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  const progress = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2'].map(id => [id, 3]));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress,
    settings: { sounds: false, reduceMotion: true, showFps: false, dailyGoal: 2, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  await w.getByTestId('lesson-u2-l3').click();
  await w.getByTestId('learn-card').waitFor();
  return { app, w };
};
const box = async (w: Page, id: string) => (await w.getByTestId(id).first().boundingBox())!;
const go = async (w: Page) => { await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' }); };
const sheetShare = (w: Page) => w.evaluate(() => document.querySelector('[data-testid=feedback]')!.getBoundingClientRect().height / window.innerHeight);
// The label, the question and the answers start on one left edge, and Check is as wide as the answers.
// Measured once the question has finished sliding in (it comes in from 60 px to the right).
const lined = async (w: Page, body: string) => {
  await expect.poll(async () => Math.abs((await box(w, 'prompt')).x - (await box(w, body)).x), { timeout: 3000 }).toBeLessThan(1.5);
  const label = await box(w, 'kind-label'), prompt = await box(w, 'prompt'), b = await box(w, body);
  expect(Math.abs(label.x - prompt.x)).toBeLessThan(1.5);
  expect(Math.abs(prompt.x - b.x)).toBeLessThan(1.5);
  return b;
};

test('learn card, type the number and match the pairs line up on the left; the box and the pairs show right and wrong', async () => {
  const { app, w } = await launch();
  // Learn card: "SOMETHING NEW", the title and the text on one edge, the ruler in a raised card, a full-width "Got it".
  await expect(w.getByTestId('kind-label')).toHaveText(/^something new$/i);
  const text = await lined(w, 'learn-text');
  await expect(w.getByTestId('learn-ruler')).toBeVisible();
  const ok = await box(w, 'learn-ok');
  expect(Math.abs(ok.x - text.x)).toBeLessThan(1.5);
  expect(Math.abs(ok.width - text.width)).toBeLessThan(2);
  await w.screenshot({ path: 'test-results/r10-learn.png' });
  await w.getByTestId('learn-ok').click();
  await w.getByTestId('choice-0').click(); await go(w);

  // Type the number: the hint, the unit inside the box, Check as wide as the box; a wrong number turns the box red.
  await expect(w.getByTestId('kind-hint')).toHaveText('Type the number. Commas are fine.');
  const nb = await lined(w, 'number-box'), unit = await box(w, 'number-unit'), check = await box(w, 'check');
  expect(unit.x + unit.width).toBeLessThanOrEqual(nb.x + nb.width);
  expect(unit.x).toBeGreaterThan(nb.x + nb.width / 2);
  expect(Math.abs(check.width - nb.width)).toBeLessThan(2);
  await expect(w.getByTestId('check')).toBeDisabled();
  await w.getByTestId('number-input').fill('700');
  await w.getByTestId('check').click();
  await expect(w.getByTestId('verdict')).toHaveText('Not quite');
  await expect(w.getByTestId('number-box')).toHaveAttribute('data-state', 'wrong');
  await expect(w.getByTestId('check')).toBeHidden();             // the sheet's Continue takes over
  await go(w);

  // Match the pairs: the first left one is lit; pairing moves on to the next by itself; the right one takes its number.
  await lined(w, 'match-grid');
  await expect(w.getByTestId('match-left-0')).toHaveAttribute('aria-pressed', 'true');
  await w.getByTestId('match-right-0').click();
  await expect(w.getByTestId('match-left-1')).toHaveAttribute('aria-pressed', 'true');
  await expect(w.getByTestId('match-left-0')).toHaveAttribute('data-state', 'paired');
  await expect(w.getByTestId('match-right-0').locator('[data-key]')).toHaveText('1');
  await expect(w.getByTestId('match-right-1').locator('[data-key=empty]')).toHaveCount(1);
  await w.screenshot({ path: 'test-results/r10-match.png' });
  await w.getByTestId('match-right-2').click(); await w.getByTestId('match-right-1').click();   // the last two swapped
  await w.getByTestId('check').click();
  await expect(w.getByTestId('verdict')).toHaveText('Not quite');
  await expect(w.getByTestId('match-left-0')).toHaveAttribute('data-state', 'right');
  await expect(w.getByTestId('match-left-1')).toHaveAttribute('data-state', 'wrong');
  await expect(w.getByTestId('match-right-2')).toHaveAttribute('data-state', 'wrong');
  await expect(w.getByTestId('right-answer')).toBeVisible();
  await app.close();
});

test('put them in order and read the clues: slots and chips, right and wrong per place and clue, a short sheet with the rest folded', async () => {
  const { app, w } = await launch();
  await w.getByTestId('learn-ok').click();
  await w.getByTestId('choice-0').click(); await go(w);
  await w.getByTestId('number-input').fill('617'); await w.getByTestId('check').click(); await go(w);
  for (let i = 0; i < 3; i++) { await w.getByTestId(`match-left-${i}`).click(); await w.getByTestId(`match-right-${i}`).click(); }
  await w.getByTestId('check').click(); await go(w);

  // Order: numbered slots, the next empty one outlined; a chip fills it; tapping a filled slot takes it back.
  await lined(w, 'order-placed');
  await expect(w.getByTestId('order-slot-0')).toHaveAttribute('data-next', 'true');
  await w.getByTestId('order-item-B2').click();
  await expect(w.getByTestId('order-placed-0')).toContainText('B2');
  await expect(w.getByTestId('order-slot-1')).toHaveAttribute('data-next', 'true');
  await w.getByTestId('order-placed-0').click();
  await expect(w.getByTestId('order-slot-0')).toHaveAttribute('data-next', 'true');
  await expect(w.getByTestId('order-item-B2')).toBeVisible();
  for (const b of ['B71', 'B12', 'B2', 'B5']) await w.getByTestId(`order-item-${b}`).click();   // the last two swapped
  await w.getByTestId('check').click();
  await expect(w.getByTestId('verdict')).toHaveText('Not quite');
  for (const [i, s] of [[0, 'right'], [1, 'right'], [2, 'wrong'], [3, 'wrong']] as const) await expect(w.getByTestId(`order-placed-${i}`)).toHaveAttribute('data-state', s);
  // The sheet stays short; the ruler waits behind "Show them on the ruler", and its band names don't overlap.
  await w.waitForTimeout(400);
  expect(await sheetShare(w)).toBeLessThan(0.4);
  await expect(w.getByTestId('order-bar')).toHaveCount(0);
  await w.getByTestId('why-toggle').click();
  await expect(w.getByTestId('why-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(w.getByTestId('order-bar')).toBeVisible();
  const names = await w.locator('[data-testid=order-bar] [data-band] text').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }));
  expect(names.length).toBe(4);
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const [a, b] = [names[i], names[j]];
    expect(a[2] <= b[0] || b[2] <= a[0] || a[3] <= b[1] || b[3] <= a[1], `names ${i} and ${j} overlap`).toBe(true);
  }
  await w.screenshot({ path: 'test-results/r10-order-wrong.png' });
  await go(w);
  await w.getByTestId('choice-0').click(); await go(w);

  // Read the clues: a card per clue, chips that light up when picked, Check only when every clue has an answer.
  await lined(w, 'clue-0');
  await w.getByTestId('clue-0-choice-0').click();
  await expect(w.getByTestId('clue-0-choice-0')).toHaveAttribute('data-state', 'selected');
  await expect(w.getByTestId('check')).toBeDisabled();
  await w.getByTestId('clue-1-choice-0').click();                 // wrong: B2 is mid band
  await w.getByTestId('check').click();
  await expect(w.getByTestId('verdict')).toHaveText('Not quite');
  await expect(w.getByTestId('clue-0')).toHaveAttribute('data-ok', 'true');
  await expect(w.getByTestId('clue-1')).toHaveAttribute('data-ok', 'false');
  await expect(w.getByTestId('clue-1-choice-0')).toHaveAttribute('data-state', 'wrong');
  await expect(w.getByTestId('clue-1-choice-1')).toHaveAttribute('data-state', 'right');
  await expect(w.getByTestId('clue-score')).toHaveText('1 of 2 clues right. The right answers are marked above.');
  await w.waitForTimeout(400);
  expect(await sheetShare(w)).toBeLessThan(0.4);
  await w.getByTestId('why-toggle').click();
  await expect(w.getByTestId('clue-why-1')).toHaveAttribute('data-ok', 'false');
  await w.screenshot({ path: 'test-results/r10-clues-wrong.png' });
  await app.close();
});
