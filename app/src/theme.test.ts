// Redesign R01 guards: the old Duolingo colours never come back, screens take colours only from the token file,
// and every text colour is readable on the backgrounds it's used on (DESIGN.md section 2).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { NIGHT, DAY, TOKEN_KEYS, cssVar, type Palette, type TokenKey } from './theme/tokens';
import { contrast } from './theme/contrast';

const APP = join(__dirname, '..');
const walk = (dir: string): string[] => readdirSync(dir).flatMap(n => {
  const f = join(dir, n);
  return statSync(f).isDirectory() ? walk(f) : [f];
});
const sourceFiles = [...walk(join(APP, 'src')), ...walk(join(APP, 'electron')), join(APP, 'index.html')]
  .filter(f => /\.(tsx?|css|html|cjs)$/.test(f));

describe('no Duolingo colours', () => {
  // Their exact brand colours (decision of 2026-10-31: nothing copied from Duolingo).
  const BANNED = ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#D7FFB8', '#FFDFE0'];
  it('none of the banned colour codes appear anywhere in the app', () => {
    const hits = sourceFiles.filter(f => !f.endsWith('theme.test.ts')).flatMap(f => {
      const text = readFileSync(f, 'utf8').toUpperCase();
      return BANNED.filter(b => text.includes(b)).map(b => `${relative(APP, f)}: ${b}`);
    });
    expect(hits).toEqual([]);
  });
  it('screens take every colour from the token file (no colour codes in .tsx files)', () => {
    const hits = sourceFiles.filter(f => f.endsWith('.tsx')).flatMap(f =>
      (readFileSync(f, 'utf8').match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) ?? []).map(m => `${relative(APP, f)}: ${m}`));
    expect(hits).toEqual([]);
  });
});

describe('CSS variables', () => {
  it('every var(--name) in the app is a real token (a typo would silently show no colour)', () => {
    const known = new Set([...TOKEN_KEYS.map(cssVar), '--font-body', '--font-mono']);
    const used = sourceFiles.filter(f => !f.endsWith('.test.ts')).flatMap(f => [...readFileSync(f, 'utf8').matchAll(/var\((--[a-z0-9-]+)/g)].map(m => `${relative(APP, f)}: ${m[1]}`));
    expect(used.length).toBeGreaterThan(5);
    expect(used.filter(u => !known.has(u.split(': ')[1]))).toEqual([]);
  });
});

describe('text contrast', () => {
  // [words, background, minimum]. 4.5 for text, 3 for icons, big numbers and drawings.
  const PAIRS: [TokenKey, TokenKey, number][] = [
    ...(['bg', 'surface', 'surface2'] as TokenKey[]).flatMap(b => [
      ['text', b, 4.5], ['textMuted', b, 4.5], ['signal', b, 4.5], ['streak', b, 4.5], ['onAir', b, 4.5], ['review', b, 4.5],
    ] as [TokenKey, TokenKey, number][]),
    ['onBright', 'signal', 4.5], ['onBright', 'onAir', 4.5], ['onBright', 'miss', 4.5], ['onBright', 'streak', 4.5], ['onBright', 'review', 4.5],
    ['onAir', 'onAirBg', 4.5], ['text', 'onAirBg', 4.5],
    ['miss', 'missBg', 4.5], ['missText', 'missBg', 4.5], ['text', 'missBg', 4.5],
    ['notice', 'noticeBg', 4.5],
    ['streak', 'streakBg', 4.5], ['text', 'streakBg', 4.5], ['textMuted', 'streakBg', 4.5], ['textMuted', 'onAirBg', 4.5], ['textMuted', 'missBg', 4.5], // the heatmap's fills (R20)
    ['lockedIcon', 'bg', 3], ['textMuted', 'track', 3],
    ...(['bg', 'surface', 'surface2'] as TokenKey[]).map(b => ['beacon', b, 3] as [TokenKey, TokenKey, number]), // Beacon's tower is a drawing (R17)
    ...(['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6'] as TokenKey[]).map(k => [k, 'surface', 3] as [TokenKey, TokenKey, number]),
  ];
  const check = (p: Palette) => PAIRS.filter(([f, b, min]) => contrast(p[f], p[b]) < min)
    .map(([f, b, min]) => `${f} on ${b}: ${contrast(p[f], p[b]).toFixed(2)} (needs ${min})`);
  it('the formula is right (black on white is 21, same colour is 1)', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#3FD8F2', '#3FD8F2')).toBe(1);
  });
  it('Night: every pair passes', () => expect(check(NIGHT)).toEqual([]));
  it('Day: every pair passes', () => expect(check(DAY)).toEqual([]));
  it('both looks define every token as a 6-digit colour code', () => {
    for (const p of [NIGHT, DAY]) for (const k of TOKEN_KEYS) expect(p[k]).toMatch(/^#[0-9A-F]{6}$/);
  });
});
