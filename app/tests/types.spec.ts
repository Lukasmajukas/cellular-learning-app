import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { playSampleLesson } from './helpers';
// Plays the demo lesson with every question type, misses one on purpose, and checks the streak, XP and retry.
test('every question type works, a miss comes back, XP and streak show', async () => {
  test.setTimeout(180_000);
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  // unlock the demo lesson by finishing the five sample lessons
  for (const id of ['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2']) {
    await w.getByTestId(`lesson-${id}`).click();
    await playSampleLesson(w);
    await w.getByTestId('finish').click();
  }
  await w.getByTestId('lesson-u2-l3').click();
  await w.getByTestId('learn-ok').click();                      // learn card (with spectrum bar shown)
  await w.getByTestId('choice-1').click();                      // WRONG on purpose (4G)
  await expect(w.getByTestId('verdict')).toHaveText('Not quite.');
  await expect(w.getByTestId('right-answer')).toContainText('5G');
  await w.screenshot({ path: 'test-results/t32-wrong.png' });
  await w.getByTestId('next').click();
  await w.getByTestId('number-input').fill('617'); await w.getByTestId('check').click();
  await expect(w.getByTestId('verdict')).toHaveText('Right!'); await w.getByTestId('next').click();
  for (let i = 0; i < 3; i++) { await w.getByTestId(`match-left-${i}`).click(); await w.getByTestId(`match-right-${i}`).click(); }
  await w.getByTestId('check').click(); await expect(w.getByTestId('verdict')).toHaveText('Right!'); await w.getByTestId('next').click();
  // the missed question comes back once, 3 steps later
  await expect(w.getByTestId('prompt')).toContainText('4G or 5G');
  await w.getByTestId('choice-0').click(); await w.getByTestId('next').click();
  for (const b of ['B71', 'B12', 'B5', 'B2']) await w.getByTestId(`order-item-${b}`).click();
  await w.getByTestId('check').click(); await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await expect(w.getByTestId('order-bar')).toBeVisible(); await w.screenshot({ path: 'test-results/t32-order.png' });
  await w.getByTestId('next').click();
  await w.getByTestId('choice-0').click();                      // carrier question: shows the badge
  await expect(w.getByTestId('badge')).toContainText('HISTORICAL · as of 2026'); await w.getByTestId('next').click();
  await w.getByTestId('clue-0-choice-0').click(); await w.getByTestId('clue-1-choice-1').click();   // scenario: both clues right
  await w.getByTestId('check').click(); await expect(w.getByTestId('verdict')).toHaveText('Right!');
  await expect(w.getByTestId('clue-why-0')).toHaveAttribute('data-ok', 'true'); await w.getByTestId('next').click();
  await expect(w.getByTestId('done')).toBeVisible();
  await expect(w.getByTestId('xp')).toHaveText('+55 XP');       // 5 right first try (50) + the missed one right on its retry (5), no perfect bonus
  await w.getByTestId('finish').click();
  await expect(w.getByTestId('streak')).toHaveText('1');
  await app.close();
});
