// Redesign R04 guards for the one speed file (src/theme/motion.tsx): its speeds match DESIGN.md section 7, screens glide
// with transforms and see-through-ness only, Reduce motion means "a quick fade or nothing", and no other file types a speed.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SPRING, TIME, PRESS, PRESS_BIG, PRESS_ROUND, PRESS_PILL, QUICK_FADE, INSTANT, LOOP, popInDelay, screenGlide } from './theme/motion';

const SRC = __dirname;
const files = (dir: string): string[] => readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) && !/\.test\.ts$/.test(f) ? [p] : [];
});
const code = files(SRC).map(p => [relative(SRC, p).replace(/\\/g, '/'), readFileSync(p, 'utf8')] as const);
const SPEED_FILE = 'theme/motion.tsx';

describe('the speed file matches DESIGN.md section 7', () => {
  it('tap 120-180 ms, small feedback 200-300 ms, screen change 320-420 ms in total', () => {
    expect(TIME.tap).toBeGreaterThanOrEqual(0.12); expect(TIME.tap).toBeLessThanOrEqual(0.18);
    expect(TIME.feedback).toBeGreaterThanOrEqual(0.2); expect(TIME.feedback).toBeLessThanOrEqual(0.3);
    const screen = TIME.screenOut + TIME.screenIn;
    expect(screen).toBeGreaterThanOrEqual(0.32); expect(screen).toBeLessThanOrEqual(0.42);
  });
  it('pop-ins: 40-80 ms apart and all started within 400 ms, however many there are', () => {
    expect(TIME.stagger).toBeGreaterThanOrEqual(0.04); expect(TIME.stagger).toBeLessThanOrEqual(0.08);
    for (const n of [1, 3, 5, 7, 12, 40, 83]) {
      expect(popInDelay(n - 1, n), `${n} items`).toBeLessThanOrEqual(TIME.popInMax);
      if (n > 1) expect(popInDelay(1, n) - popInDelay(0, n)).toBeLessThanOrEqual(0.08);
    }
    expect(popInDelay(1, 5)).toBeCloseTo(TIME.stagger); // a short row keeps the full 60 ms rhythm
  });
  it('celebrations 1.6 s at most, background loops 2-4 s, Reduce motion fades 150 ms at most', () => {
    expect(TIME.celebration).toBeLessThanOrEqual(1.6);
    expect(LOOP.duration).toBeGreaterThanOrEqual(2); expect(LOOP.duration).toBeLessThanOrEqual(4);
    expect(QUICK_FADE.duration).toBeLessThanOrEqual(0.15); expect(INSTANT.duration).toBe(0);
  });
  it('springs: snappy 500/30 for taps, bouncy 300/14 for pop-ins; the others never wobble much', () => {
    expect(SPRING.snappy).toMatchObject({ stiffness: 500, damping: 30 });
    expect(SPRING.bouncy).toMatchObject({ stiffness: 300, damping: 14 });
    // damping ratio = damping / (2 * sqrt(stiffness)) for mass 1; 0.7+ means at most a tiny overshoot.
    for (const k of ['sheet', 'fill', 'tab'] as const) expect(SPRING[k].damping / (2 * Math.sqrt(SPRING[k].stiffness)), k).toBeGreaterThanOrEqual(0.7);
  });
  it('every press is small: at most 10% bigger or smaller', () => {
    for (const p of [PRESS, PRESS_BIG, PRESS_ROUND, PRESS_PILL]) {
      expect(p.hover).toBeGreaterThan(1); expect(p.hover).toBeLessThanOrEqual(1.1);
      expect(p.tap).toBeLessThan(1); expect(p.tap).toBeGreaterThanOrEqual(0.9);
    }
  });
});

describe('screens glide (and only fade with Reduce motion)', () => {
  // Every value a screen change animates, for both directions.
  const keysOf = (kind: 'tab' | 'lesson' | 'frame', calm: boolean) => {
    const v = screenGlide(kind, calm).variants as Record<string, unknown>;
    return [...new Set(Object.values(v).flatMap(x => Object.keys(typeof x === 'function' ? x(1) : x)).filter(k => k !== 'transition'))].sort();
  };
  it('tabs slide sideways, a lesson rises, the frame only fades: transforms and see-through-ness only', () => {
    expect(keysOf('tab', false)).toEqual(['opacity', 'x']);
    expect(keysOf('lesson', false)).toEqual(['opacity', 'y']);
    expect(keysOf('frame', false)).toEqual(['opacity']); // sliding the frame would carry the fixed tab bar along
  });
  it('the new tab comes in from the side you moved to, and the old one leaves the other way', () => {
    const v = screenGlide('tab', false).variants as unknown as Record<string, (d: number) => { x: number }>;
    expect(v.enter(1).x).toBeGreaterThan(0); expect(v.leave(1).x).toBeLessThan(0);
    expect(v.enter(-1).x).toBeLessThan(0); expect(v.leave(-1).x).toBeGreaterThan(0);
  });
  it('with Reduce motion nothing slides: a fade of 150 ms at most', () => {
    for (const kind of ['tab', 'lesson', 'frame'] as const) {
      expect(keysOf(kind, true), kind).toEqual(['opacity']);
      const v = screenGlide(kind, true).variants as Record<string, { transition?: { duration: number } }>;
      for (const t of [v.center.transition, v.leave.transition]) expect(t!.duration).toBeLessThanOrEqual(0.15);
    }
  });
});

describe('one place for every speed, and for Reduce motion', () => {
  it('no other file types a spring or a timing (they take one from the speed file)', () => {
    const found = code.filter(([f]) => f !== SPEED_FILE).flatMap(([f, src]) =>
      [...src.matchAll(/\b(stiffness|damping|bounce|mass)\s*:|\b(duration|delay|repeatDelay)\s*:\s*[\d.]|transition:\s*['"`][^'"`]*\d|whileTap=\{\{|whileHover=\{\{/g)]
        .map(m => `${f}: ${m[0]}`));
    expect(found).toEqual([]);
  });
  it('only the speed file talks to Motion\'s reduce-motion setting and to prefs.reduceMotion', () => {
    const found = code.filter(([f]) => f !== SPEED_FILE).flatMap(([f, src]) =>
      [...src.matchAll(/<MotionConfig|reducedMotion=|useReducedMotion|prefs\.reduceMotion\s*=[^=]/g)].map(m => `${f}: ${m[0]}`));
    expect(found).toEqual([]);
  });
  it('the app and the blocks page both switch Reduce motion through <MotionKit>', () => {
    for (const f of ['main.tsx', 'BlocksSheet.tsx']) expect(readFileSync(join(SRC, f), 'utf8'), f).toContain('<MotionKit calm=');
  });
});
