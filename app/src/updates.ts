// T76: the app updates itself. This is the screens' side: what the updater (electron/updater.cjs) is doing right now,
// in words. The updater lives in the main program; the screens only read its status and press its two buttons.
import { useEffect, useState } from 'react';

// state: 'unsupported' can't update here · 'off' the switch is off · 'idle' nothing to do · 'checking' asking now ·
// 'downloading' fetching a newer version · 'ready' fetched, waits for a restart · 'failed' no address answered (quiet).
export type UpdateState = 'unsupported' | 'off' | 'idle' | 'checking' | 'downloading' | 'ready' | 'failed';
export type UpdateStatus = { state: UpdateState; version: string; why?: string; newVersion?: string; checkedAt?: number; detail?: string };

type UpdateApi = { get(): Promise<UpdateStatus>; check(): Promise<UpdateStatus>; restart(): Promise<boolean>; onStatus(tell: (s: UpdateStatus) => void): () => void };
const api = (): UpdateApi | undefined => (window as unknown as { cellApi?: { update?: UpdateApi } }).cellApi?.update;

// In a plain browser (the preview, no app around it) there is no updater at all.
export const NO_UPDATER: UpdateStatus = { state: 'unsupported', version: '', why: 'no-app' };

// The updater's status, kept fresh: read once, then every change is pushed from the main program.
export function useUpdate(): UpdateStatus {
  const [status, setStatus] = useState<UpdateStatus>(NO_UPDATER);
  useEffect(() => {
    const a = api();
    if (!a) return;
    let live = true;
    a.get().then(s => { if (live) setStatus(s); }, () => { /* no status: stay "unsupported" */ });
    const stop = a.onStatus(s => { if (live) setStatus(s); });
    return () => { live = false; stop(); };
  }, []);
  return status;
}
export const checkForUpdate = () => api()?.check();
export const restartIntoUpdate = () => api()?.restart();

// "5 minutes ago", for "Checked ...". Whole, friendly steps; nothing finer than a minute.
export function ago(then: number, now: number): string {
  const min = Math.max(0, Math.round((now - then) / 60000));
  if (min < 1) return 'just now';
  if (min < 60) return `${min} ${min === 1 ? 'minute' : 'minutes'} ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  const d = Math.round(h / 24);
  return `${d} ${d === 1 ? 'day' : 'days'} ago`;
}

// The quiet line under "Version" in Settings: what the updater is doing, in plain words. Never blaming words, and no
// alarm when a check didn't work: no internet is normal, and the app asks again by itself.
export const UPDATE_WORDS = {
  unsupported: 'Updates work in the installed Windows app.',
  off: 'Not looking for new versions.',
  soon: 'Looks for a newer version soon after the app opens.',
  newest: (when: string) => `You have the newest version. Checked ${when}.`,
  checking: 'Looking for a newer version...',
  downloading: 'Fetching a newer version. Keep playing.',
  ready: (v: string) => `${v ? `Version ${v}` : 'A newer version'} is ready for the next start.`,
  failed: "Couldn't look just now. It tries again by itself.",
  noteTitle: 'A new version is ready',
  noteText: "You get it the next time you open the app. Your progress stays.",
} as const;
// The fetched version's number for the screen. 'newer' is the updater's stand-in when the installer's helper named
// none: then no number is shown.
export const versionName = (v?: string | null) => (v && v !== 'newer' ? v : '');
export function updateLine(s: UpdateStatus, now: number): string {
  switch (s.state) {
    case 'unsupported': return UPDATE_WORDS.unsupported;
    case 'off': return UPDATE_WORDS.off;
    case 'checking': return UPDATE_WORDS.checking;
    case 'downloading': return UPDATE_WORDS.downloading;
    case 'ready': return UPDATE_WORDS.ready(versionName(s.newVersion));
    case 'failed': return UPDATE_WORDS.failed;
    default: return s.checkedAt ? UPDATE_WORDS.newest(ago(s.checkedAt, now)) : UPDATE_WORDS.soon;
  }
}
// May "Check now" be pressed? Not where updates can't work, and not while one check is already running.
export const canCheck = (s: UpdateStatus) => s.state === 'off' || s.state === 'idle' || s.state === 'failed';
