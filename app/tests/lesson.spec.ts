import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
test('path map opens a lesson, finishing it unlocks the next one', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  await expect(w.getByTestId('path-count')).toHaveText('0 of 5 lessons done');
  await expect(w.getByTestId('lesson-u1-l2')).toBeDisabled();
  await w.screenshot({ path: 'test-results/path-start.png' });
  await w.getByTestId('lesson-u1-l1').click();
  await expect(w.getByTestId('mascot')).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await w.getByTestId('choice-0').click();
    await w.screenshot({ path: `test-results/q${i + 1}.png` });
    await w.getByTestId('next').click();
  }
  await expect(w.getByTestId('done')).toBeVisible();
  await w.waitForTimeout(600);
  await w.screenshot({ path: 'test-results/done.png' });
  await w.getByTestId('finish').click();
  await expect(w.getByTestId('path-count')).toHaveText('1 of 5 lessons done');
  await expect(w.getByTestId('lesson-u1-l1')).toHaveAttribute('data-status', 'done');
  await expect(w.getByTestId('lesson-u1-l2')).toBeEnabled();
  await w.waitForTimeout(600);
  await w.screenshot({ path: 'test-results/path-after.png' });
  await app.close();
});
