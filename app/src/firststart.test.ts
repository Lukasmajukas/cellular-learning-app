// Redesign R21 (first start, empty screens, start-up): the save remembers the welcome, the start screen in index.html
// has the app's own colours and Beacon, and the speeds follow DESIGN.md section 7.
import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { lookCss, PALETTES, TOKEN_KEYS, cssVar, FONT } from './theme/tokens';
import { START, startFade, pageGlide, TIME, QUICK_FADE } from './theme/motion';
import { Beacon } from './ui/Beacon';
import { GOALS, WELCOME_SAYS, goalHint, Goal } from './Welcome';
import { TROUBLE } from './Trouble';
import { holdLeft } from './startup';
const { createStore, normalize } = createRequire(import.meta.url)('../electron/store.cjs');

const HTML = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');
let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'cell-')); });

describe('the welcome is remembered in the save file', () => {
  it('a new save has not been welcomed; once welcomed, it stays so', () => {
    const st = createStore(dir);
    expect(st.load().state.welcomed).toBe(false);
    st.save({ ...st.load().state, welcomed: true });
    expect(createStore(dir).load().state.welcomed).toBe(true);
  });
  it('a save from before R21 counts as welcomed if anything was ever played (the owner never sees the welcome)', () => {
    expect(normalize({ progress: { 'unit01-l1': 3 } }).welcomed).toBe(true);
    expect(normalize({ game: { xp: 20 } }).welcomed).toBe(true);
    expect(normalize({ progress: {}, settings: { look: 'day' } }).welcomed).toBe(false);
    expect(normalize({ progress: { 'unit01-l1': 3 }, welcomed: false }).welcomed).toBe(false); // an explicit answer wins
    expect(normalize(null).welcomed).toBe(false);
  });
  it('reads the look and Reduce motion before the window opens, without writing anything', () => {
    const st = createStore(dir);
    expect(st.startup()).toEqual({ look: 'night', reduceMotion: false });
    writeFileSync(st.file, JSON.stringify({ settings: { look: 'day', reduceMotion: true } }));
    expect(st.startup()).toEqual({ look: 'day', reduceMotion: true });
    expect(existsSync(join(dir, 'backups'))).toBe(false);
  });
});

describe('the start screen (index.html)', () => {
  it('gets both looks\' colours and letters from the token file, at build time', () => {
    expect(HTML).toContain('<!--look-tokens-->');                       // vite.config.ts fills this in
    const css = lookCss();
    for (const look of ['night', 'day'] as const) {
      const block = css.split('\n').find(l => l.startsWith(`html[data-look=${look}]`))!;
      for (const k of TOKEN_KEYS) expect(block, `${look} ${k}`).toContain(`${cssVar(k)}:${PALETTES[look][k]};`);
      expect(block).toContain(`--font-body:${FONT.body}`);
    }
  });
  it('picks the saved look before the first picture (the preload passes it on)', () => {
    expect(HTML).toMatch(/<script>[^<]*cellApi[^<]*dataset\.look[^<]*<\/script>/);
    expect(HTML.indexOf('<script>')).toBeLessThan(HTML.indexOf('<!--look-tokens-->'));
  });
  it('its Beacon is the app\'s Beacon with its "waiting" face, standing still (the same lines and circles)', () => {
    const boot = HTML.slice(HTML.indexOf('<div id="boot"'), HTML.indexOf('<div id="root"'));
    const app = renderToStaticMarkup(createElement(Beacon, { face: 'idle', still: true }));
    const paths = (s: string) => [...s.matchAll(/ d="([^"]+)"/g)].map(m => m[1]).sort();
    const circles = (s: string) => [...new Set([...s.matchAll(/<circle[^>]*? cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)].map(m => m.slice(1).join(',')))].sort();
    expect(paths(boot)).toEqual(paths(app));
    expect(circles(boot).every(x => circles(app).includes(x)), `${circles(boot)} in ${circles(app)}`).toBe(true);
    expect(circles(boot)).toContain('50,40,15');                          // the head
  });
});

describe('speeds (DESIGN.md section 7)', () => {
  it('the start screen stays at least half a second, then fades like a screen arriving; with Reduce motion the quick fade', () => {
    expect(START.hold).toBeGreaterThanOrEqual(0.3); expect(START.hold).toBeLessThanOrEqual(0.6);
    expect(START.fade.duration).toBe(TIME.screenIn);
    expect(startFade(true)).toEqual(QUICK_FADE);
    expect(holdLeft(100)).toBe(START.hold * 1000 - 100);
    expect(holdLeft(5000)).toBe(0);                                      // a slow start never waits any longer
  });
  it('the welcome\'s pages glide sideways (transform and see-through-ness only), the way you go; with Reduce motion they only fade', () => {
    const v = pageGlide(false).variants as Record<string, unknown>;
    const at = (k: string, dir: number) => { const x = v[k]; return (typeof x === 'function' ? x(dir) : x) as Record<string, unknown>; };
    expect(at('enter', 1).x).toBeGreaterThan(0); expect(at('enter', -1).x).toBeLessThan(0);
    expect(at('leave', 1).x).toBeLessThan(0);
    for (const k of ['enter', 'center', 'leave']) expect(Object.keys(at(k, 1)).filter(x => x !== 'transition').sort()).toEqual(['opacity', 'x']);
    const calm = pageGlide(true).variants as Record<string, Record<string, unknown>>;
    expect(Object.keys(calm.enter)).toEqual(['opacity']);
  });
});

describe('words', () => {
  it('the welcome\'s goals are the same as Settings\' (1, 2, 3, 5), each with how long it takes', () => {
    expect(GOALS.map(g => g.n)).toEqual([1, 2, 3, 5]);
    for (const g of GOALS) expect(g.minutes).toBe(g.n * 5);              // lessons are 3 to 5 minutes (lesson_timing.py)
    expect(goalHint(10)).toBe('up to 10 minutes a day');
  });
  it('each goal\'s key is its own count (1, 2, 3, 5), so the key beside "5 lessons" is 5 (idea I78)', () => {
    const html = renderToStaticMarkup(createElement(Goal, { goal: 1, onPick: () => {}, onDone: () => {} }));
    const tiles = [...html.matchAll(/<button[^>]*data-testid="welcome-goal-(\d)"[^>]*>(.*?)<\/button>/g)];
    expect(tiles.map(t => Number(t[1]))).toEqual([1, 2, 3, 5]);
    for (const [tile, n, inside] of tiles) {
      expect(tile).toContain(`data-pick="${n}"`);                        // the key that picks it
      expect(tile).toContain(`aria-keyshortcuts="${n}"`);                // what a screen reader says
      expect(inside).toMatch(new RegExp(`aria-hidden="true"[^>]*>${n}</span>`)); // the number drawn in its key box
      expect(inside).toContain(`<b>${n} ${n === '1' ? 'lesson' : 'lessons'}</b>`);
    }
    expect(html).not.toContain('data-pick="4"');                         // no key 4: there's no 4-lesson goal
  });
  it('Beacon says 8 words or fewer (DESIGN.md section 8)', () => {
    for (const line of Object.values(WELCOME_SAYS)) expect(line.split(/\s+/).length, line).toBeLessThanOrEqual(8);
  });
  it('the error screens are kind: no blame, and they say whether your progress is safe', () => {
    for (const t of Object.values(TROUBLE)) {
      expect(t.text).toMatch(/safe|nothing in it was changed/);
      expect(`${t.title} ${t.text}`).not.toMatch(/fail|fatal|crash|error|invalid/i);
    }
  });
});
