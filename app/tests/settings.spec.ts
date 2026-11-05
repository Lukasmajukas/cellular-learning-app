import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film } from './helpers';

// Redesign R15: the Settings tab in the new look. Every row has its own icon (idea I11); "Play a sample" plays a right
// answer and a not-quite one (even with Sounds off) and sends a soft ring out with each; the look is a Night / Day choice;
// the keys are listed (idea I18). With Reduce motion the sample's icon only glows.
const launch = async (settings: object = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: {}, reviews: {}, seenChanges: [],
    settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night', ...settings } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  await w.getByTestId('tab-settings').click(); await w.getByTestId('settings').waitFor();
  return { app, w };
};
// A pretend sound card: records every tone the app starts (its first pitch and when), so the test can "hear" the sample.
const fakeAudio = (w: Page) => w.evaluate(() => {
  const tones: { hz: number; at: number }[] = [];
  (window as unknown as { __tones: typeof tones }).__tones = tones;
  class Fake {
    currentTime = 0; destination = {};
    createGain() { return { gain: { value: 0 }, connect() {} }; }
    createOscillator() {
      let hz = 0;
      return { type: '', connect() {}, stop() {}, frequency: { set value(v: number) { hz = v; }, setValueAtTime(v: number) { if (!hz) hz = v; } },
        start: (at: number) => tones.push({ hz, at }) };
    }
  }
  (window as unknown as { AudioContext: unknown }).AudioContext = Fake;
});
const tones = (w: Page) => w.evaluate(() => (window as unknown as { __tones: { hz: number; at: number }[] }).__tones);
const ring = (k: number) => `[data-testid=sample-row] [data-ring="${k}"]`;

test('settings: every row has its icon, the look is Night or Day, and the keys are listed', async () => {
  const { app, w } = await launch();
  const s = w.getByTestId('settings');
  await expect(s.locator('h1')).toHaveText('Settings');
  const icons = await s.locator('[data-row-icon]').evaluateAll(els => els.map(e => (e as HTMLElement).dataset.rowIcon));
  expect(icons).toEqual(['soundOff', 'play', 'motion', 'gauge', 'target', 'moon', 'backup', 'folder']);
  for (const card of ['sound', 'motion', 'goal', 'look', 'progress', 'keys']) await expect(w.getByTestId(`set-card-${card}`)).toBeVisible();
  await expect(w.getByTestId('set-card-keys').locator('kbd')).toHaveText(['1-9', 'Enter', 'Esc']);
  // Sounds on: its icon changes to the speaker with waves.
  await w.getByTestId('set-sounds').check();
  await expect(s.locator('[data-row-icon]').first()).toHaveAttribute('data-row-icon', 'soundOn');
  // The look: Night is picked; Day switches the whole app's colours, and the row says so with a sun.
  await expect(w.getByTestId('set-look-night')).toHaveAttribute('aria-checked', 'true');
  await w.getByTestId('set-look-day').click();
  await expect(w.locator('html')).toHaveAttribute('data-look', 'day');
  await expect(w.getByTestId('set-card-look').locator('[data-row-icon]')).toHaveAttribute('data-row-icon', 'sun');
  await expect(w.getByTestId('set-card-look')).toContainText('Light colours');
  await w.screenshot({ path: 'test-results/r15-settings-day.png', fullPage: true });
  // Arrow keys move back to Night, keeping the keyboard on the choice.
  await w.getByTestId('set-look-day').focus(); await w.keyboard.press('ArrowLeft');
  await expect(w.locator('html')).toHaveAttribute('data-look', 'night');
  await expect(w.getByTestId('set-look-night')).toBeFocused();
  // Clicking a row's words with a button doesn't press the button (only switch rows are labels).
  await w.getByText('Play a sample').click();
  await expect(w.getByTestId('sound-sample')).toHaveAttribute('data-playing', 'false');
  await app.close();
});

test('play a sample: a right tone, then a not-quite one, even with Sounds off; a ring goes out with each; 50+ fps', async () => {
  const { app, w } = await launch({ sounds: false });
  await fakeAudio(w);
  const f = await film(w, [ring(0), ring(1)], () => w.getByTestId('sound-sample').click(), 2600, ring(0));
  const t = await tones(w);
  expect(t.map(x => x.hz)).toEqual([660, 200]);                 // the "ding", then the "bup" ...
  expect(t[1].at - t[0].at).toBeCloseTo(0.4, 5);                // ... 0.4 s later
  const a = f.of(ring(0)).filter(Boolean), b = f.of(ring(1)).filter(Boolean);
  console.log(`ring 1 ${a.slice(0, 5).map(x => `${x!.sx}/${x!.op}`)} ... ${a.at(-1)!.sx}/${a.at(-1)!.op}; ${f.fps.toFixed(1)} fps`);
  for (const r of [a, b]) { expect(r[0]!.sx).toBeLessThan(1.1); expect(r.at(-1)!.sx).toBeGreaterThan(1.8); expect(r.at(-1)!.op).toBeLessThan(0.05); }
  // The second ring waits for the second tone: it's still small when the first is already big.
  const half = a.findIndex(x => x!.sx > 1.45);
  expect(b[half]!.sx).toBeLessThan(1.1);
  expect(f.fps).toBeGreaterThanOrEqual(50);
  await expect(w.getByTestId('sound-sample')).toHaveAttribute('data-playing', 'false');
  // Sounds stay off: playing the sample didn't switch them on.
  await expect(w.getByTestId('set-sounds')).not.toBeChecked();
  await app.close();
});

test('play a sample with Reduce motion: no rings, the icon only glows', async () => {
  const { app, w } = await launch({ reduceMotion: true });
  await fakeAudio(w);
  await w.getByTestId('sound-sample').click();
  await expect(w.getByTestId('sound-sample')).toHaveAttribute('data-playing', 'true');
  await expect(w.locator('[data-testid=sample-row] [data-part=glow]')).toHaveCSS('opacity', '1');
  await expect(w.locator('[data-testid=sample-row] [data-part=ring]')).toHaveCount(0);
  expect((await tones(w)).length).toBe(2);
  await expect(w.getByTestId('sound-sample')).toHaveAttribute('data-playing', 'false');
  await expect(w.locator('[data-testid=sample-row] [data-part=glow]')).toHaveCSS('opacity', '0');
  await app.close();
});
