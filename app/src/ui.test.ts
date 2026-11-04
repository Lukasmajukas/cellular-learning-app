// Redesign R03 guards: every building block's words are readable on its background (Night and Day), the springs are
// the ones DESIGN.md section 7 names, and the Settings screen stays built from the blocks (no plain grey boxes coming back).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { NIGHT, DAY, type Palette, type TokenKey } from './theme/tokens';
import { contrast } from './theme/contrast';
import { BUTTON, PILL, TILE, SHEET, SPRING, PRESS, PRESS_BIG, QUICK_FADE, type Tone } from './ui/tones';

const SRC = __dirname;
// [what, words, background]; all need 4.5:1 (they're words, some only 13-14 px).
const pairs = (): [string, TokenKey, TokenKey][] => [
  ...Object.entries(BUTTON).map(([k, t]) => [`button ${k}`, t.fg, t.bg] as [string, TokenKey, TokenKey]),
  ...Object.entries(PILL).map(([k, t]) => [`pill ${k}`, t.fg, t.bg] as [string, TokenKey, TokenKey]),
  ...Object.entries(TILE).flatMap(([k, t]) => [[`tile ${k}`, t.fg, t.bg], [`tile ${k} number`, t.key, t.bg]] as [string, TokenKey, TokenKey][]),
  ...Object.entries(SHEET).flatMap(([k, t]) => [[`sheet ${k}`, t.fg, t.bg], [`sheet ${k} headline`, t.border, t.bg]] as [string, TokenKey, TokenKey][]),
  ['switch knob (on)', 'onBright', 'signal'], ['switch knob (off)', 'textMuted', 'track'],
  ['speech bubble', 'text', 'surface2'], ['card label', 'textMuted', 'surface'], ['raised card label', 'textMuted', 'surface2'],
];
const bad = (p: Palette, min = 4.5) => pairs().filter(([, f, b]) => contrast(p[f], p[b]) < (f === 'textMuted' && b === 'track' ? 3 : min))
  .map(([what, f, b]) => `${what}: ${f} on ${b} = ${contrast(p[f], p[b]).toFixed(2)}`);

describe('building blocks: readable colours', () => {
  it('lists every tone (4 buttons, 5 pills, 5 tile states, 2 sheets)', () => {
    expect(Object.keys(BUTTON)).toEqual(['signal', 'onAir', 'miss', 'quiet']);
    expect(Object.keys(TILE)).toEqual(['idle', 'selected', 'right', 'wrong', 'dim']);
    expect(Object.keys(SHEET)).toEqual(['right', 'wrong']);
    expect(Object.keys(PILL)).toHaveLength(5);
  });
  it('Night: every pair passes', () => expect(bad(NIGHT)).toEqual([]));
  it('Day (early values, finished in R20): every pair passes', () => expect(bad(DAY)).toEqual([]));
  it('bright buttons and pills always carry the dark "onBright" words (DESIGN.md section 2)', () => {
    for (const t of [...Object.values(BUTTON), ...Object.values(PILL)] as Tone[]) if (t.bg !== 'surface' && t.bg !== 'surface2') expect(t.fg).toBe('onBright');
  });
});

describe('building blocks: springs (DESIGN.md section 7)', () => {
  it('tap and hover use the "snappy" spring, pop-ins the "bouncy" one', () => {
    expect(SPRING.snappy).toMatchObject({ type: 'spring', stiffness: 500, damping: 30 });
    expect(SPRING.bouncy).toMatchObject({ type: 'spring', stiffness: 300, damping: 14 });
  });
  it('presses are small (never more than 10% bigger or smaller), and the reduce-motion fade is 150 ms at most', () => {
    for (const p of [PRESS, PRESS_BIG]) { expect(p.hover).toBeGreaterThan(1); expect(p.hover).toBeLessThanOrEqual(1.1); expect(p.tap).toBeLessThan(1); expect(p.tap).toBeGreaterThanOrEqual(0.9); }
    expect(QUICK_FADE.duration).toBeLessThanOrEqual(0.15);
  });
});

describe('building blocks: used, and used properly', () => {
  const ui = readdirSync(join(SRC, 'ui')).filter(f => f.endsWith('.tsx'));
  it('has a file for each block DESIGN.md section 6 asks of R03', () => {
    expect(ui.sort()).toEqual(['AnswerTile.tsx', 'BottomSheet.tsx', 'Button.tsx', 'Card.tsx', 'Pill.tsx', 'ProgressBar.tsx', 'SpeechBubble.tsx', 'Switch.tsx']);
  });
  it('every clickable block gets its springs from usePress (so "Reduce motion" turns them all off in one place)', () => {
    for (const f of ui) {
      const code = readFileSync(join(SRC, 'ui', f), 'utf8');
      if (code.includes('motion.button')) expect(code, f).toContain('usePress(');
      expect(code, f).not.toMatch(/whileTap=\{\{/); // no hand-typed squish next to the shared one
    }
  });
  it('blocks never animate width, height, blur or shadow (DESIGN.md section 7)', () => {
    for (const f of ui) {
      const anim = [...readFileSync(join(SRC, 'ui', f), 'utf8').matchAll(/(?:animate|initial|exit|while\w+)=\{\{([^}]*)\}/g)].map(m => m[1]).join(' ');
      expect(anim, f).not.toMatch(/\b(width|height|filter|boxShadow|blur)\s*:/);
    }
  });
  it('the Settings screen is built from the blocks: no plain checkboxes, drop-downs or hand-styled buttons', () => {
    const code = readFileSync(join(SRC, 'SettingsScreen.tsx'), 'utf8');
    expect(code).toMatch(/from '\.\/ui'/);
    expect(code).not.toMatch(/type="checkbox"|<select|<button/);
    for (const block of ['<Switch', '<Card', '<PillChoice', '<Button', '<IconButton']) expect(code).toContain(block);
  });
});

describe('building blocks: Reduce motion is read live', () => {
  it('every block that moves by itself checks useCalm() (Motion alone only reads the setting when a block first appears)', () => {
    for (const f of ['Switch.tsx', 'ProgressBar.tsx', 'BottomSheet.tsx', 'SpeechBubble.tsx'])
      expect(readFileSync(join(SRC, 'ui', f), 'utf8'), f).toContain('useCalm()');
  });
});
