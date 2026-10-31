import { _electron as electron, test, expect } from '@playwright/test';
test('lesson plays through in the real Electron app', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'] });
  const w = await app.firstWindow();
  await expect(w.getByTestId('mascot')).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await w.getByTestId('choice-0').click();
    await w.screenshot({ path: `test-results/q${i + 1}.png` });
    await w.getByTestId('next').click();
  }
  await expect(w.getByTestId('done')).toBeVisible();
  await w.waitForTimeout(600);
  await w.screenshot({ path: 'test-results/done.png' });
  await app.close();
});
