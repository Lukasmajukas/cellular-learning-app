import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Plays the picture lesson (a drawing): a wrong photo answer, a right one, a wrong tap (shows the outline) and a right tap.
test('photo-choice and tap-the-clue questions work, with credit, outline and tap marker', async () => {
  test.setTimeout(120_000);
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  const progress = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2', 'u2-l3'].map(id => [id, 3]));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress, settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night' }, reviews: {}, game: {} }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  await w.getByTestId('lesson-u2-l4').click();
  await expect(w.getByTestId('photo-credit')).toContainText('CC0');
  await expect(w.getByTestId('photo').locator('img')).toBeVisible();
  await w.getByTestId('choice-0').click();                       // wrong on purpose
  await expect(w.getByTestId('verdict')).toHaveText('Not quite.');
  await expect(w.getByTestId('right-answer')).toContainText('Monopole');
  await expect(w.getByTestId('outline')).toBeVisible();
  await w.screenshot({ path: 'test-results/pictures-photo.png' });
  await w.getByTestId('next').click();
  await expect(w.getByTestId('prompt')).toHaveText('Tap the antennas.');
  await expect(w.getByTestId('verdict')).toHaveCount(0);
  const box = (await w.getByTestId('photo').boundingBox())!;
  await w.mouse.click(box.x + box.width * 0.1, box.y + box.height * 0.9);   // wrong spot (the grass)
  await expect(w.getByTestId('verdict')).toHaveText('Not quite.');
  await expect(w.getByTestId('tap-dot')).toBeVisible();
  await expect(w.getByTestId('outline')).toBeVisible();
  await w.screenshot({ path: 'test-results/pictures-tap-wrong.png' });
  await w.getByTestId('next').click();
  await expect(w.getByTestId('prompt')).toContainText('What type of tower');   // the missed one comes back
  await w.getByTestId('choice-2').click();
  await expect(w.getByTestId('verdict')).toHaveText('Right!'); await w.getByTestId('next').click();
  await expect(w.getByTestId('prompt')).toHaveText('Tap the antennas.');
  await expect(w.getByTestId('verdict')).toHaveCount(0);
  const box2 = (await w.getByTestId('photo').boundingBox())!;
  await w.mouse.click(box2.x + box2.width * 0.5, box2.y + box2.height * 0.3);   // on the antennas
  await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await w.getByTestId('next').click();
  await expect(w.getByTestId('done')).toBeVisible();
  await app.close();
});
