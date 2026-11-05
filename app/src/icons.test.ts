// Redesign R02 guards (DESIGN.md section 5): screens use our own drawn icons, never emoji or symbol characters,
// because emoji look different on Windows, Mac and iPhone. Lesson text (content/) may still use them.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ICONS, ICON_NAMES } from './theme/icons';

const APP = join(__dirname, '..');
const walk = (dir: string): string[] => readdirSync(dir).flatMap(n => {
  const f = join(dir, n);
  return statSync(f).isDirectory() ? walk(f) : [f];
});
const screens = walk(join(APP, 'src')).filter(f => f.endsWith('.tsx'));
// Comments may mention emoji (the docs call settings "⚙️"); only code and on-screen text count.
const withoutComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
// Emoji, plus the symbol characters that were standing in for icons (arrows, ticks, crosses, stars, block bars).
const BANNED = /\p{Extended_Pictographic}|️|[←-⇿✓-✘★☆▮▯■-◿]/gu;

describe('no emoji in screens', () => {
  it('finds the .tsx screen files', () => expect(screens.length).toBeGreaterThanOrEqual(8));
  it('the check really catches emoji and stand-in symbols', () => {
    expect('🔥 1 ⚡ ⚙️ ✓ ✕ ← ⭐ ▮'.match(BANNED)?.length).toBe(9);
    expect('Right! 5 / 12 · as of 2026 — n41 2496–2690 MHz'.match(BANNED)).toBeNull();
  });
  it('no .tsx file has an emoji or stand-in symbol outside comments', () => {
    const hits = screens.flatMap(f => withoutComments(readFileSync(f, 'utf8')).split('\n')
      .flatMap((line, i) => (line.match(BANNED) ?? []).map(m => `${relative(APP, f)}:${i + 1}: ${m}`)));
    expect(hits).toEqual([]);
  });
});

describe('the icon set', () => {
  it('has every icon DESIGN.md lists', () => {
    for (const n of ['flame', 'bolt', 'tower', 'lock', 'check', 'cross', 'waves', 'mapPin', 'repeat', 'grid', 'gear', 'star', 'freeze', 'repair', 'back', 'close', 'soundOn', 'soundOff', 'info', 'chevron'])
      expect(ICON_NAMES).toContain(n);
  });
  it('has an icon for every settings row (R15, idea I11)', () => {
    for (const n of ['play', 'motion', 'gauge', 'target', 'moon', 'sun', 'backup', 'folder']) expect(ICON_NAMES).toContain(n);
  });
  it('every icon has at least one line, and every number stays inside the 24 x 24 grid', () => {
    for (const n of ICON_NAMES) {
      const s = ICONS[n] as { lines: string[]; dots?: [number, number, number][] };
      expect(s.lines.length, n).toBeGreaterThan(0);
      for (const d of s.lines) {
        expect(d, n).toMatch(/^M/);
        // Absolute M/L coordinates must sit on the grid (relative moves and arc radii are checked by eye in the gallery's icon sheet).
        for (const m of d.matchAll(/[ML]\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/g)) for (const v of [Number(m[1]), Number(m[2])]) {
          expect(v, `${n}: ${d}`).toBeGreaterThanOrEqual(0); expect(v, `${n}: ${d}`).toBeLessThanOrEqual(24);
        }
      }
      for (const [x, y, r] of s.dots ?? []) expect(x - r >= 0 && y - r >= 0 && x + r <= 24 && y + r <= 24, n).toBe(true);
    }
  });
});
