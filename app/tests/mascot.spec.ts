import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// T45: the mascot's antenna must swing from the tower tip and never leave the mascot's box.
test('mascot antenna stays on the tower tip and inside its box', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  await w.getByTestId('lesson-u1-l1').click();
  const m = w.getByTestId('mascot');
  await m.waitFor();
  let maxOffset = 0;
  for (let i = 0; i < 30; i++) {
    await w.waitForTimeout(100);
    const r = await w.evaluate(() => {
      const ball = document.querySelector('[data-testid=antenna] circle')!.getBoundingClientRect();
      const tower = document.querySelector('[data-testid=mascot] polygon')!.getBoundingClientRect();
      const box = document.querySelector('[data-testid=mascot]')!.getBoundingClientRect();
      return { off: Math.abs(ball.x + ball.width / 2 - (tower.x + tower.width / 2)), inside: ball.top >= box.top - 0.5 && ball.left >= box.left && ball.right <= box.right };
    });
    expect(r.inside).toBe(true);
    maxOffset = Math.max(maxOffset, r.off);
    if (i % 10 === 0) await m.screenshot({ path: `test-results/mascot-${i}.png` });
  }
  // A swing of 12 degrees about the tip moves the ball about 3 pixels. The old bug moved it about 13.
  expect(maxOffset).toBeLessThan(5);
  await app.close();
});
