// The start screen (redesign R21). It lives in index.html, so it's in the window's very first picture, before any of
// the app's code has run (the window itself stays hidden until that picture is drawn: electron/main.cjs).
// Its colours come from the same tokens as the app (vite.config.ts writes them into index.html: lookCss() in
// src/theme/tokens.ts), and its Beacon is the app's Beacon, standing still (a unit test compares the two drawings).
// Once the app is ready, endStartScreen() fades it away (see-through-ness only; START in the speed file).
import { START, startFade } from './theme/motion';

// What the main process read from the save file before the window opened (electron/preload.cjs). In a plain browser: Night.
type Boot = { look?: 'night' | 'day'; calm?: boolean; skipWelcome?: boolean; testCrash?: boolean };
export const BOOT: Boot = (typeof window === 'undefined' ? undefined : (window as unknown as { cellApi?: Boot }).cellApi) ?? {};

// How long to keep the start screen up so it has been on screen for at least START.hold since the page began (ms).
export const holdLeft = (now = performance.now()) => Math.max(0, START.hold * 1000 - now);

let ended = false;
// Fades the start screen out and then removes it. Safe to call more than once (the app and the error screen both do).
export function endStartScreen(calm: boolean) {
  const el = document.getElementById('boot');
  if (!el || ended) return;
  ended = true;
  el.style.pointerEvents = 'none';
  const t = startFade(calm);
  const ease = 'ease' in t ? `cubic-bezier(${t.ease.join(', ')})` : 'linear';
  const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: t.duration * 1000, easing: ease, fill: 'forwards' });
  const gone = () => el.remove();
  a.finished.then(gone, gone);
}
