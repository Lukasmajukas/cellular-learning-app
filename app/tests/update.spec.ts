import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// T76: the app updates itself. What you see of it, tried in the real app: the "A new version is ready" notice and the
// "Updates" card in Settings. A click test can't do a real update (that needs an installed Windows app; the Windows
// build proves it with tools/update-e2e.mjs), so CELL_TEST_UPDATE hands the app a pretend updater with a given status.
// The pretend updater remembers what was pressed, and the test reads that back through the app's own door.
const SAVE = (settings: object = {}) => ({ version: 1, progress: { 'u1-l1': 3 }, reviews: {}, seenChanges: [], welcomed: true,
  settings: { sounds: false, reduceMotion: true, showFps: false, dailyGoal: 1, look: 'night', ...settings } });
async function launch(update: object | null, settings: object = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify(SAVE(settings)));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir,
    ...(update ? { CELL_TEST_UPDATE: JSON.stringify(update) } : {}) } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  await expect(w.getByTestId('start-screen')).toHaveCount(0); // the start screen has faded away (so pictures show the app)
  return { app, w, saved: () => JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8')) };
}
type Told = { state: string; restartAsked?: boolean; checkAsked?: number };
const updater = (w: Page) => w.evaluate(() => (window as unknown as { cellApi: { update: { get(): Promise<Told> } } }).cellApi.update.get());
const settings = async (w: Page) => { await w.getByTestId('tab-settings').click(); await w.getByTestId('set-card-updates').waitFor(); };
const READY = { state: 'ready', version: '0.1.177', newVersion: '0.1.180' };

test('a fetched update shows "A new version is ready" with its number; "Restart now" asks for the restart; it can be closed', async () => {
  const { app, w } = await launch(READY);
  const n = w.getByTestId('update-ready');
  await expect(n).toBeVisible();
  await expect(n).toContainText('A new version is ready');
  await expect(w.getByTestId('update-ready-version')).toHaveText('0.1.180');
  await expect(n).toContainText('You get it the next time you open the app. Your progress stays.');
  await expect(n.locator('svg[data-icon=update]')).toBeVisible();
  await w.screenshot({ path: 'test-results/t76-update-ready.png' });
  // It stays on the other tabs too (it's part of the frame).
  await w.getByTestId('tab-review').click();
  await expect(n).toBeVisible();
  // Nothing restarts by itself: only the button asks.
  expect((await updater(w)).restartAsked).toBeUndefined();
  await w.getByTestId('update-restart').click();
  await expect.poll(async () => (await updater(w)).restartAsked).toBe(true);
  // Closing it hides it (the new version is used at the next start anyway) ...
  await w.getByTestId('update-close').click();
  await expect(n).toHaveCount(0);
  // ... and Settings still says so, with its own "Restart now".
  await settings(w);
  await expect(w.getByTestId('version-row')).toContainText('Version 0.1.177');
  await expect(w.getByTestId('version-row')).toContainText('Version 0.1.180 is ready for the next start.');
  await expect(w.getByTestId('update-restart-settings')).toBeVisible();
  await expect(w.getByTestId('update-check')).toHaveCount(0);
  await w.getByTestId('set-card-updates').scrollIntoViewIfNeeded();
  await w.screenshot({ path: 'test-results/t76-settings-ready.png' });
  await app.close();
});

test('the notice never shows in the middle of a lesson, and Enter never restarts the app', async () => {
  const { app, w } = await launch(READY);
  await expect(w.getByTestId('update-ready')).toBeVisible();
  // Enter presses a screen's main button; "Restart now" is not one.
  await w.keyboard.press('Enter');
  await w.waitForTimeout(300);
  expect((await updater(w)).restartAsked).toBeUndefined();
  await w.getByTestId('lesson-u1-l1').click();
  await w.getByTestId('lesson-screen').waitFor();
  await expect(w.getByTestId('update-ready')).toHaveCount(0);
  await w.getByTestId('quit').click();
  await expect(w.getByTestId('update-ready')).toBeVisible(); // back on the path, it's there again
  await app.close();
});

test('Settings: the version, when it last looked, "Check now", and the switch that is saved', async () => {
  const { app, w, saved } = await launch({ state: 'idle', version: '0.1.177', checkedAt: Date.now() - 5 * 60000 });
  await expect(w.getByTestId('update-ready')).toHaveCount(0); // nothing fetched: no notice
  await settings(w);
  const row = w.getByTestId('version-row');
  await expect(row).toContainText('Version 0.1.177');
  await expect(row).toContainText('You have the newest version. Checked 5 minutes ago.');
  await expect(w.getByTestId('update-check')).toBeEnabled();
  await w.getByTestId('update-check').click();
  await expect.poll(async () => (await updater(w)).checkAsked).toBe(1);
  // The switch is on from the start; switching it off is saved and stops the updater.
  await expect(w.getByTestId('set-autoupdate')).toBeChecked();
  await w.getByTestId('set-autoupdate').uncheck();
  await expect(row).toContainText('Not looking for new versions.');
  await expect.poll(() => saved().settings.autoUpdate).toBe(false);
  expect((await updater(w)).state).toBe('off');
  await expect(w.getByTestId('update-check')).toBeEnabled(); // you can still look by hand
  await w.getByTestId('set-autoupdate').check();
  await expect(row).toContainText('You have the newest version.');
  await expect.poll(() => saved().settings.autoUpdate).toBe(true);
  await app.close();
});

test('Settings: a check that got no answer stays calm, with the reason folded away', async () => {
  const { app, w } = await launch({ state: 'failed', version: '0.1.177', detail: 'net::ERR_INTERNET_DISCONNECTED', checkedAt: Date.now() });
  await expect(w.getByTestId('update-ready')).toHaveCount(0); // never a notice for this: no internet is normal
  await settings(w);
  await expect(w.getByTestId('version-row')).toContainText("Couldn't look just now. It tries again by itself.");
  await expect(w.getByTestId('update-check')).toBeEnabled();
  await expect(w.getByTestId('update-detail')).toBeHidden();
  await w.getByTestId('update-details').locator('summary').click();
  await expect(w.getByTestId('update-detail')).toHaveText('net::ERR_INTERNET_DISCONNECTED');
  await app.close();
});

test('outside the installed Windows app (here: the click tests) the updater does nothing and Settings says so', async () => {
  const { app, w } = await launch(null);
  await expect(w.getByTestId('update-ready')).toHaveCount(0);
  expect((await updater(w)).state).toBe('unsupported');
  await settings(w);
  await expect(w.getByTestId('version-row')).toContainText('Updates work in the installed Windows app.');
  await expect(w.getByTestId('version-row')).toContainText(/Version \d+\.\d+\.\d+/);
  await expect(w.getByTestId('update-check')).toBeDisabled();
  await expect(w.getByTestId('set-autoupdate')).toBeChecked(); // the switch still works, for when the app is installed
  await app.close();
});

test('the notice and the card in the Day look', async () => {
  const { app, w } = await launch(READY, { look: 'day' });
  await expect(w.locator('html')).toHaveAttribute('data-look', 'day');
  await expect(w.getByTestId('update-ready')).toBeVisible();
  await w.screenshot({ path: 'test-results/t76-update-ready-day.png' });
  await settings(w);
  await w.getByTestId('set-card-updates').scrollIntoViewIfNeeded();
  await w.screenshot({ path: 'test-results/t76-settings-ready-day.png' });
  await app.close();
});
