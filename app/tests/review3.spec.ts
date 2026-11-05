import { _electron as electron, test, expect, type ElectronApplication, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Design review 3 (redesign R24): the small fixes it made, each checked in the real app.
//  1. A sheet's words start on the page's own column, even when the sheet is tall enough to scroll (its scrollbar
//     used to push them 7-8 px to the left: gallery `35-heatmap-sheet`).
//  2. "What happened" on the error screen folds open with our own chevron, like every other fold, not the browser's triangle.
const DAY = 86_400_000;
const launch = async (env: Record<string, string> = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  const now = Date.now();
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: { 'unit01-l1': 3, 'unit01-l2': 3 }, seenChanges: [],
    reviews: { 'u1-4g5g-01': { d: 5, s: 8, due: now + 4 * DAY, last: now - DAY, reps: 2, lapses: 0 } },
    settings: { sounds: false, reduceMotion: true, showFps: false, dailyGoal: 1, look: 'night' } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir, ...env } });
  const w = await app.firstWindow();
  return { app, w };
};
const size = (app: ElectronApplication, width: number, height: number) =>
  app.evaluate(({ BrowserWindow }, s) => BrowserWindow.getAllWindows()[0].setContentSize(s.width, s.height), { width, height });
// Where the page's words start (the tab's small label) and where the open sheet's words start (its title row).
const edges = async (w: Page, tab: string, sheet: string) => {
  const page = (await w.getByTestId(`screen-${tab}`).getByTestId('tab-label').boundingBox())!;
  const words = (await w.getByTestId(`${sheet}-title`).boundingBox())!;
  const scrolls = await w.getByTestId(sheet).evaluate(e => e.scrollHeight > e.clientHeight + 1);
  return { page: Math.round(page.x), sheet: Math.round(words.x), scrolls };
};

test('a sheet starts on the page\'s column, whether it scrolls or not, at every window width (design review 3)', async () => {
  const { app, w } = await launch();
  await w.getByTestId('path-count').waitFor();
  for (const [width, height] of [[620, 960], [1280, 800], [480, 760], [360, 640]]) {
    await size(app, width, height);
    // A tall sheet that scrolls: B71's 15 lessons on the heatmap.
    await w.getByTestId('tab-heatmap').click();
    await w.getByTestId('heatmap').waitFor();
    await w.getByTestId('heat-B71').click();
    await expect(w.getByTestId('heat-sheet')).toBeVisible();
    await w.waitForTimeout(300);
    const tall = await edges(w, 'heatmap', 'heat-sheet');
    await w.keyboard.press('Escape');
    await expect(w.getByTestId('heat-sheet')).toBeHidden();
    // A short sheet that doesn't: Settings, Keys, Show.
    await w.getByTestId('tab-settings').click();
    await w.getByTestId('show-keys').click();
    await expect(w.getByTestId('keys-sheet')).toBeVisible();
    await w.waitForTimeout(300);
    const short = await edges(w, 'settings', 'keys-sheet');
    await w.keyboard.press('Escape');
    await expect(w.getByTestId('keys-sheet')).toBeHidden();
    console.log(`${width} x ${height}: page ${tall.page}, tall sheet ${tall.sheet} (scrolls: ${tall.scrolls}), short sheet ${short.sheet} (scrolls: ${short.scrolls})`);
    if (width === 620) expect(tall.scrolls, 'the B71 sheet must scroll, or this test checks nothing').toBe(true);
    expect(Math.abs(tall.sheet - tall.page), `${width}: tall sheet`).toBeLessThanOrEqual(1);
    expect(Math.abs(short.sheet - short.page), `${width}: short sheet`).toBeLessThanOrEqual(1);
  }
  await app.close();
});

test('"What happened" folds open with our own chevron, not the browser\'s triangle (design review 3)', async () => {
  const { app, w } = await launch({ CELL_TEST_LOAD_FAIL: '1' });
  await w.getByTestId('trouble-load').waitFor();
  const summary = w.getByTestId('trouble-details').locator('summary');
  const look = () => summary.evaluate(e => ({ display: getComputedStyle(e).display, icon: e.querySelector('svg')?.getAttribute('data-icon'),
    turn: e.querySelector('svg')?.style.transform, after: e.firstChild?.nodeType === Node.TEXT_NODE }));
  const closed = await look();
  expect(closed.display).not.toBe('list-item');       // a list-item is what draws the browser's own triangle
  expect(closed).toMatchObject({ icon: 'chevron', turn: 'rotate(90deg)', after: true });  // words first, then a chevron pointing down
  await summary.click();
  await expect(w.getByTestId('trouble-detail')).toBeVisible();
  expect(await look()).toMatchObject({ icon: 'chevron', turn: 'rotate(-90deg)' });       // pointing up once it's open
  await app.close();
});
