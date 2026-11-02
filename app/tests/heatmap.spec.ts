import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// A fresh save has no answers yet, so the heatmap opens with taught bands all "new" (grey), and Back returns to the path map.
test('the band memory heatmap opens and closes', async () => {
  test.setTimeout(120_000);
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  await w.getByTestId('open-heatmap').click();
  await expect(w.getByTestId('heatmap')).toBeVisible();
  await expect(w.getByTestId('heat-B71')).toHaveAttribute('data-label', 'new');
  await expect(w.getByTestId('heat-n260')).toBeVisible();
  await w.getByTestId('heatmap-back').click();
  await expect(w.getByTestId('lesson-unit01-l1')).toBeVisible();
  await app.close();
});
