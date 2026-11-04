import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film, snap } from './helpers';
import { SAMPLE } from '../src/lesson';

// Redesign R11: lesson movement, tried in the real app. Right answers pop and glow, a wrong pick shakes gently, questions
// glide in from the right and out to the left, the progress bar springs forward with a spark at its tip, and no confetti
// falls after a right answer any more (idea I31). The counter counts first-time questions only, with a "Comeback" pill
// when a missed one comes back (I37). Order chips glide into their slots and back, and a match tile's number pops (I40).
// Everything that moves runs at 50+ fps; with Reduce motion nothing moves.
const launch = async ({ progress = {}, reduceMotion = false }: { progress?: Record<string, number>; reduceMotion?: boolean } = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress,
    settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 2, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
// The sample lesson's answer key, for the question on screen now: the right tile and a wrong one.
const key = async (w: Page) => {
  await w.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
  const prompt = await w.getByTestId('prompt').textContent(), q = SAMPLE.find(x => x.prompt === prompt)!;
  return { right: q.answer, wrong: q.choices.findIndex((_, k) => k !== q.answer) };
};
const bursts = (w: Page) => w.evaluate(() => (window as unknown as { __confettiBursts?: number }).__confettiBursts ?? 0);
const range = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
const BODY = '[data-testid=question-body]', FILL = '[data-testid=lesson-progress] [data-fill]', SPARK = '[data-testid=lesson-progress] [data-spark]';

test('a wrong pick shakes gently, the right tile pops and its glow flashes on, and no confetti falls (I31); 50+ fps', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const { right, wrong } = await key(w);
  await w.mouse.move(2, 2); await w.waitForTimeout(600); // the lesson finishes rising
  const W = `[data-testid=choice-${wrong}]`, R = `[data-testid=choice-${right}]`, G = `${R} [data-glow-layer]`;
  const r = await film(w, [W, R, G], async () => {
    await w.locator(W).click();
    await w.waitForTimeout(110); await snap(w, 'test-results/r11-shake.png'); // mid-shake, for the eye
  }, 800, '[data-testid=feedback]');
  const xs = r.of(W).filter(Boolean).map(f => f!.x), sx = r.of(R).filter(Boolean).map(f => f!.sx), glow = r.of(G).filter(Boolean).map(f => f!.op);
  console.log(`  wrong tile x ${Math.min(...xs)}..${Math.max(...xs)}; right tile scale up to ${Math.max(...sx)}; glow ${glow[0]} -> ${Math.max(...glow)} -> ${glow.at(-1)}; ${r.fps.toFixed(1)} fps`);
  expect(range(xs), 'the wrong tile shakes').toBeGreaterThanOrEqual(6);
  expect(range(xs), '... gently (6 px each way at most)').toBeLessThanOrEqual(12.5);
  expect(xs.at(-1)).toBeCloseTo(xs[0], 0);                  // and comes back to its place
  expect(Math.max(...sx), 'the right tile pops').toBeGreaterThan(1.01);
  expect(Math.max(...sx)).toBeLessThanOrEqual(1.05);
  expect(sx.at(-1)).toBeCloseTo(1, 2);
  expect(glow[0]).toBeLessThan(0.1);                         // the glow flashes on ...
  expect(Math.max(...glow)).toBeGreaterThan(0.9);
  expect(glow.at(-1)).toBeGreaterThan(0.6);                  // ... and settles, still on
  await expect(w.locator(W)).toHaveAttribute('data-move', 'wrong');
  await expect(w.locator(R)).toHaveAttribute('data-move', 'right');
  expect(r.fps).toBeGreaterThanOrEqual(50);

  // A right answer: the tile pops, and no confetti (it used to fall over the words and the Continue button).
  await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' });
  const k2 = await key(w); await w.waitForTimeout(500);
  await w.getByTestId(`choice-${k2.right}`).click();
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await w.waitForTimeout(500);
  await w.screenshot({ path: 'test-results/r11-right.png' });
  expect(await bursts(w), 'no confetti after a right answer').toBe(0);
  expect(await w.evaluate(() => document.querySelectorAll('canvas').length)).toBe(0);
  await app.close();
});

test('the next question glides in from the right as the old one glides out, and the bar springs forward with a spark; 50+ fps', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const { right } = await key(w);
  await w.getByTestId(`choice-${right}`).click();
  await w.waitForTimeout(700);
  const before = (await w.locator(BODY).boundingBox())!.x;
  const r = await film(w, [BODY, FILL, SPARK, '[data-testid=prompt]'], () => w.getByTestId('next').click(), 1000);
  const body = r.of(BODY).filter(Boolean).map(f => f!), tx = r.of('[data-testid=prompt]').map(f => f?.tx ?? '');
  const first = tx[0], later = body.filter((_, i) => tx[i] && tx[i] !== first);
  const out = body.filter((_, i) => tx[i] === first).map(f => f.x), inn = later.map(f => f.x);
  const fill = r.of(FILL).map(f => f!.x), spark = r.of(SPARK).map(f => f!.op);
  console.log(`  old question x ${out[0]} -> ${out.at(-1)}; new one x ${inn[0]} -> ${inn.at(-1)}; bar tip ${fill[0]} -> max ${Math.max(...fill)} -> ${fill.at(-1)}; spark up to ${Math.max(...spark)}; ${r.fps.toFixed(1)} fps`);
  expect(Math.min(...out), 'the old question glides out to the left').toBeLessThan(before - 10);
  expect(inn[0], 'the new one comes in from the right').toBeGreaterThan(before + 10);
  expect(inn.at(-1)).toBeCloseTo(before, 0);
  expect(new Set(inn).size, 'over many frames, not a jump').toBeGreaterThan(5);
  const end = fill.at(-1)!, step = end - fill[0];
  expect(step).toBeGreaterThan(30);                                   // the bar moved one step on
  expect(Math.max(...fill) - end, 'it springs a touch past its new place ...').toBeGreaterThan(0.5);
  expect(Math.max(...fill) - end, '... but only a touch (under 10% of the step)').toBeLessThan(step * 0.1);
  expect(Math.max(...spark), 'the spark at its tip lights up').toBeGreaterThan(0.5);
  expect(spark.at(-1)).toBeLessThan(0.05);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  await app.close();
});

test('the counter counts first-time questions only: a miss never makes the total grow, and a comeback gets a quiet pill (I37)', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  const total = String(SAMPLE.length), next = async () => { await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' }); };
  await expect(w.getByTestId('lesson-count')).toHaveText(`1 / ${total}`);
  await w.getByTestId(`choice-${(await key(w)).wrong}`).click(); await next();   // a miss: it comes back later
  await expect(w.getByTestId('lesson-count')).toHaveText(`2 / ${total}`);         // not "2 / 4"
  await expect(w.getByTestId('comeback')).toHaveCount(0);
  for (let i = 0; i < SAMPLE.length - 1; i++) { await w.getByTestId(`choice-${(await key(w)).right}`).click(); await next(); }
  // The missed one is back: the counter stays at the total, and the pill says why it's here again.
  await expect(w.getByTestId('comeback')).toBeVisible();
  await expect(w.getByTestId('comeback')).toHaveText('Comeback');
  await expect(w.getByTestId('lesson-count')).toHaveText(`${total} / ${total}`);
  await expect(w.getByTestId('lesson-count')).toHaveAttribute('aria-label', `Question ${total} of ${total}, a comeback`);
  await w.screenshot({ path: 'test-results/r11-comeback.png' });
  // The pill sits beside "PICK ONE", on its line.
  const label = (await w.getByTestId('kind-label').boundingBox())!, pill = (await w.getByTestId('comeback').boundingBox())!;
  expect(pill.x).toBeGreaterThan(label.x + label.width);
  expect(Math.abs((pill.y + pill.height / 2) - (label.y + label.height / 2))).toBeLessThan(4);
  await w.getByTestId(`choice-${(await key(w)).right}`).click(); await next();
  await w.getByTestId('done').waitFor();
  expect(await bursts(w), 'the lesson-complete burst is still there').toBe(1);
  await app.close();
});

test('with Reduce motion nothing shakes, pops or glides: the looks just change, and the glow simply appears', async () => {
  const { app, w } = await launch({ reduceMotion: true });
  await w.getByTestId('lesson-u1-l1').click();
  const { right, wrong } = await key(w); await w.waitForTimeout(300);
  const W = `[data-testid=choice-${wrong}]`, R = `[data-testid=choice-${right}]`;
  const r = await film(w, [W, R, `${R} [data-glow-layer]`], () => w.locator(W).click(), 600);
  expect(range(r.of(W).filter(Boolean).map(f => f!.x)), 'no shake').toBeLessThan(0.5);
  expect(Math.max(...r.of(R).filter(Boolean).map(f => f!.sx)), 'no pop').toBeCloseTo(1, 3);
  expect(r.of(`${R} [data-glow-layer]`).at(-1)!.op, 'the glow is on').toBeGreaterThan(0.6);
  await expect(w.locator(W)).not.toHaveAttribute('data-move', /.+/);
  // Continue: the next question doesn't slide in (R10 saw it start 60 px to the right even with Reduce motion).
  const g = await film(w, [BODY, FILL], () => w.getByTestId('next').click(), 600);
  const xs = g.of(BODY).filter(Boolean).map(f => f!.x), fill = g.of(FILL).map(f => f!.x);
  console.log(`  question x seen: ${[...new Set(xs)].join(', ')}; bar tip ${fill[0]} -> ${fill.at(-1)} in ${new Set(fill).size - 1} step(s)`);
  expect(range(xs), 'no glide').toBeLessThan(0.5);
  expect(new Set(fill).size, 'the bar jumps to its new place').toBeLessThanOrEqual(2);
  await app.close();
});

test('put them in order: a chip glides into its slot and back, the others close the gap; a match tile\'s number pops (I40); 50+ fps', async () => {
  const progress = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2'].map(id => [id, 3]));
  const { app, w } = await launch({ progress });
  const go = async () => { await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' }); };
  await w.getByTestId('lesson-u2-l3').click();
  await w.getByTestId('learn-ok').click();
  await w.getByTestId('choice-0').click(); await go();
  await w.getByTestId('number-input').fill('617'); await w.getByTestId('check').click(); await go();

  // Match: the right tile's number box pops in when it takes its partner's number.
  await w.getByTestId('match-grid').waitFor(); await w.waitForTimeout(500);
  const K = '[data-testid=match-right-0] [data-key]:not([data-key=empty])';
  const m = await film(w, [K], () => w.getByTestId('match-right-0').click(), 500);
  const ks = m.of(K).filter(Boolean).map(f => f!.sx);
  console.log(`  number box scale ${Math.min(...ks)} .. ${Math.max(...ks)} -> ${ks.at(-1)}`);
  expect(Math.min(...ks), 'the number box grows in').toBeLessThan(0.9);
  expect(ks.at(-1)).toBeCloseTo(1, 2);
  for (let i = 1; i < 3; i++) await w.getByTestId(`match-right-${i}`).click();
  await w.getByTestId('check').click(); await go();

  // Order: tap B71; its tile starts where the chip was (in the pool, lower down) and glides up into slot 1.
  await w.getByTestId('order-slot-0').waitFor(); await w.waitForTimeout(500);
  const chip = (await w.getByTestId('order-item-B71').boundingBox())!, slot = (await w.getByTestId('order-slot-0').boundingBox())!;
  const P = '[data-testid=order-placed-0]';
  const a = await film(w, [P, '[data-testid=order-item-B12]'], async () => {
    await w.getByTestId('order-item-B71').click();
    await w.waitForTimeout(90); await snap(w, 'test-results/r11-order-glide.png');
  }, 700, P);
  const ys = a.of(P).filter(Boolean).map(f => f!.y);
  console.log(`  chip y ${chip.y}, slot y ${slot.y}; placed tile y ${ys[0]} -> ${ys.at(-1)} in ${new Set(ys).size} steps; ${a.fps.toFixed(1)} fps`);
  expect(ys[0], 'it starts at the chip').toBeGreaterThan(slot.y + (chip.y - slot.y) * 0.6);
  expect(ys.at(-1), 'and lands in the slot').toBeCloseTo(slot.y, 0);
  expect(new Set(ys).size, 'over many frames').toBeGreaterThan(5);
  expect(a.fps).toBeGreaterThanOrEqual(50);
  // Take it back: the chip glides from the slot down into the pool.
  const back = await film(w, ['[data-testid=order-item-B71]'], () => w.locator(P).click(), 600, '[data-testid=order-item-B71]');
  const by = back.of('[data-testid=order-item-B71]').filter(Boolean).map(f => f!.y);
  console.log(`  chip back: y ${by[0]} -> ${by.at(-1)}; ${back.fps.toFixed(1)} fps`);
  expect(by[0], 'it starts up at the slot').toBeLessThan(by.at(-1)! - 20);
  expect(new Set(by).size).toBeGreaterThan(5);
  await expect(w.getByTestId('order-slot-0')).toHaveAttribute('data-next', 'true');
  // The rest still works as before (R10): fill all four, Check, right and wrong per place.
  for (const b of ['B71', 'B12', 'B5', 'B2']) await w.getByTestId(`order-item-${b}`).click();
  await w.waitForTimeout(400);
  const placed = await Promise.all([0, 1, 2, 3].map(async i => (await w.getByTestId(`order-placed-${i}`).boundingBox())!.y));
  for (let i = 1; i < 4; i++) expect(placed[i]).toBeGreaterThan(placed[i - 1]); // every tile settled in its own slot
  await w.getByTestId('check').click();
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await app.close();
});
