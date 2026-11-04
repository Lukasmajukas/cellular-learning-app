import { _electron as electron, test, expect } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Redesign R01: a new save starts on the Night look, and the two bundled fonts load from inside the app (no internet needed).
test('Night is the default look and the bundled fonts load', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '1', CELL_DATA_DIR: mkdtempSync(join(tmpdir(), 'cell-e2e-')) } });
  const w = await app.firstWindow();
  await w.getByTestId('path-count').waitFor();
  await expect(w.locator('html')).toHaveAttribute('data-look', 'night');
  const r = await w.evaluate(async () => {
    await document.fonts.load('16px "Space Grotesk"'); await document.fonts.load('500 16px "JetBrains Mono"'); await document.fonts.ready;
    const body = getComputedStyle(document.body);
    return {
      grotesk: document.fonts.check('16px "Space Grotesk"'), mono: document.fonts.check('500 16px "JetBrains Mono"'),
      loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')),
      font: body.fontFamily, bg: body.backgroundColor, glow: body.backgroundImage,
      // Where each @font-face rule says its font file is.
      fontSrcs: [...document.styleSheets].flatMap(sh => [...sh.cssRules]).filter(r => r instanceof CSSFontFaceRule).map(r => (r as CSSFontFaceRule).style.getPropertyValue('src')),
    };
  });
  expect(r.grotesk).toBe(true); expect(r.mono).toBe(true);
  expect(r.loaded).toEqual(expect.arrayContaining(['Space Grotesk', 'JetBrains Mono']));
  expect(r.font).toContain('Space Grotesk');
  expect(r.bg).toBe('rgb(8, 16, 29)');                 // the Night 'bg' token, #08101D
  expect(r.glow).toContain('radial-gradient');          // the night glow behind the column
  expect(r.fontSrcs.length).toBeGreaterThanOrEqual(5);              // 3 Space Grotesk + 2 JetBrains Mono weights
  expect(r.fontSrcs.filter(s => /https?:/.test(s))).toEqual([]);    // from inside the app, never the internet
  await app.close();
});
