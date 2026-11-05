import { prefs } from './prefs';
// The app's sounds, made in code for now (redesign R19 swaps in real CC0 sound files, keeping these two calls).
let ctx: AudioContext | null = null;

// One short tone: a rising "ding" for right, a soft low "bup" for not quite. `at` = seconds from now.
function tone(good: boolean, at = 0) {
  ctx ??= new AudioContext();
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + at;
  o.frequency.setValueAtTime(good ? 660 : 200, t); o.type = good ? 'sine' : 'square';
  g.gain.value = 0.08; o.connect(g); g.connect(ctx.destination);
  o.start(t); if (good) o.frequency.setValueAtTime(880, t + 0.1);
  o.stop(t + TONE);
}
const TONE = 0.22;   // one tone's length, in seconds
const APART = 0.4;   // the sample's second tone starts this long after the first

export function beep(good: boolean) {
  if (!prefs.sounds) return;
  try { tone(good); } catch { /* no audio available: fine */ }
}

// Settings' "Play a sample" (R15): a right answer, then a not-quite one. It plays even with Sounds off, because you
// asked for it (so you can hear them before switching them on). Gives back how long it lasts, in seconds.
export const SAMPLE_LENGTH = APART + TONE, SAMPLE_GAP = APART;
export function playSample(): number {
  try { tone(true); tone(false, APART); } catch { /* no audio available: fine */ }
  return SAMPLE_LENGTH;
}
