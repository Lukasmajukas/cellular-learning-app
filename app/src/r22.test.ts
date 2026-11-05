// Redesign R22: window sizes, keyboard everywhere, never colour alone. The plain-logic parts; the click tests are in
// tests/sizes.spec.ts and tests/keyboard.spec.ts.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { keyIntent, pressFor } from './keys';
import { NIGHT, DAY, type TokenKey } from './theme/tokens';
import { contrast } from './theme/contrast';
import { ICONS } from './theme/icons';

const APP = join(__dirname, '..');
const el = (tagName: string, more: Record<string, unknown> = {}) => ({ tagName, getAttribute: (n: string) => (more[n] as string) ?? null, ...more });
const press = (key: string, target: unknown = el('BODY'), extra: Record<string, boolean> = {}) => keyIntent({ key, target: target as EventTarget, ...extra });

describe('letter keys (idea I41): A to I pick the match\'s right-hand tiles', () => {
  it('a to i, with or without Shift, are letters; j and later do nothing', () => {
    expect(press('a')).toEqual({ letter: 'a' });
    expect(press('i')).toEqual({ letter: 'i' });
    expect(press('C')).toEqual({ letter: 'c' }); // Shift or Caps Lock
    expect(press('j')).toBeNull();
    expect(press('z')).toBeNull();
  });
  it('a letter typed into a box belongs to the box; Ctrl / Alt with it does nothing', () => {
    expect(press('a', el('INPUT', { type: 'text' }))).toBeNull();
    expect(press('a', el('BODY'), { ctrlKey: true })).toBeNull();
    expect(press('b', el('BODY'), { repeat: true })).toBeNull();
  });
  it('pressFor finds the tile marked with that letter, and only one that is switched on', () => {
    const clicked: string[] = [];
    const root = { querySelector: (sel: string) => (sel === '[data-letter="b"]:not([disabled])' ? { click: () => clicked.push('b') } : null) } as unknown as ParentNode;
    expect(pressFor(root, { letter: 'b' })).toBe(true);
    expect(pressFor(root, { letter: 'c' })).toBe(false);
    expect(clicked).toEqual(['b']);
  });
});

describe('the keyboard\'s focus ring', () => {
  it('is drawn for everything the keyboard reaches (theme.css), 2 px in signal blue', () => {
    const css = readFileSync(join(APP, 'src/theme/theme.css'), 'utf8');
    expect(css).toMatch(/:focus-visible\s*\{\s*outline:\s*2px solid var\(--signal\)/);
    // never switched off anywhere in the screens' own styles
    expect(css).not.toMatch(/outline:\s*(none|0)/);
  });
  // WCAG 1.4.11: a focus ring needs 3:1 against what's around it. The ring sits 2 px outside a control, on the page,
  // a card or a sheet, so check signal against every background a control sits on, in both looks.
  it('stands out (3:1) on every background, in Night and Day', () => {
    const behind: TokenKey[] = ['bg', 'surface', 'surface2', 'onAirBg', 'missBg'];
    for (const [name, p] of [['night', NIGHT], ['day', DAY]] as const)
      for (const b of behind) expect(contrast(p.signal, p[b]), `${name}: signal on ${b}`).toBeGreaterThanOrEqual(3);
  });
  it('the page scrolls a focused control clear of the top bar and the bottom tabs', () => {
    const css = readFileSync(join(APP, 'src/theme/theme.css'), 'utf8');
    expect(css).toMatch(/html:has\(\[data-testid='app-frame'\]\)\s*\{\s*scroll-padding:\s*64px 0 84px/);
  });
});

describe('window sizes', () => {
  it('the window can be made as small as 360 x 560 (the page inside it), not smaller', () => {
    const main = readFileSync(join(APP, 'electron/main.cjs'), 'utf8');
    expect(main).toMatch(/const MIN_SIZE = \{ w: 360, h: 560 \}/);
    expect(main).toMatch(/minWidth: MIN_SIZE\.w, minHeight: MIN_SIZE\.h, useContentSize: true/);
  });
});

describe('the Keys sheet lists every key the app knows', () => {
  it('1-9, A-I, Enter, Esc, the arrows and Tab', async () => {
    const { KEYS } = await import('./SettingsScreen');
    expect(KEYS.map(([k]) => k)).toEqual(['1-9', 'A-I', 'Enter', 'Esc', 'Arrows', 'Tab']);
    for (const [, what] of KEYS) expect(what.split(/\s+/).length, what).toBeLessThanOrEqual(12);
  });
  it('has its own keyboard icon', () => expect(ICONS.keyboard.lines.length).toBeGreaterThan(0));
});
