import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';

const launch = (dir: string) => electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_DATA_DIR: dir } });

test('progress and settings survive closing and reopening, and a backup exists', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  let app = await launch(dir);
  let w = await app.firstWindow();
  await w.getByTestId('lesson-u1-l1').click();
  await playSampleLesson(w);
  await w.getByTestId('finish').click();
  await expect(w.getByTestId('path-count')).toHaveText('1 of 6 lessons done');
  await w.getByTestId('open-settings').click();
  await w.getByTestId('set-sounds').uncheck();
  await w.getByTestId('set-dark').check();
  await w.getByTestId('backup-now').click();
  await expect(w.getByTestId('settings-note')).toContainText('Backup saved: save-');
  await w.screenshot({ path: 'test-results/settings.png' });
  await app.close();

  expect(JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8')).settings.sounds).toBe(false);
  expect(readdirSync(join(dir, 'backups')).length).toBe(1);
  const saved = JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8'));
  expect(saved.game.streak).toBe(1); expect(saved.game.xp).toBeGreaterThan(0); expect(Object.keys(saved.reviews).length).toBe(3); // 3 questions have a review card

  app = await launch(dir);
  w = await app.firstWindow();
  await expect(w.getByTestId('path-count')).toHaveText('1 of 6 lessons done');
  await expect(w.getByTestId('lesson-u1-l2')).toBeEnabled();
  await expect(w.getByTestId('streak')).toHaveText('🔥 1');
  await w.getByTestId('open-settings').click();
  await expect(w.getByTestId('set-sounds')).not.toBeChecked();
  await expect(w.getByTestId('set-dark')).toBeChecked();
  await app.close();
});
