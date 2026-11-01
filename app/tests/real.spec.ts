import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Opens the app the normal way (no sample switch): the path map must show the real unit 1 lessons, and the first one must open.
test('the path map shows the real lessons and the first one opens', async () => {
  test.setTimeout(120_000);
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  await expect(w.getByTestId('lesson-unit01-l1')).toBeEnabled();
  await expect(w.getByTestId('lesson-unit01-l2')).toBeDisabled();
  await expect(w.getByTestId('lesson-u1-l1')).toHaveCount(0);
  await w.getByTestId('lesson-unit01-l1').click();
  await expect(w.getByTestId('learn-card').or(w.getByTestId('prompt')).first()).toBeVisible();   // the real first screen shows up
  await w.getByTestId('quit').click();
  await expect(w.getByTestId('lesson-unit01-l1')).toBeVisible();
  await app.close();
});
