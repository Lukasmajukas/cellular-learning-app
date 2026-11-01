import type { Page } from '@playwright/test';
// Answers "first choice" until the lesson ends (misses come back once, so the count isn't fixed).
export async function playSampleLesson(w: Page) {
  for (let i = 0; i < 12; i++) {
    const done = w.getByTestId('done'), choice = w.locator('[data-testid=choice-0]:not([disabled])');
    await done.or(choice).first().waitFor();          // wait for the next question OR the end screen
    if (await done.isVisible()) return;
    await choice.click(); await w.getByTestId('next').click();
  }
}
