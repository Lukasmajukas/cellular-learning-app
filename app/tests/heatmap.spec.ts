import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R14: the Heatmap tab ("band memory") in the real app. Band tiles glow brighter the better you remember them,
// with signal bars and a % so colour is never the only clue; a legend counts each level; tiles fill in one after another
// the first time you look (not again when you come back); tapping a tile opens a sheet with the lessons that ask about
// that band, and you can play one from there. Esc and the dark backdrop close the sheet.
const DAY = 86_400_000;
// Questions from unit 1 (they ask about B71, n71, B12, B2, B25, n25, B66, n41 and n77), answered at different ages, so the
// tiles show several levels (the same made-up save as the gallery's).
const IDS = ['u1-4g5g-01', 'u1-4g5g-02', 'u1-higher-01', 'u1-twin-01', 'u1-higher-02', 'u1-tier-01', 'u1-tier-02', 'u1-fr-01',
  'u1-duplex-01', 'u1-duplex-02', 'u1-duplex-03', 'u1-gap-01'];
const seeded = () => {
  const now = Date.now();
  return Object.fromEntries(IDS.map((id, i) => {
    const age = [0.2, 1, 3, 6, 12, 20][i % 6], s = [8, 4, 3, 2, 1.5, 1][i % 6];
    return [id, { d: 5, s, due: now - age * DAY + Math.round(s) * DAY, last: now - age * DAY, reps: 2, lapses: 0 }];
  }));
};
const launch = async (reviews: object, reduceMotion = false) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: { 'unit01-l1': 3, 'unit01-l2': 3 }, reviews, seenChanges: [],
    settings: { sounds: false, reduceMotion, showFps: false, dailyGoal: 1, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  return { app, w };
};
const toHeat = async (w: Page) => { await w.getByTestId('tab-heatmap').click(); await w.getByTestId('heatmap').waitFor(); };
const fill = (id: string) => `[data-testid=heat-${id}] [data-part=fill]`;
const labels = (w: Page) => w.locator('[data-testid^=heat-][data-label]:not([data-testid=heat-detail])')
  .evaluateAll(els => els.map(e => [(e as HTMLElement).dataset.testid!.slice(5), (e as HTMLElement).dataset.label!] as const));

test('band memory: tiles fill in one after another and glow brighter the better you remember; 50+ fps', async () => {
  const { app, w } = await launch(seeded());
  const f = await film(w, [fill('B71'), fill('B12'), fill('n77')], () => toHeat(w), 1400, fill('B71'));
  const first = f.of(fill('B71')).filter(Boolean), mid = f.of(fill('B12')).filter(Boolean), last = f.of(fill('n77')).filter(Boolean);
  console.log(`B71 fill ${first.slice(0, 6).map(x => x!.sy)} ... ${first.at(-1)!.sy}; n77 ${last.slice(0, 6).map(x => x!.sy)}; ${f.fps.toFixed(1)} fps`);
  // Each fill starts empty (squashed to nothing, see-through) and ends full; later tiles start later (one after another).
  for (const fr of [first, mid, last]) { expect(fr[0]!.sy).toBeLessThan(0.2); expect(fr.at(-1)!.sy).toBeCloseTo(1, 2); expect(fr.at(-1)!.op).toBe(1); }
  const grown = (fr: typeof first) => fr.findIndex(x => x!.sy > 0.5);
  expect(grown(mid)).toBeGreaterThan(grown(first)); expect(grown(last)).toBeGreaterThan(grown(mid));
  expect(f.fps).toBeGreaterThanOrEqual(50);
  // Glow: brighter the better. Every quizzed tile's glow is up to its own brightness; sorted by level, they never go down.
  const glows = await w.locator('[data-part=glow]').evaluateAll(els => els.map(e => {
    const t = e.closest('[data-label]') as HTMLElement;
    return { id: t.dataset.testid!.slice(5), label: t.dataset.label!, op: Number(getComputedStyle(e).opacity), want: Number((e as HTMLElement).dataset.glow) };
  }));
  console.log(glows.map(g => `${g.id} ${g.label} ${g.op}`).join(', '));
  for (const g of glows) expect(g.op, g.id).toBeCloseTo(g.want, 2);
  const rank = { fading: 0, okay: 1, strong: 2 } as Record<string, number>;
  for (const a of glows) for (const b of glows) if (rank[a.label] < rank[b.label]) expect(a.op, `${a.id} < ${b.id}`).toBeLessThan(b.op);
  expect(new Set(glows.map(g => g.label)).size).toBeGreaterThanOrEqual(2); // the seed really shows more than one level
  // Every quizzed tile has signal bars; new ones say "new". The legend counts what the tiles say.
  const all = await labels(w);
  const count = (l: string) => all.filter(([, x]) => x === l).length;
  for (const l of ['strong', 'okay', 'fading', 'new']) await expect(w.getByTestId(`heat-legend-${l}`)).toContainText(String(count(l)));
  expect(await w.locator('[data-testid^=heat-] svg[data-bars]').count()).toBe(all.length - count('new'));
  await expect(w.getByTestId('heat-hint')).toContainText('glows brighter');
  await w.screenshot({ path: 'test-results/r14-heatmap.png' });
  // Back on the path and here again: the tiles are already known, so none fills in again.
  await w.getByTestId('tab-path').click(); await w.getByTestId('screen-path').waitFor();
  const again = await film(w, [fill('B71'), fill('n77')], () => toHeat(w), 700, fill('B71'));
  expect(again.of(fill('B71')).filter(Boolean).every(x => x!.sy === 1)).toBe(true);
  expect(again.of(fill('n77')).filter(Boolean).every(x => x!.sy === 1)).toBe(true);
  await app.close();
});

test('tap a tile: a sheet lists its lessons; Esc and the backdrop close it; a lesson plays from there', async () => {
  test.setTimeout(120_000);
  const { app, w } = await launch(seeded());
  await toHeat(w);
  await w.getByTestId('heat-B71').click();
  const sheet = w.getByTestId('heat-sheet');
  await expect(sheet).toBeVisible();
  await expect(w.getByTestId('heat-sheet-title')).toContainText('B71');
  const label = await w.getByTestId('heat-B71').getAttribute('data-label');
  await expect(w.getByTestId('heat-detail')).toHaveAttribute('data-label', label!);
  // Its lessons, in path order: the two finished ones, then the next one, then locked ones (quiet lines, not buttons).
  await expect(w.getByTestId('heat-lesson-unit01-l1')).toHaveAttribute('data-status', 'done');
  await expect(w.getByTestId('heat-lesson-unit01-l2')).toHaveAttribute('data-status', 'done');
  await expect(w.getByTestId('heat-lesson-unit01-l4')).toHaveAttribute('data-status', 'locked');
  expect(await w.getByTestId('heat-lesson-unit01-l4').evaluate(e => e.tagName)).toBe('DIV');
  // The keyboard lands on the close button; Esc closes the sheet and stays on the heatmap, with the focus back on the tile.
  await expect(w.getByTestId('heat-sheet-close')).toBeFocused();
  await w.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(w.getByTestId('heatmap')).toBeVisible();
  await expect(w.getByTestId('heat-B71')).toBeFocused();
  // Enter on the focused tile opens it again; clicking the dark backdrop closes it.
  await w.keyboard.press('Enter');
  await expect(sheet).toBeVisible();
  await w.getByTestId('heat-sheet-scrim').click({ position: { x: 20, y: 20 } });
  await expect(sheet).toBeHidden();
  // A second Esc (no sheet open) leaves the tab, as before.
  await w.keyboard.press('Escape');
  await expect(w.getByTestId('screen-path')).toBeVisible();
  // The next lesson, played from n77's sheet: the lesson opens; leaving it comes back to the heatmap.
  await toHeat(w);
  await w.getByTestId('heat-n77').click();
  const next = w.locator('[data-testid^=heat-lesson-][data-status=current]').first();
  await expect(next).toBeVisible();
  await w.screenshot({ path: 'test-results/r14-heatmap-sheet.png' });
  await next.click();
  await expect(w.getByTestId('lesson-screen')).toBeVisible();
  await expect(w.getByTestId('heat-sheet')).toBeHidden();
  await w.getByTestId('quit').click();
  await expect(w.getByTestId('heatmap')).toBeVisible();
  await app.close();
});

test('a fresh save: every taught band is "new", and the words say how they light up', async () => {
  const { app, w } = await launch({});
  await toHeat(w);
  await expect(w.getByTestId('heat-B71')).toHaveAttribute('data-label', 'new');
  await expect(w.getByTestId('heat-n260')).toBeVisible();
  const all = await labels(w);
  expect(all.every(([, l]) => l === 'new')).toBe(true);
  await expect(w.getByTestId('heat-legend-new')).toContainText(String(all.length));
  await expect(w.getByTestId('heat-hint')).toContainText('lights up here');
  await w.getByTestId('heat-n260').click();
  await expect(w.getByTestId('heat-detail-level')).toHaveText('Not asked yet');
  await w.getByTestId('heat-sheet-close').click();
  await expect(w.getByTestId('heat-sheet')).toBeHidden();
  await w.getByTestId('tab-path').click();
  await expect(w.getByTestId('lesson-unit01-l1')).toBeVisible();
  await app.close();
});

test('Reduce motion: the tiles are simply there (nothing fills in), and the sheet still opens', async () => {
  const { app, w } = await launch(seeded(), true);
  const f = await film(w, [fill('B71'), fill('n77')], () => toHeat(w), 700, fill('B71'));
  for (const s of [fill('B71'), fill('n77')]) expect(f.of(s).filter(Boolean).every(x => x!.sy === 1 && x!.op === 1), s).toBe(true);
  await w.getByTestId('heat-B71').click();
  await expect(w.getByTestId('heat-sheet')).toBeVisible();
  await app.close();
});
