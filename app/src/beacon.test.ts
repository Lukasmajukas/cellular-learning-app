// Redesign R17 guards for Beacon, the mascot (DESIGN.md section 8): six faces, the sizes, and its movement (in the one
// speed file, src/theme/motion.tsx): soft loops of 2-4 s, a blink every 4-7 s, one-off moves within a celebration
// (1.6 s), only size, place and see-through-ness, and never farther than its own width.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BEACON, BREATHE, TIME } from './theme/motion';
import { BEACON_FACES, BEACON_SIZE } from './ui/Beacon';

const code = readFileSync(join(__dirname, 'ui', 'Beacon.tsx'), 'utf8');

describe('Beacon (redesign R17)', () => {
  it('has the six faces DESIGN.md names', () => {
    expect([...BEACON_FACES].sort()).toEqual(['cheering', 'happy', 'idle', 'oops', 'sleepy', 'thinking']);
  });
  it('comes in the DESIGN.md sizes: 48 px on the path, about 58 above questions, 96-140 on lesson complete', () => {
    expect(BEACON_SIZE.path).toBe(48);
    expect(BEACON_SIZE.question).toBeGreaterThanOrEqual(54); expect(BEACON_SIZE.question).toBeLessThanOrEqual(62);
    expect(BEACON_SIZE.complete).toBeGreaterThanOrEqual(96); expect(BEACON_SIZE.complete).toBeLessThanOrEqual(140);
  });
  it('blinks every 4-7 s, quickly (a blink takes under 0.3 s)', () => {
    expect(BEACON.blinkGap).toEqual([4, 7]);
    expect(BEACON.blinkShut.duration + BEACON.blinkOpen.duration).toBeLessThan(0.3);
    expect(BEACON.blinkScale).toBeGreaterThan(0); expect(BEACON.blinkScale).toBeLessThan(0.5);
  });
  it('its rings breathe with the same soft breath as the current lesson (one loop, 2-4 s)', () => {
    expect(code).toContain('BREATHE.on');
    expect(BREATHE.transition.duration).toBeGreaterThanOrEqual(2); expect(BREATHE.transition.duration).toBeLessThanOrEqual(4);
  });
  it('the happy pulse and the cheer (hops and two rings) end within a celebration, and none of them loops', () => {
    expect(BEACON.pulse.delay + BEACON.pulse.duration).toBeLessThanOrEqual(TIME.celebration);
    expect(BEACON.hop.delay + BEACON.hop.duration).toBeLessThanOrEqual(TIME.celebration);
    expect(BEACON.burst.delay + BEACON.burstGap + BEACON.burst.duration).toBeLessThanOrEqual(TIME.celebration);
    for (const t of [BEACON.pulse, BEACON.hop, BEACON.burst]) expect('repeat' in t).toBe(false);
  });
  it('only size, place and see-through-ness move; the hop starts and ends at rest and stays small', () => {
    for (const k of ['pulseKeys', 'hopKeys', 'burstKeys'] as const)
      for (const p of Object.keys(BEACON[k])) expect(['scale', 'y', 'opacity'], `${k}.${p}`).toContain(p);
    const y = BEACON.hopKeys.y;
    expect([y[0], y.at(-1)]).toEqual([0, 0]);
    expect(Math.max(...y.map(Math.abs))).toBeLessThanOrEqual(10); // the drawing is 100 wide: never farther than its own width
    for (let i = 3; i < y.length; i += 2) expect(Math.abs(y[i])).toBeLessThan(Math.abs(y[i - 2])); // each hop smaller
  });
  it('draws only with the colour tokens (no colour codes) and switches its loops off for Reduce motion and a hidden window', () => {
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    expect(code).toContain('useCalm()'); expect(code).toContain('useAwake()');
  });
});
