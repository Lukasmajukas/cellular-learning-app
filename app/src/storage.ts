// Talks to the save file through the Electron "door" (preload.cjs).
// In a plain browser (no door) it falls back to the browser's own storage, so dev mode still works.
import type { Progress } from './path';
import type { Reviews } from './fsrs';
import { EMPTY_GAME, type Game } from './gamify';

// autoUpdate (T76): the app fetches new versions of itself (electron/updater.cjs). On unless you switch it off.
export type Settings = { sounds: boolean; volume: number; reduceMotion: boolean; showFps: boolean; dailyGoal: number; look: 'night' | 'day'; autoUpdate: boolean };
// welcomed (R21): the first-start welcome has been shown and the daily goal picked (src/Welcome.tsx).
export type SaveState = { version: 1; progress: Progress; settings: Settings; reviews: Reviews; game: Game; seenChanges: string[] | null; welcomed: boolean };
export const DEFAULT_SETTINGS: Settings = { sounds: true, volume: 60, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night', autoUpdate: true };
// The volume as the sound code wants it (0 to 1). An old save file has none: then the quiet default.
export const volumeOf = (s: Partial<Settings>) => (typeof s.volume === 'number' ? s.volume : DEFAULT_SETTINGS.volume) / 100;
export const EMPTY_STATE: SaveState = { version: 1, progress: {}, settings: DEFAULT_SETTINGS, reviews: {}, game: EMPTY_GAME, seenChanges: null, welcomed: false };

type Api = {
  load(): Promise<Loaded>;
  save(s: SaveState): Promise<SaveState>;
  backupNow(): Promise<string | null>;
  showFile(): Promise<string>;
};
const api = (): Api | undefined => (window as unknown as { cellApi?: Api }).cellApi;
const KEY = 'cell-learning-save';

// recovered: the save file was damaged and a backup was loaded instead; backupDay: that backup's day (YYYY-MM-DD).
export type Loaded = { state: SaveState; recovered: boolean; backupDay?: string | null };
export async function loadState(): Promise<Loaded> {
  const a = api();
  if (a) return a.load();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (raw) return { state: { ...EMPTY_STATE, ...raw, settings: { ...DEFAULT_SETTINGS, ...raw.settings }, reviews: raw.reviews ?? {}, game: { ...EMPTY_GAME, ...raw.game }, seenChanges: Array.isArray(raw.seenChanges) ? raw.seenChanges : null,
      welcomed: typeof raw.welcomed === 'boolean' ? raw.welcomed : Object.keys(raw.progress ?? {}).length > 0 }, recovered: false };
  } catch { /* ignore */ }
  return { state: EMPTY_STATE, recovered: false };
}
export async function saveState(s: SaveState): Promise<void> {
  const a = api();
  if (a) { await a.save(s); return; }
  localStorage.setItem(KEY, JSON.stringify(s));
}
// Idea I69: saves the progress and says whether it worked: report(null) when it did, report(the error's words) when it
// didn't (main.tsx then shows "Couldn't save your last change"). Each save holds the whole progress, so only the newest
// save's answer counts: an older one finishing late can't hide a newer failure, or show one a newer save already fixed.
export function createSaver(report: (fail: string | null) => void, send: (s: SaveState) => Promise<void> = saveState) {
  let newest = 0;
  return (s: SaveState) => {
    const n = ++newest;
    return send(s).then(() => { if (n === newest) report(null); }, (e: unknown) => {
      console.error('Saving the progress file failed:', e);
      if (n === newest) report(e instanceof Error ? e.message : String(e));
    });
  };
}
export const backupNow = async () => api()?.backupNow() ?? null;
export const showFile = async () => api()?.showFile() ?? null;
export const hasFileAccess = () => !!api();

// The restored backup's day in words, for the "your progress is safe" notice: "from earlier today", "from yesterday",
// "from Tuesday, Nov 3". '' when the day isn't known.
export function backupWhen(day: string | null | undefined, now = new Date()): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day ?? '');
  if (!m) return '';
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const days = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - d.getTime()) / 86_400_000);
  if (days <= 0) return 'from earlier today';
  if (days === 1) return 'from yesterday';
  return `from ${d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;
}
