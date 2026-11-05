import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { focusRing, tabTo } from './helpers';

// Redesign R22: the keyboard everywhere, with a ring you can always see. A whole lesson of every question type is
// played with the keyboard only (numbers, the match's new letters A-I (idea I41), Tab, Enter), the tap-the-picture
// question too (arrow keys aim, Enter taps), and Tab is walked through every tab, the Keys sheet and the Day look.
// At every stop the ring must be there, not cut off, and not under the top bar or the bottom tabs (helpers.ts focusRing).
const launch = async (done: string[], settings: object = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: Object.fromEntries(done.map(id => [id, 3])), reviews: {}, seenChanges: [],
    settings: { sounds: false, reduceMotion: true, showFps: false, dailyGoal: 2, look: 'night', ...settings } }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow(); await w.getByTestId('path-count').waitFor();
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(620, 960));
  return { app, w };
};
const UNIT1 = ['u1-l1', 'u1-l2', 'u1-l3'];
const kind = (w: Page) => w.getByTestId('kind-label').textContent();
// The answer sheet is up: say which, then Enter goes on (nothing focused, so Enter means the main button).
const verdict = async (w: Page, text: string) => {
  await expect(w.getByTestId('verdict')).toHaveText(text);
  await w.keyboard.press('Enter');
  await expect(w.getByTestId('verdict')).toHaveCount(0);
};

test('a whole lesson of every question type, with the keyboard only; a ring at every Tab stop', async () => {
  test.setTimeout(120_000);
  const { app, w } = await launch([...UNIT1, 'u2-l1', 'u2-l2']);
  // Path: Tab to the lesson and Enter opens it.
  await tabTo(w, 'lesson-u2-l3');
  await w.keyboard.press('Enter');
  // Learn card: Enter is "Got it".
  await expect(w.getByTestId('learn-card')).toBeVisible();
  await w.keyboard.press('Enter');
  // Pick one: the right answer's number key.
  await expect.poll(() => kind(w)).toMatch(/pick one/i);
  await w.keyboard.press(await w.getByTestId('choice-0').getAttribute('data-pick') as string);
  await verdict(w, 'Right!');
  // Type the number: the box has the focus already; Enter checks.
  await expect(w.getByTestId('number-input')).toBeFocused();
  await w.keyboard.type('617'); await w.keyboard.press('Enter');
  await verdict(w, 'Right!');
  // Match the pairs (idea I41): the right column is lettered A, B, C. Press a left one's number, then its partner's letter.
  await expect(w.getByTestId('match-grid')).toBeVisible();
  const rights = w.locator('[data-testid^=match-right-]');
  await expect(rights.locator('[data-key=empty]')).toHaveText(['A', 'B', 'C']);
  for (const i of [2, 0, 1]) {   // out of order on purpose: the number picks which left one is being paired
    await w.keyboard.press(String(i + 1));
    await expect(w.getByTestId(`match-left-${i}`)).toHaveAttribute('data-state', 'selected');
    // Picked is never colour alone: the picked tile's number box is filled in.
    await expect(w.getByTestId(`match-left-${i}`).locator('[data-key]')).toHaveAttribute('data-key', 'filled');
    await w.keyboard.press(await w.getByTestId(`match-right-${i}`).getAttribute('data-letter') as string);
    await expect(w.getByTestId(`match-right-${i}`).locator('[data-key]')).toHaveText(String(i + 1)); // its letter gives way to the partner's number
  }
  await w.screenshot({ path: 'test-results/r22-match-keys.png' });
  await w.keyboard.press('Enter');
  await verdict(w, 'Right!');
  // Put them in order: Tab to each chip, Enter places it; then Tab to Check.
  await expect(w.getByTestId('order-pool')).toBeVisible();
  for (const b of ['B71', 'B12', 'B5', 'B2']) { await tabTo(w, `order-item-${b}`); await w.keyboard.press('Enter'); }
  await tabTo(w, 'check'); await w.keyboard.press('Enter');
  await verdict(w, 'Right!');
  // A carrier question: pick one again.
  await expect.poll(() => kind(w)).toMatch(/pick one/i);
  await w.keyboard.press(await w.getByTestId('choice-0').getAttribute('data-pick') as string);
  await verdict(w, 'Right!');
  // Read the clues: Tab to each answer chip, Enter picks it; Tab to Check.
  await tabTo(w, 'clue-0-choice-0'); await w.keyboard.press('Enter');
  await tabTo(w, 'clue-1-choice-1'); await w.keyboard.press('Enter');
  await tabTo(w, 'check'); await w.keyboard.press('Enter');
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  // Never colour alone: each clue card swaps its magnifier for a tick.
  await expect(w.getByTestId('clue-0').locator('[data-icon=check]').first()).toBeVisible();
  await w.keyboard.press('Enter');
  // Lesson complete: Tab reaches both buttons with a ring; Enter goes back to the path.
  await expect(w.getByTestId('done')).toBeVisible();
  const stops = await tabTo(w, 'again');
  expect(stops).toContain('finish');
  await w.keyboard.press('Shift+Tab');
  await expect(w.getByTestId('finish')).toBeFocused();
  await w.keyboard.press('Enter');
  await expect(w.getByTestId('path-count')).toBeVisible();
  await expect(w.getByTestId('lesson-u2-l3')).toHaveAttribute('data-status', 'done');
  await app.close();
});

test('tap the picture with the keyboard: Tab to it, arrows aim, Enter taps; the dot has a tick or a cross', async () => {
  const { app, w } = await launch([...UNIT1, 'u2-l1', 'u2-l2', 'u2-l3']);
  await tabTo(w, 'lesson-u2-l4'); await w.keyboard.press('Enter');
  await expect(w.getByTestId('photo-credit')).toBeVisible();
  await w.keyboard.press(await w.getByTestId('choice-2').getAttribute('data-pick') as string);   // the photo question: "Monopole"
  await expect(w.getByTestId('verdict')).toBeVisible();
  const first = await w.getByTestId('verdict').textContent();
  await w.keyboard.press('Enter');
  await expect(w.getByTestId('prompt')).toHaveText('Tap the antennas.');
  // No crosshair for the mouse; Tab to the picture shows it in the middle.
  await expect(w.getByTestId('aim')).toHaveCount(0);
  await tabTo(w, 'photo');
  await expect(w.getByTestId('aim')).toHaveAttribute('data-at', '0.5,0.5');
  // A miss first: aim at the grass (bottom left) and tap. The dot is red with a cross.
  for (let i = 0; i < 8; i++) await w.keyboard.press('ArrowLeft');
  for (let i = 0; i < 8; i++) await w.keyboard.press('ArrowDown');
  await expect(w.getByTestId('aim')).toHaveAttribute('data-at', '0.1,0.9');
  await w.screenshot({ path: 'test-results/r22-aim.png' });
  await w.keyboard.press('Enter');
  await expect(w.getByTestId('verdict')).toHaveText('Not quite');
  await expect(w.getByTestId('tap-dot')).toHaveAttribute('data-ok', 'false');
  await expect(w.getByTestId('tap-dot').locator('[data-icon=cross]')).toBeVisible();
  await expect(w.getByTestId('aim')).toHaveCount(0);   // answered: the picture can't be tapped again
  await w.keyboard.press('Enter');
  // The missed questions come back; answer the photo one (if it was missed) and then tap the antennas (top middle).
  if (first !== 'Right!') { await expect(w.getByTestId('prompt')).toContainText('What type of tower');
    await w.keyboard.press(await w.getByTestId('choice-2').getAttribute('data-pick') as string); await verdict(w, 'Right!'); }
  await expect(w.getByTestId('prompt')).toHaveText('Tap the antennas.');
  await tabTo(w, 'photo');
  for (let i = 0; i < 4; i++) await w.keyboard.press('ArrowUp');
  await expect(w.getByTestId('aim')).toHaveAttribute('data-at', '0.5,0.3');
  await w.keyboard.press(' ');   // Space taps too
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await expect(w.getByTestId('tap-dot').locator('[data-icon=check]')).toBeVisible();
  await w.screenshot({ path: 'test-results/r22-tap-right.png' });
  await app.close();
});

test('Tab through every tab, the Keys sheet and the Day look: a ring you can see at every stop', async () => {
  test.setTimeout(120_000);
  const { app, w } = await launch(UNIT1, { reduceMotion: false });
  for (const tab of ['path', 'review', 'heatmap', 'settings']) {
    await w.getByTestId(`tab-${tab}`).click();
    await w.waitForTimeout(600);
    const stops = await tabTo(w, null, tab === 'heatmap' ? 45 : 25);   // throws at the first stop you can't see
    console.log(`${tab}: ${new Set(stops).size} places`);
    expect(stops).toContain(`tab-${tab === 'path' ? 'review' : 'path'}`);
  }
  // The Keys row opens its sheet with Enter; the keyboard lands on Close; Esc gives it back to "Show".
  await w.getByTestId('show-keys').focus();
  await w.keyboard.press('Enter');
  await expect(w.getByTestId('keys-sheet')).toBeVisible();
  await expect(w.getByTestId('keys-sheet').locator('kbd')).toHaveText(['1-9', 'A-I', 'Enter', 'Esc', 'Arrows', 'Tab']);
  await expect(w.getByTestId('keys-sheet-close')).toBeFocused();
  expect((await focusRing(w)).ok).toBe(true);
  await w.screenshot({ path: 'test-results/r22-keys-sheet.png' });
  await w.keyboard.press('Escape');
  await expect(w.getByTestId('keys-sheet')).toHaveCount(0);
  await expect(w.getByTestId('show-keys')).toBeFocused();
  await expect(w.getByTestId('settings')).toBeVisible();   // Esc closed the sheet, it didn't leave the tab
  // The Day look: the same walk on Settings.
  await w.getByTestId('set-look-day').click();
  await expect(w.locator('html')).toHaveAttribute('data-look', 'day');
  await w.waitForTimeout(500);
  await tabTo(w, null, 25);
  await w.screenshot({ path: 'test-results/r22-day-focus.png' });
  await app.close();
});

test('self-check: the ring checker does catch a missing ring and a button hidden under the tabs', async () => {
  const { app, w } = await launch(UNIT1);
  await w.getByTestId('tab-heatmap').click(); await w.getByTestId('heat-B71').waitFor();
  // A tile with its ring switched off.
  await w.evaluate(() => { const s = document.createElement('style'); s.id = 'no-ring'; s.textContent = '[data-testid=heat-B71]:focus-visible { outline: none !important; }'; document.head.append(s); });
  await w.getByTestId('heat-n71').focus(); await w.keyboard.press('Shift+Tab');
  expect(await focusRing(w)).toMatchObject({ ok: false, id: 'heat-B71', why: 'no ring' });
  await w.evaluate(() => document.getElementById('no-ring')!.remove());
  // A tile focused without scrolling while it sits under the bottom tabs.
  const under = await w.evaluate(() => {
    const bar = document.querySelector('[data-testid=tab-bar]')!.getBoundingClientRect();
    const tile = [...document.querySelectorAll<HTMLElement>('button[data-testid^=heat-]')].find(t => { const r = t.getBoundingClientRect(); return r.top < bar.bottom && r.bottom > bar.top + 10; });
    if (!tile) return null;
    tile.focus({ preventScroll: true, focusVisible: true } as FocusOptions);
    return tile.dataset.testid;
  });
  expect(under).toBeTruthy();
  expect(await focusRing(w)).toMatchObject({ ok: false, why: 'under the tab-bar' });
  await app.close();
});
