import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';

const launch = (dir: string) => electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: dir } });
const card = { d: 5, s: 2, due: 1000, last: 0, reps: 1, lapses: 0 };

test('the daily review button plays the due questions, then they are no longer due', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: {}, reviews: { 'demo-1': card, 'demo-2': card } }));
  const app = await launch(dir);
  const w = await app.firstWindow();
  const btn = w.getByTestId('daily-review');
  await expect(btn).toContainText('2 due');
  await btn.click();
  await playSampleLesson(w);
  await w.screenshot({ path: 'test-results/daily-review.png' });
  await w.getByTestId('finish').click();
  await expect(w.getByTestId('daily-review')).toContainText('nothing due');
  await expect(w.getByTestId('path-count')).toHaveText('0 of 7 lessons done');
  await expect(w.getByTestId('streak')).toContainText('1');
  await expect(w.getByTestId('goal-text')).toContainText('Daily goal: 1 of 1');
  await app.close();
  const saved = JSON.parse(readFileSync(join(dir, 'save.json'), 'utf8'));
  expect(saved.reviews['demo-1'].reps).toBe(2);
  expect(Object.keys(saved.progress)).toHaveLength(0);
});
