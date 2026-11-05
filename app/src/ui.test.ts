// Redesign R03 guards: every building block's words are readable on its background (Night and Day), the springs are
// the ones DESIGN.md section 7 names, and the Settings screen stays built from the blocks (no plain grey boxes coming back).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { NIGHT, DAY, type Palette, type TokenKey } from './theme/tokens';
import { contrast } from './theme/contrast';
import { BUTTON, BUTTON_OFF, PILL, TILE, SHEET, type Tone } from './ui/tones';
import { SPRING, PRESS, PRESS_BIG, QUICK_FADE } from './theme/motion';

const SRC = __dirname;
// [what, words, background]; all need 4.5:1 (they're words, some only 13-14 px).
const pairs = (): [string, TokenKey, TokenKey][] => [
  ...Object.entries(BUTTON).map(([k, t]) => [`button ${k}`, t.fg, t.bg] as [string, TokenKey, TokenKey]),
  ['button not ready yet', BUTTON_OFF.fg, BUTTON_OFF.bg],
  ...Object.entries(PILL).map(([k, t]) => [`pill ${k}`, t.fg, t.bg] as [string, TokenKey, TokenKey]),
  ...Object.entries(TILE).flatMap(([k, t]) => [[`tile ${k}`, t.fg, t.bg], [`tile ${k} number`, t.key, t.bg]] as [string, TokenKey, TokenKey][]),
  ...Object.entries(SHEET).flatMap(([k, t]) => [[`sheet ${k}`, t.fg, t.bg], [`sheet ${k} headline`, t.border, t.bg]] as [string, TokenKey, TokenKey][]),
  ['switch knob (on)', 'onBright', 'signal'], ['switch knob (off)', 'textMuted', 'track'],
  ['speech bubble', 'text', 'surface2'], ['freeze pill', 'review', 'surface2'], ['repair card', 'textMuted', 'surface'], ['card label', 'textMuted', 'surface'], ['raised card label', 'textMuted', 'surface2'],
];
const bad = (p: Palette, min = 4.5) => pairs().filter(([, f, b]) => contrast(p[f], p[b]) < (f === 'textMuted' && b === 'track' ? 3 : min))
  .map(([what, f, b]) => `${what}: ${f} on ${b} = ${contrast(p[f], p[b]).toFixed(2)}`);

describe('building blocks: readable colours', () => {
  it('lists every tone (5 buttons, 5 pills, 6 tile states, 3 sheets)', () => {
    expect(Object.keys(BUTTON)).toEqual(['signal', 'onAir', 'miss', 'quiet', 'streak']);
    expect(Object.keys(TILE)).toEqual(['idle', 'selected', 'paired', 'right', 'wrong', 'dim']);
    expect(Object.keys(SHEET)).toEqual(['right', 'wrong', 'info']);
    expect(Object.keys(PILL)).toHaveLength(5);
  });
  it('Night: every pair passes', () => expect(bad(NIGHT)).toEqual([]));
  it('Day: every pair passes', () => expect(bad(DAY)).toEqual([]));
  it('a button you can\'t press yet is dark with an outline, never a see-through bright one (design review 2, I42)', () => {
    expect(BUTTON_OFF).toEqual({ bg: 'surface2', fg: 'textMuted', border: 'borderStrong' });
    const button = readFileSync(join(SRC, 'ui', 'Button.tsx'), 'utf8').split('export function IconButton')[0];
    expect(button).toMatch(/disabled \? BUTTON_OFF : BUTTON\[kind\]/);
    expect(button).not.toMatch(/opacity: disabled/);
  });
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
  it('has a file for each block DESIGN.md section 6 asks of R03 and R04 (R04 added the app frame, AppShell; R05 the unit banner and the lesson node; R07 the top bar; R17 Beacon; R10 the chip; R11 feedback.tsx, the glow, pop, shake and glide of answers; R12 the signal burst; R19 the slider; R20 the look fade)', () => {
    expect(ui.sort()).toEqual(['AnswerTile.tsx', 'AppShell.tsx', 'Beacon.tsx', 'BottomSheet.tsx', 'Button.tsx', 'Card.tsx', 'Chip.tsx', 'LessonNode.tsx', 'LookFade.tsx', 'Pill.tsx', 'ProgressBar.tsx', 'SignalBurst.tsx', 'Slider.tsx', 'SpeechBubble.tsx', 'Switch.tsx', 'TopBar.tsx', 'UnitBanner.tsx', 'feedback.tsx']);
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
    // (R04: no <IconButton> any more: Settings became a tab, so its back button went; the Path tab and Esc go back.)
    for (const block of ['<Switch', '<Card', '<PillChoice', '<Button']) expect(code).toContain(block);
  });
  it('R15: every settings row has its own icon (idea I11), the look is a Night / Day choice, and the sample reads Reduce motion live', () => {
    const code = readFileSync(join(SRC, 'SettingsScreen.tsx'), 'utf8');
    const rows = code.match(/<Row\s/g)!.length;
    expect(rows).toBeGreaterThanOrEqual(8);
    expect(code.match(/<RowIcon\s/g)!.length).toBe(rows); // one icon per row (the Row type also requires one)
    expect(code).toMatch(/testId="set-look"/); expect(code).toMatch(/value: 'night'/); expect(code).toMatch(/value: 'day'/);
    expect(code).toContain('useCalm()'); expect(code).toContain('playSample()');
  });
});

describe('building blocks: Reduce motion is read live', () => {
  it('every block that moves by itself checks useCalm() (Motion alone only reads the setting when a block first appears)', () => {
    for (const f of ['Switch.tsx', 'ProgressBar.tsx', 'BottomSheet.tsx', 'SpeechBubble.tsx', 'AppShell.tsx', 'feedback.tsx', 'AnswerTile.tsx', 'SignalBurst.tsx'])
      expect(readFileSync(join(SRC, 'ui', f), 'utf8'), f).toContain('useCalm()');
  });
});

describe('the Review tab and the notices (R13)', () => {
  it('are built from the blocks, read Reduce motion live, and pause the sweep when the window is hidden', () => {
    const review = readFileSync(join(SRC, 'ReviewScreen.tsx'), 'utf8'), notices = readFileSync(join(SRC, 'Notices.tsx'), 'utf8');
    for (const [f, code] of [['ReviewScreen.tsx', review], ['Notices.tsx', notices]]) {
      expect(code, f).toMatch(/from '\.\/ui'/); expect(code, f).toContain('useCalm()'); expect(code, f).not.toMatch(/<button/);
    }
    expect(review).toContain('useAwake()');
  });
  it('the notice colours are readable: the restored notice\'s words on its background, Night and Day', () => {
    for (const p of [NIGHT, DAY]) expect(contrast(p.notice, p.noticeBg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('the Heatmap tab (R14)', () => {
  it('is built from the blocks (sheet, labels, press springs), reads Reduce motion live, and has no plain buttons', () => {
    const code = readFileSync(join(SRC, 'HeatMapScreen.tsx'), 'utf8');
    expect(code).toMatch(/from '\.\/ui'/); expect(code).toContain('useCalm()'); expect(code).toContain('<BottomSheet');
    expect(code).toContain('usePress('); expect(code).not.toMatch(/<button/);
  });
  it('the sheet you can close: Esc is caught before the app\'s own Esc, and it has a close button and a scrim', () => {
    const code = readFileSync(join(SRC, 'ui', 'BottomSheet.tsx'), 'utf8');
    expect(code).toMatch(/addEventListener\('keydown', esc, true\)/); expect(code).toContain('stopImmediatePropagation');
    expect(code).toContain('label="Close"'); expect(code).toContain('SCRIM');
  });
});
