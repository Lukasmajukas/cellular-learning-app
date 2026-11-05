import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film, snap } from './helpers';
import { SAMPLE } from '../src/lesson';

// Redesign R12: the lesson-complete screen, tried in the real app. Beacon grows in (no jump, idea I34) and cheers, a
// "signal burst" (rings and wave pieces, drawn in the page instead of confetti on a canvas) goes off behind its head,
// the stars you earned drop in one by one, XP counts up like a meter, the signal bars fill one by one. All within
// 1.6 s, at 50+ fps, and "Back to the path" works from the first moment. One main button, "Again" a quiet one (I32).
// A missed question fixed on its comeback shows "1 fixed" (I43). With Reduce motion nothing moves and no burst plays.
const launch = async ({ reduceMotion = false }: { reduceMotion?: boolean } = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: {},
    settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 2, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
// Answers the question on screen (right or wrong, from the sample lesson's answer key) and checks it.
const answer = async (w: Page, ok: boolean) => {
  await w.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
  const prompt = await w.getByTestId('prompt').textContent(), q = SAMPLE.find(x => x.prompt === prompt)!;
  await w.getByTestId(`choice-${ok ? q.answer : q.choices.findIndex((_, k) => k !== q.answer)}`).click();
  await w.getByTestId('next').waitFor();
};
const next = async (w: Page) => { await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' }); };
const bursts = (w: Page) => w.evaluate(() => (window as unknown as { __signalBursts?: number }).__signalBursts ?? 0);
const S = {
  end: '[data-testid=end]', grow: '[data-grow]', ring0: '[data-ring="0"]', ring2: '[data-ring="2"]', piece: '[data-piece]',
  star0: '[data-star-fill="0"]', star2: '[data-star-fill="2"]', xp: '[data-testid=xp]', bar0: '[data-bar-fill="0"]', bar4: '[data-bar-fill="4"]',
};

test('lesson complete: Beacon grows in, the signal burst goes off, stars drop in, XP counts up, bars fill one by one; all within 1.6 s at 50+ fps', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < SAMPLE.length - 1; i++) { await answer(w, true); await next(w); }
  await answer(w, true); await w.mouse.move(2, 2); await w.waitForTimeout(500);
  let shot = 0;
  const r = await film(w, Object.values(S), async () => {
    await w.getByTestId('next').click();
    await w.locator(S.end).waitFor(); await w.waitForTimeout(350);
    await snap(w, 'test-results/r12-mid.png'); shot++;          // mid-celebration, for the eye
  }, 2200, S.end);
  const of = (s: string) => r.of(s);
  const t0 = r.ts[r.frames.findIndex(f => f[S.end])];
  // Seconds after the end screen appeared when this selector last changed (its look settled).
  const settled = (s: string, k: 'op' | 'sx' | 'sy' | 'x' | 'y' | 'tx') => {
    const v = of(s).map(f => f?.[k]); let i = v.length - 1;
    while (i > 0 && v[i - 1] === v.at(-1)) i--;
    return (r.ts[i] - t0) / 1000;
  };
  const grow = of(S.grow).filter(Boolean).map(f => f!.sx), ring = of(S.ring0).filter(Boolean).map(f => f!);
  const piece = of(S.piece).filter(Boolean).map(f => f!), xp = [...new Set(of(S.xp).filter(Boolean).map(f => f!.tx))];
  const star0 = of(S.star0).filter(Boolean).map(f => f!), star2 = of(S.star2).filter(Boolean).map(f => f!);
  const firstOn = (s: string) => of(s).findIndex(f => f && f.op > 0.5);
  const firstFull = (s: string) => of(s).findIndex(f => f && f.sy > 0.5);
  console.log(`  Beacon scale ${grow[0]} -> ${grow.at(-1)}; ring 0 op up to ${Math.max(...ring.map(f => f.op))}, scale up to ${Math.max(...ring.map(f => f.sx))}; ` +
    `piece moved ${Math.hypot(piece[0].x - piece.at(-1)!.x, piece[0].y - piece.at(-1)!.y).toFixed(0)} px; star 0 y ${star0[0].y} -> ${star0.at(-1)!.y}; ` +
    `XP ${xp.length} values (${xp.slice(0, 3).join(', ')} ... ${xp.at(-1)}); stars on at frames ${firstOn(S.star0)}, ${firstOn(S.star2)}; ` +
    `bars half-full at frames ${firstFull(S.bar0)}, ${firstFull(S.bar4)}; ${r.fps.toFixed(1)} fps`);
  // Beacon grows from its question size (58 of 112 px), not a jump (I34).
  expect(grow[0], 'Beacon starts small').toBeLessThan(0.65);
  expect(grow.at(-1)).toBeCloseTo(1, 2);
  expect(new Set(grow).size, 'over many frames').toBeGreaterThan(5);
  // The burst: the rings spread out and fade away; the wave pieces fly out and fade.
  expect(await bursts(w)).toBe(1);
  expect(Math.max(...ring.map(f => f.op)), 'the ring shows').toBeGreaterThan(0.5);
  expect(Math.max(...ring.map(f => f.sx)), 'and spreads out').toBeGreaterThan(2);
  expect(ring.at(-1)!.op).toBe(0);
  expect(Math.max(...piece.map(f => f.op)), 'a wave piece shows').toBeGreaterThan(0.5);
  expect(Math.hypot(piece[0].x - piece.at(-1)!.x, piece[0].y - piece.at(-1)!.y), 'and flies out').toBeGreaterThan(40);
  expect(piece.at(-1)!.op).toBe(0);
  // The stars drop in, one after another.
  expect(star0[0].y, 'the star drops from above').toBeLessThan(star0.at(-1)!.y - 5);
  expect(firstOn(S.star0)).toBeLessThan(firstOn(S.star2));
  expect(star2.at(-1)!.op).toBe(1);
  // XP counts up like a meter to the real number (3 right, all first time: 30 + 20 for a perfect lesson).
  expect(xp.length, 'XP counts up through many numbers').toBeGreaterThan(5);
  expect(xp.at(-1)).toBe('+50 XP');
  // The bars fill one by one, from the bottom.
  expect(firstFull(S.bar0)).toBeLessThan(firstFull(S.bar4));
  expect(of(S.bar4).at(-1)!.sy).toBeCloseTo(1, 2);
  // All over within a celebration (1.6 s; 0.1 s for the frame that shows it).
  for (const [s, k] of [[S.grow, 'sx'], [S.ring2, 'op'], [S.piece, 'op'], [S.star2, 'y'], [S.xp, 'tx'], [S.bar4, 'sy']] as const)
    expect(settled(s, k), `${s} settled`).toBeLessThanOrEqual(1.7);
  expect(shot).toBe(1);
  expect(r.fps).toBeGreaterThanOrEqual(50);
  await expect(w.getByTestId('stars')).toHaveAttribute('data-count', '3');
  await expect(w.getByTestId('bars')).toHaveAttribute('data-count', '5');
  await expect(w.getByTestId('fixed')).toHaveCount(0);                 // nothing was missed, so nothing was fixed
  await w.screenshot({ path: 'test-results/r12-end.png' });
  await app.close();
});

test('one main button: "Back to the path" (green, full width, Enter), "Again" quiet below it (I32); it works during the celebration', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < SAMPLE.length - 1; i++) { await answer(w, true); await next(w); }
  await answer(w, true);
  await w.getByTestId('next').click();
  await w.getByTestId('done').waitFor();
  const fin = w.getByTestId('finish'), again = w.getByTestId('again');
  await expect(fin).toHaveAttribute('data-kind', 'onAir');
  await expect(again).toHaveAttribute('data-kind', 'quiet');
  // I59: "Again" has its own one-arrow restart icon; the two-arrow repeat icon means review only.
  await expect(again.locator('svg[data-icon=restart]')).toBeVisible();
  await expect(again.locator('svg[data-icon=repeat]')).toHaveCount(0);
  const f = (await fin.boundingBox())!, a = (await again.boundingBox())!;
  expect(a.y, '"Again" sits under the main button').toBeGreaterThan(f.y + f.height);
  expect(f.height).toBeGreaterThan(a.height);
  // "Again" plays the lesson from the start.
  await again.click();
  await expect(w.getByTestId('lesson-count')).toHaveText(`1 / ${SAMPLE.length}`);
  for (let i = 0; i < SAMPLE.length - 1; i++) { await answer(w, true); await next(w); }
  await answer(w, true);
  // Enter, in the middle of the celebration, takes you back to the path at once (and the burst leaves with the lesson).
  await w.getByTestId('next').click();
  await w.getByTestId('done').waitFor(); await w.waitForTimeout(200);
  await expect(w.locator('[data-testid=signal-burst]')).toHaveCount(1);
  await w.keyboard.press('Enter');
  await w.getByTestId('screen-path').waitFor();
  await expect(w.getByTestId('lesson-u1-l1')).toHaveAttribute('data-status', 'done');
  await expect.poll(() => w.locator('[data-testid=signal-burst]').count(), { timeout: 1000 }).toBe(0);
  await app.close();
});

test('a missed question fixed on its comeback shows "1 fixed" (I43); the stars, XP and bars match', async () => {
  const { app, w } = await launch();
  await w.getByTestId('lesson-u1-l1').click();
  await answer(w, false); await next(w);                                          // a miss: it comes back at the end
  for (let i = 0; i < SAMPLE.length - 1; i++) { await answer(w, true); await next(w); }
  await expect(w.getByTestId('comeback')).toBeVisible();
  await answer(w, true); await next(w);                                           // ... and is right this time
  await w.getByTestId('done').waitFor();
  await expect(w.getByTestId('fixed')).toHaveText('1 fixed');
  await expect(w.getByTestId('first-time')).toContainText(`${SAMPLE.length - 1} of ${SAMPLE.length} right the first time`);
  await expect(w.getByTestId('stars')).toHaveAttribute('data-count', '2');
  await expect(w.locator('[data-star-fill]')).toHaveCount(2);
  await expect(w.getByTestId('xp')).toHaveText('+25 XP');                         // 2 right first time (20) + 1 fixed (5)
  await expect(w.getByTestId('bars')).toHaveAttribute('data-count', '3');
  await expect(w.locator('[data-bar-fill]')).toHaveCount(3);
  await w.waitForTimeout(1500); await w.screenshot({ path: 'test-results/r12-fixed.png' });
  await app.close();
});

test('with Reduce motion: no burst, nothing moves; the result is simply there', async () => {
  const { app, w } = await launch({ reduceMotion: true });
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < SAMPLE.length - 1; i++) { await answer(w, true); await next(w); }
  await answer(w, true); await w.waitForTimeout(300);
  const r = await film(w, Object.values(S), () => w.getByTestId('next').click(), 900, S.end);
  const seen = (s: string, k: 'sx' | 'sy' | 'y' | 'tx') => [...new Set(r.of(s).filter(Boolean).map(f => f![k]))];
  console.log(`  Beacon scale ${seen(S.grow, 'sx').join(', ')}; XP ${seen(S.xp, 'tx').join(', ')}; star y ${seen(S.star0, 'y').join(', ')}; bar ${seen(S.bar4, 'sy').join(', ')}`);
  expect(r.of(S.ring0).every(f => !f), 'no burst').toBe(true);
  expect(await bursts(w)).toBe(0);
  expect(seen(S.grow, 'sx')).toEqual([1]);
  expect(seen(S.xp, 'tx')).toEqual(['+50 XP']);
  expect(seen(S.star0, 'y')).toHaveLength(1);
  expect(seen(S.bar4, 'sy')).toEqual([1]);
  await app.close();
});
