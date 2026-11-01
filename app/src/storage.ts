// Talks to the save file through the Electron "door" (preload.cjs).
// In a plain browser (no door) it falls back to the browser's own storage, so dev mode still works.
import type { Progress } from './path';

export type Settings = { sounds: boolean; reduceMotion: boolean; showFps: boolean; dailyGoal: number; theme: 'light' | 'dark' };
export type SaveState = { version: 1; progress: Progress; settings: Settings };
export const DEFAULT_SETTINGS: Settings = { sounds: true, reduceMotion: false, showFps: false, dailyGoal: 1, theme: 'light' };
export const EMPTY_STATE: SaveState = { version: 1, progress: {}, settings: DEFAULT_SETTINGS };

type Api = {
  load(): Promise<{ state: SaveState; recovered: boolean }>;
  save(s: SaveState): Promise<SaveState>;
  backupNow(): Promise<string | null>;
  showFile(): Promise<string>;
};
const api = (): Api | undefined => (window as unknown as { cellApi?: Api }).cellApi;
const KEY = 'cell-learning-save';

export async function loadState(): Promise<{ state: SaveState; recovered: boolean }> {
  const a = api();
  if (a) return a.load();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (raw) return { state: { ...EMPTY_STATE, ...raw, settings: { ...DEFAULT_SETTINGS, ...raw.settings } }, recovered: false };
  } catch { /* ignore */ }
  return { state: EMPTY_STATE, recovered: false };
}
export async function saveState(s: SaveState): Promise<void> {
  const a = api();
  if (a) { await a.save(s); return; }
  localStorage.setItem(KEY, JSON.stringify(s));
}
export const backupNow = async () => api()?.backupNow() ?? null;
export const showFile = async () => api()?.showFile() ?? null;
export const hasFileAccess = () => !!api();
