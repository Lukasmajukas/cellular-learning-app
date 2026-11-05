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

// Idea I59 (design review 2): one icon, one meaning. The two-arrow "repeat" means review and nothing else;
// "Again" on lesson complete (play this lesson from the start) has its own one-arrow "restart".
describe('repeat means review, restart means again (I59)', () => {
  const uses = (name: string) => screens.flatMap(f => withoutComments(readFileSync(f, 'utf8')).split('\n')
    .filter(l => l.includes(`"${name}"`) || l.includes(`'${name}'`)).map(l => `${relative(APP, f)}: ${l.trim()}`));
  it('restart is its own drawing, not a copy of repeat', () => {
    expect(ICON_NAMES).toContain('restart');
    expect(ICONS.restart.lines).not.toEqual(ICONS.repeat.lines);
  });
  it('"Again" uses restart', () => {
    const again = uses('again');
    expect(again.length).toBeGreaterThan(0);
    for (const l of again) { expect(l).toContain('icon="restart"'); expect(l).not.toContain('"repeat"'); }
  });
  it('every repeat icon sits on a review thing (the tab, the daily review, Start the review, a review row or pill, Comeback)', () => {
    const rep = uses('repeat').filter(l => /icon[=:]\s*["']repeat|name="repeat"/.test(l));
    expect(rep.length).toBeGreaterThanOrEqual(6);
    for (const l of rep) expect(l, l).toMatch(/review|Review|comeback|due/);
  });
});

