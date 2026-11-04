import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Redesign R02: the main screen shows our own drawn icons (SVG), no emoji, and the icon buttons are big enough to hit (44 x 44).
test('the main screen uses our own icons, not emoji', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  await w.getByTestId('path-count').waitFor();
  for (const [id, icon] of [['open-heatmap', 'grid'], ['open-settings', 'gear'], ['streak', 'flame'], ['xp-total', 'bolt'], ['daily-review', 'repeat'], ['lesson-u1-l1', 'tower']] as const)
    await expect(w.getByTestId(id).locator(`svg[data-icon=${icon}]`), `${id} shows the ${icon} icon`).toBeVisible();
  await expect(w.locator('[data-status=locked] svg[data-icon=lock]').first()).toBeVisible();
  for (const id of ['open-heatmap', 'open-settings']) {
    const b = (await w.getByTestId(id).boundingBox())!;
    expect(b.width).toBeGreaterThanOrEqual(44); expect(b.height).toBeGreaterThanOrEqual(44);
  }
  // The icons take the text colour around them, so they are never black-on-night.
  const stroke = await w.getByTestId('streak').locator('svg').evaluate(s => getComputedStyle(s).stroke);
  expect(stroke).toBe('rgb(255, 191, 71)');                 // the 'streak' token, #FFBF47
  const text = await w.locator('body').innerText();
  expect(text.match(/\p{Extended_Pictographic}|️/gu)).toBeNull();
  // The lesson screen's close button and the settings back button use icons too.
  await w.getByTestId('lesson-u1-l1').click();
  await expect(w.getByTestId('quit').locator('svg[data-icon=close]')).toBeVisible();
  await w.getByTestId('quit').click();
  await w.getByTestId('open-settings').click();
  await expect(w.getByTestId('settings-back').locator('svg[data-icon=back]')).toBeVisible();
  await app.close();
});
