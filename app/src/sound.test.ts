import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SOUNDS, SAMPLE_SET, SAMPLE_LENGTH } from './sound';
import { TIME } from './theme/motion';

// Redesign R19: the real sounds (DESIGN.md section 9). About 7, each under 50 KB, CC0 and credited, quiet, and the
// lesson-complete one 2 s at most.
const DIR = join(__dirname, 'sounds');
const files = readdirSync(DIR).filter(f => f.endsWith('.ogg'));
const credits = readFileSync(join(__dirname, '..', 'public', 'licenses', 'sounds-CC0.txt'), 'utf8');
const code = readFileSync(join(__dirname, 'sound.ts'), 'utf8');

describe('sounds (R19)', () => {
  it('seven sounds, each its own file in src/sounds, every file used', () => {
    expect(Object.keys(SOUNDS)).toEqual(['tap', 'right', 'notQuite', 'complete', 'streak', 'unlock', 'review']);
    const imported = [...code.matchAll(/from '\.\/sounds\/([\w-]+\.ogg)\?inline'/g)].map(m => m[1]);
    expect(imported.sort()).toEqual([...files].sort());
    expect(files.length).toBe(7);
    for (const s of Object.values(SOUNDS)) expect(s.src).toMatch(/^data:audio\/ogg;base64,/); // baked into the app
  });
  it('each file is under 50 KB', () => {
    for (const f of files) expect(statSync(join(DIR, f)).size, f).toBeLessThan(50 * 1024);
  });
  it('every file is credited, CC0', () => {
    expect(credits).toContain('CC0 1.0 Universal');
    for (const f of files) expect(credits, f).toMatch(new RegExp(`\\| ${f.replace('.', '\\.')}\\s+\\|`));
  });
  it('quiet: every level is at most full, the tap the softest; lesson complete lasts 2 s at most', () => {
    const levels = Object.values(SOUNDS).map(s => s.level);
    for (const l of levels) { expect(l).toBeGreaterThan(0); expect(l).toBeLessThanOrEqual(1); }
    expect(SOUNDS.tap.level).toBe(Math.min(...levels));
    expect(SOUNDS.complete.length).toBeLessThanOrEqual(2);
    for (const s of Object.values(SOUNDS)) expect(s.length).toBeLessThanOrEqual(2);
  });
  it('the sample plays the lesson sounds in a row (idea I55), within a celebration time', () => {
    expect(SAMPLE_SET).toEqual(['tap', 'right', 'notQuite', 'complete']);
    expect(SAMPLE_LENGTH).toBeLessThanOrEqual(TIME.celebration);
  });
  it('no sound before your first click or key: the sound system is only set up from a click or key listener', () => {
    // `new AudioContext()` appears once, inside wake(); wake() runs from play() (always after a click) or prepareSounds().
    expect(code.match(/new AudioContext\(\)/g)).toHaveLength(1);
    expect(code).toMatch(/addEventListener\('pointerdown', go, true\)/);
  });
});
