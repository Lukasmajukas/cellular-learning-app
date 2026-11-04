// Redesign R04 guards for the one speed file (src/theme/motion.tsx): its speeds match DESIGN.md section 7, screens glide
// with transforms and see-through-ness only, Reduce motion means "a quick fade or nothing", and no other file types a speed.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SPRING, TIME, PRESS, PRESS_BIG, PRESS_ROUND, PRESS_PILL, QUICK_FADE, INSTANT, LOOP, popInDelay, screenGlide, ON_AIR, BREATHE, waveDelay, popInQueue, TOP_BAR, barAt, FEEDBACK, questionGlide } from './theme/motion';
import { grew } from './ui/TopBar';

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

describe('the path map movement (redesign R06)', () => {
  it('coming on air fits in a celebration (1.6 s), springs counted as 0.7 s to settle (the bouncy one, measured in R06)', () => {
    for (const [k, t] of Object.entries(ON_AIR)) {
      if (typeof t === 'number') continue;
      const end = t.delay + ('duration' in t ? t.duration : 0.7);
      expect(end, k).toBeLessThanOrEqual(TIME.celebration);
    }
    expect(ON_AIR.burst.delay + ON_AIR.burstGap + ON_AIR.burst.duration).toBeLessThanOrEqual(TIME.celebration);
    for (const n of [1, 3, 5, 7, 12]) expect(waveDelay(n - 1, n) + ON_AIR.wave.duration, `${n} circles`).toBeLessThanOrEqual(TIME.celebration);
  });
  it('the breathing rings: one background loop, 2-4 s a round, only size and see-through-ness', () => {
    expect(BREATHE.transition.duration).toBeGreaterThanOrEqual(2); expect(BREATHE.transition.duration).toBeLessThanOrEqual(4);
    expect(BREATHE.transition.repeat).toBe(Infinity);
    expect(Object.keys(BREATHE.on).sort()).toEqual(['opacity', 'scale']);
    expect(Math.max(...BREATHE.on.scale)).toBeLessThanOrEqual(1.1); // soft
  });
  it('pop-ins as you scroll: things that appear together go 60 ms apart (all within 400 ms); one on its own pops at once', () => {
    const t = 1_000_000;
    const ds = Array.from({ length: 12 }, () => popInQueue(t));
    expect(ds.slice(0, 3)).toEqual([0, TIME.stagger, 2 * TIME.stagger]);
    expect(Math.max(...ds)).toBeLessThanOrEqual(TIME.popInMax);
    expect(popInQueue(t + 500)).toBe(0);
  });
});

describe('the top bar (redesign R07)', () => {
  const end = (t: { delay: number; duration?: number }) => t.delay + (t.duration ?? 0.7); // springs counted as 0.7 s (R06)
  it('its own moment ends within a celebration (1.6 s); it waits for the frame to fade in, and after a first finish for the path', () => {
    for (const k of ['count', 'float', 'flicker', 'pop', 'fill', 'flash', 'check'] as const) {
      expect(TOP_BAR[k].delay, k).toBeGreaterThanOrEqual(0);
      expect(end(TOP_BAR[k]), k).toBeLessThanOrEqual(TIME.celebration);
      expect(barAt(TOP_BAR[k], TOP_BAR.afterPath).delay, k).toBeCloseTo(TOP_BAR[k].delay + TOP_BAR.afterPath);
    }
    expect(TOP_BAR.wait).toBeGreaterThanOrEqual(TIME.screenIn);
    // One celebration at a time (I29): the top bar starts once the path's busiest part is over (the line drawn, the lock gone).
    for (const k of ['turn', 'burst', 'line', 'lockOff', 'banner', 'barDraw'] as const)
      expect(TOP_BAR.afterPath, k).toBeGreaterThanOrEqual(ON_AIR[k].delay + ON_AIR[k].duration);
    expect(TOP_BAR.afterPath).toBeGreaterThanOrEqual(ON_AIR.burst.delay + ON_AIR.burstGap + ON_AIR.burst.duration); // the second ring
    // ... and the springs too (design review 1): the new current circle's bounce, the check badge, the unit banner's "done".
    for (const k of ['arrive', 'check', 'bannerCheck'] as const) expect(TOP_BAR.afterPath, k).toBeGreaterThanOrEqual(end(ON_AIR[k]) - 1e-9);
    expect(TOP_BAR.afterPath).toBeGreaterThanOrEqual(ON_AIR.wave.delay + ON_AIR.waveSpread + ON_AIR.wave.duration - 1e-9); // the unit's last wave ring
  });
  it('only whole transforms (move, size, turn) and see-through-ness move, so the browser runs them off the main thread; nothing loops', () => {
    for (const k of ['flickerKeys', 'glowKeys', 'popKeys', 'floatKeys', 'flashKeys', 'checkKeys'] as const)
      for (const [p, v] of Object.entries(TOP_BAR[k])) {
        expect(['transform', 'opacity'], `${k}.${p}`).toContain(p);
        if (p === 'transform') for (const t of v as string[]) expect(t, k).toMatch(/^((translateY|scale|rotate)\([-\d.]+(px|deg)?\) ?)+$/);
      }
    for (const k of ['count', 'float', 'flicker', 'pop', 'flash'] as const) expect('repeat' in TOP_BAR[k], k).toBe(false);
  });
  it('the flame flickers once and comes back to rest: small (at most a third bigger), starts and ends at its normal size', () => {
    const sc = TOP_BAR.flame.scale, rot = TOP_BAR.flame.rotate;
    expect([sc[0], sc.at(-1), rot[0], rot.at(-1)]).toEqual([1, 1, 0, 0]);
    expect(Math.max(...sc)).toBeLessThanOrEqual(1.34);
    expect(Math.max(...rot.map(Math.abs))).toBeLessThanOrEqual(12);
    expect(TOP_BAR.flickerKeys.transform).toHaveLength(sc.length);
    expect(TOP_BAR.glowKeys.opacity.at(-1)).toBe(TOP_BAR.glowKeys.opacity[0]); // the glow ends at its still look
  });
  it('a moment plays only when a number went up (a new day resetting today\'s XP or the goal plays nothing)', () => {
    expect(grew({ from: 120, to: 150, n: 1 })).toBe(true);
    expect(grew({ from: 30, to: 0, n: 1 })).toBe(false);
    expect(grew({ from: 4, to: 4, n: 0 })).toBe(false);
  });
});

describe('lesson movement (redesign R11)', () => {
  it('right, wrong, the number box pop and the order glide are small feedback: 200-300 ms each, nothing loops', () => {
    for (const k of ['shake', 'pop', 'glow', 'keyPop', 'fly'] as const) {
      expect(FEEDBACK[k].duration, k).toBeGreaterThanOrEqual(0.2); expect(FEEDBACK[k].duration, k).toBeLessThanOrEqual(0.3);
      expect('repeat' in FEEDBACK[k], k).toBe(false);
    }
    expect(FEEDBACK.spark.duration).toBeLessThanOrEqual(0.6); // the bar's spark: a short flash while the bar springs
  });
  it('a wrong answer shakes gently: 3 times side to side, at most 6 px, smaller each time, ending where it started', () => {
    const x = FEEDBACK.shakeKeys.x;
    expect([x[0], x.at(-1)]).toEqual([0, 0]);
    const swings = x.slice(1, -1);
    expect(swings.length).toBe(6); // 3 times: left-right, left-right, left-right
    expect(Math.max(...swings.map(Math.abs))).toBeLessThanOrEqual(6);
    for (let i = 2; i < swings.length; i += 2) expect(Math.abs(swings[i])).toBeLessThanOrEqual(Math.abs(swings[i - 2]));
    for (let i = 1; i < swings.length; i++) expect(Math.sign(swings[i])).toBe(-Math.sign(swings[i - 1])); // turns each time
  });
  it('the right one pops only a little (at most 5% bigger) and comes back to its size; its glow flashes and settles, see-through-ness only', () => {
    const sc = FEEDBACK.popKeys.scale;
    expect([sc[0], sc.at(-1)]).toEqual([1, 1]); expect(Math.max(...sc)).toBeLessThanOrEqual(1.05);
    expect(Object.keys(FEEDBACK.glowKeys)).toEqual(['opacity']);
    expect(FEEDBACK.glowKeys.opacity[0]).toBe(0); expect(Math.max(...FEEDBACK.glowKeys.opacity)).toBe(1);
    expect(FEEDBACK.glowKeys.opacity.at(-1)).toBeGreaterThan(0.5);
    expect(Object.keys(FEEDBACK.sparkKeys)).toEqual(['opacity']);
    for (const k of ['popKeys', 'dotKeys', 'keyPopKeys'] as const) expect(Object.keys(FEEDBACK[k]), k).toEqual(['scale']);
    expect(FEEDBACK.dotKeys.scale.at(-1)).toBe(1); expect(FEEDBACK.keyPopKeys.scale.at(-1)).toBe(1);
  });
  it('the progress bar springs forward: a touch past its new place (under 10% of one step), no long wobble', () => {
    const { stiffness, damping } = SPRING.step, zeta = damping / (2 * Math.sqrt(stiffness));
    const overshoot = Math.exp(-zeta * Math.PI / Math.sqrt(1 - zeta * zeta));
    expect(overshoot).toBeGreaterThan(0.02); expect(overshoot).toBeLessThan(0.1);
  });
  it('a question glides in from the right and out to the left within a screen change; with Reduce motion it only fades', () => {
    const g = questionGlide(false);
    expect(g.initial.x).toBeGreaterThan(0); expect(g.exit.x).toBeLessThan(0);
    expect(g.animate.transition.duration + g.exit.transition.duration).toBeLessThanOrEqual(0.42);
    const calm = questionGlide(true) as unknown as Record<string, Record<string, unknown>>;
    for (const k of ['initial', 'animate', 'exit']) expect(Object.keys(calm[k]).filter(p => p !== 'transition'), k).toEqual(['opacity']);
    expect((calm.animate.transition as { duration: number }).duration).toBeLessThanOrEqual(0.15);
  });
});
