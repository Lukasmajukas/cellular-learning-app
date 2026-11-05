import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const { createStore, normalize, WINDOW_BG } = createRequire(import.meta.url)('../electron/store.cjs');
import { NIGHT, DAY } from './theme/tokens';

let dir: string;
let day = new Date(2026, 10, 1);
const clock = () => day;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'cell-')); day = new Date(2026, 10, 1); });

describe('save file', () => {
  it('starts with defaults when there is no file', () => {
    const { state, recovered } = createStore(dir, clock).load();
    expect(state.progress).toEqual({}); expect(state.settings.sounds).toBe(true); expect(recovered).toBe(false);
  });
  it('saves and loads progress and settings', () => {
    const st = createStore(dir, clock);
    st.save({ progress: { 'u1-l1': 3 }, settings: { sounds: false, volume: 30, reduceMotion: true, showFps: true, dailyGoal: 3, look: 'day' } });
    const back = createStore(dir, clock).load().state;
    expect(back.progress).toEqual({ 'u1-l1': 3 }); expect(back.settings).toEqual({ sounds: false, volume: 30, reduceMotion: true, showFps: true, dailyGoal: 3, look: 'day' });
  });
  it('leaves no half-written temp file behind', () => {
    const st = createStore(dir, clock); st.save({ progress: { a: 1 } });
    expect(readdirSync(dir).filter(n => n.endsWith('.tmp'))).toEqual([]);
  });
  it('makes one backup a day, and keeps only the last 7', () => {
    const st = createStore(dir, clock);
    for (let i = 0; i < 10; i++) { day = new Date(2026, 10, 1 + i); st.save({ progress: { a: 1 } }); st.save({ progress: { a: 2 } }); }
    const list = st.listBackups();
    expect(list.length).toBe(7); expect(list[0]).toBe('save-2026-11-04.json'); expect(list[6]).toBe('save-2026-11-10.json');
  });
  it('the daily backup holds the first save of that day', () => {
    const st = createStore(dir, clock);
    st.save({ progress: { a: 1 } }); st.save({ progress: { a: 3 } });
    expect(JSON.parse(readFileSync(join(st.backupDir, 'save-2026-11-01.json'), 'utf8')).progress).toEqual({ a: 1 });
  });
  it('"back up now" overwrites today\'s backup with the latest progress', () => {
    const st = createStore(dir, clock);
    st.save({ progress: { a: 1 } }); st.save({ progress: { a: 3 } }); st.backup();
    expect(JSON.parse(readFileSync(join(st.backupDir, 'save-2026-11-01.json'), 'utf8')).progress).toEqual({ a: 3 });
  });
  it('restores the newest backup when the save file is damaged, and keeps the damaged one aside', () => {
    const st = createStore(dir, clock);
    st.save({ progress: { a: 2 } });
    writeFileSync(st.file, '{ this is not json');
    const { state, recovered, backupDay } = createStore(dir, clock).load();
    expect(recovered).toBe(true); expect(state.progress).toEqual({ a: 2 });
    expect(backupDay).toBe('2026-11-01'); // R13: the notice says which day's backup it was
    expect(readdirSync(dir).some(n => n.startsWith('save.damaged-'))).toBe(true);
    expect(JSON.parse(readFileSync(st.file, 'utf8')).progress).toEqual({ a: 2 });
  });
  it('a damaged file with no backup starts fresh without crashing', () => {
    writeFileSync(join(dir, 'save.json'), 'garbage');
    const { state, recovered } = createStore(dir, clock).load();
    expect(state.progress).toEqual({}); expect(recovered).toBe(false);
  });
  it('ignores nonsense values', () => {
    const n = normalize({ progress: { a: 9, b: 'x', c: 2 }, settings: { sounds: 'yes', volume: 75, dailyGoal: 500, look: 'neon', theme: 'light' } });
    expect(n.progress).toEqual({ c: 2 }); expect(n.settings).toEqual({ sounds: true, volume: 60, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night' });
    expect(existsSync(dir)).toBe(true);
  });
  // R20: the window opens in the saved look's colour, read before the app starts (no backup taken, nothing written).
  it('reads the saved look before the window opens, without writing anything', () => {
    const st = createStore(dir, clock);
    expect(st.look()).toBe('night');                    // no save file yet
    expect(existsSync(join(dir, 'backups'))).toBe(false);
    writeFileSync(st.file, JSON.stringify({ settings: { look: 'day' } }));
    expect(st.look()).toBe('day');
    writeFileSync(st.file, '{ damaged');
    expect(st.look()).toBe('night');                    // a damaged file: Night until load() restores the backup
    expect(existsSync(join(dir, 'backups'))).toBe(false);
  });
  it("the window's colours are the two looks' far background (bg) tokens", () => {
    expect(WINDOW_BG).toEqual({ night: NIGHT.bg, day: DAY.bg });
  });
});
