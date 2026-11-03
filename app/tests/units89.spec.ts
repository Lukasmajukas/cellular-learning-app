import { _electron as electron, test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Plays one real unit 8 lesson and one real unit 9 lesson in the real app (T36).
// Units 1-7 are marked done in a made-up save file, so the click test doesn't need to play 34 lessons first.
const EARLIER = ['unit01', 'unit02', 'unit03', 'unit04', 'unit05', 'unit06'].flatMap(u => ['l1', 'l2', 'l3', 'l4', 'check'].map(l => `${u}-${l}`))
  .concat(['unit07-l1', 'unit07-l2', 'unit07-l3', 'unit07-check']);
const UNIT8 = ['unit08-l1', 'unit08-l2', 'unit08-l3', 'unit08-l4', 'unit08-check'];

// Answers whatever question shows up (right or wrong: misses come back once, so the lesson still ends).
async function playAny(w: Page) {
  const seen = new Set<string>();
  for (let step = 0; step < 150; step++) {
    const done = w.getByTestId('done'), next = w.getByTestId('next'), learn = w.getByTestId('learn-ok');
    const choice = w.locator('[data-testid^=choice-]:not([disabled])'), num = w.getByTestId('number-input');
    const left = w.locator('[data-testid^=match-left-]'), clue = w.locator('[data-testid$="-choice-0"]:not([disabled])');
    const order = w.locator('[data-testid^=order-item-]:not([disabled])'), photo = w.getByTestId('photo');
    await done.or(next).or(learn).or(choice).or(num).or(left).or(clue).or(order).first().waitFor();
    if (await done.isVisible()) return step;
    if (await next.isVisible()) { await next.click({ timeout: 3000 }).catch(() => {}); await w.waitForTimeout(250); continue; }
    if (await learn.isVisible()) { await learn.click({ timeout: 3000 }).catch(() => {}); await w.waitForTimeout(250); continue; }
    if (await num.isVisible()) { await num.fill('1'); await w.getByTestId('check').click(); continue; }
    if (await left.count()) {
      const n = await left.count();
      for (let i = 0; i < n; i++) { await w.getByTestId(`match-left-${i}`).click(); await w.getByTestId(`match-right-${i}`).click(); }
      await w.getByTestId('check').click(); continue;
    }
    if (await clue.count()) {
      const n = await w.locator('[data-testid^=clue-][data-testid$="-choice-0"]').count();
      for (let i = 0; i < n; i++) await w.getByTestId(`clue-${i}-choice-0`).click();
      await w.getByTestId('check').click(); continue;
    }
    if (await order.count()) {
      while (await order.count()) await order.first().click();
      await w.getByTestId('check').click(); continue;
    }
    if (await choice.count()) {
      if (await photo.count()) expect(await w.getByTestId('photo-credit').innerText()).not.toBe('');
      await choice.first().click(); continue;
    }
    seen.add('stuck');
  }
  throw new Error('lesson never ended');
}

async function launch(done: string[]) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  const progress: Record<string, number> = {};
  for (const id of done) progress[id] = 3;
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  const errors: string[] = [];
  w.on('pageerror', e => errors.push(String(e)));
  return { app, w, errors };
}
async function playLesson(w: Page, id: string) {
  await w.getByTestId(`lesson-${id}`).scrollIntoViewIfNeeded();
  await w.getByTestId(`lesson-${id}`).click();
  await playAny(w);
  await w.screenshot({ path: `test-results/${id}-done.png` });
  await w.getByTestId('finish').click();
  await expect(w.getByTestId(`lesson-${id}`)).toHaveAttribute('data-status', 'done');
}

test('a real unit 8 lesson can be played to the end and unlocks the next one', async () => {
  test.setTimeout(240_000);
  const { app, w, errors } = await launch(EARLIER);
  await expect(w.getByTestId('lesson-unit08-l1')).toBeEnabled();
  await expect(w.getByTestId('lesson-unit08-l2')).toBeDisabled();
  await playLesson(w, 'unit08-l1');
  await expect(w.getByTestId('lesson-unit08-l2')).toBeEnabled();
  expect(errors).toEqual([]);
  await app.close();
});

test('a real unit 9 lesson can be played to the end and unlocks the next one', async () => {
  test.setTimeout(240_000);
  const { app, w, errors } = await launch([...EARLIER, ...UNIT8]);
  await expect(w.getByTestId('lesson-unit09-l1')).toBeEnabled();
  await expect(w.getByTestId('lesson-unit09-l2')).toBeDisabled();
  await playLesson(w, 'unit09-l1');
  await expect(w.getByTestId('lesson-unit09-l2')).toBeEnabled();
  expect(errors).toEqual([]);
  await app.close();
});

// Unit 10 (T37): play one real two-clue lesson of the final challenge.
test('a real unit 10 lesson can be played to the end and unlocks the next one', async () => {
  test.setTimeout(240_000);
  const UNIT9 = ['unit09-l1', 'unit09-l2', 'unit09-l3', 'unit09-l4', 'unit09-check'];
  const { app, w, errors } = await launch([...EARLIER, ...UNIT8, ...UNIT9]);
  await expect(w.getByTestId('lesson-unit10-l1')).toBeEnabled();
  await expect(w.getByTestId('lesson-unit10-l2')).toBeDisabled();
  await playLesson(w, 'unit10-l1');
  await expect(w.getByTestId('lesson-unit10-l2')).toBeEnabled();
  expect(errors).toEqual([]);
  await app.close();
});
