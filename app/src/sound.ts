import { prefs } from './prefs';
// The app's sounds (redesign R19): seven real sound effects, all CC0 ("no rights reserved"), credited anyway in
// public/licenses/sounds-CC0.txt. They are baked into the app itself (`?inline`), so they work offline and from the
// app's own files on Windows (fetch can't read file:// pages there), and later on a Mac. If they can't be decoded,
// the old code-made tones play for right and not quite, and the rest stays quiet: nothing breaks.
import tap from './sounds/tap.ogg?inline';
import right from './sounds/right.ogg?inline';
import notQuite from './sounds/not-quite.ogg?inline';
import complete from './sounds/complete.ogg?inline';
import streak from './sounds/streak.ogg?inline';
import unlock from './sounds/unlock.ogg?inline';
import review from './sounds/review.ogg?inline';

// Each sound: its file, how loud it plays (so they all sound about as loud as each other; the tap much softer),
// how long you hear it (seconds) and when it plays. Loudness was measured from the files (RMS): the levels bring
// each to about -16 dB before the volume setting, the tap to about -25 dB.
export const SOUNDS = {
  tap:      { src: tap,      level: 0.25, length: 0.04, when: 'You pick an answer' },
  right:    { src: right,    level: 0.55, length: 0.29, when: 'A right answer' },
  notQuite: { src: notQuite, level: 0.45, length: 0.33, when: 'A not-quite answer (two soft notes going down, never a buzzer)' },
  complete: { src: complete, level: 0.6,  length: 0.49, when: 'A lesson is complete' },
  streak:   { src: streak,   level: 0.8,  length: 0.54, when: 'Your streak grows (with the flame flicker)' },
  unlock:   { src: unlock,   level: 0.75, length: 0.38, when: 'A new lesson comes on air (its lock pops off)' },
  review:   { src: review,   level: 1,    length: 1.2,  when: 'You start the daily review (a radar ping)' },
} as const;
export type SoundName = keyof typeof SOUNDS;
const NAMES = Object.keys(SOUNDS) as SoundName[];

// What played, for the click tests (they can't listen): the sound, how long after the call it was set to start, when
// that is on the page's own clock (`at`, ms, like performance.now(), so a test can line it up with filmed frames: I64),
// and how loud. Also how many files were ready to play, and each one's length and loudest point (so a test can tell a
// real sound from silence).
type Played = { name: SoundName; delay: number; at: number; gain: number; real: boolean };
const log = { played: [] as Played[], ready: 0, failed: 0, files: {} as Partial<Record<SoundName, { seconds: number; peak: number }>> };
if (typeof window !== 'undefined') (window as unknown as { __sounds: typeof log }).__sounds = log;

let ctx: AudioContext | null = null;
const buffers = new Map<SoundName, AudioBuffer>();
let loading: Promise<void> | null = null;

const bytes = (dataUrl: string) => Uint8Array.from(atob(dataUrl.slice(dataUrl.indexOf(',') + 1)), ch => ch.charCodeAt(0)).buffer;
// Sets up the sound system and gets the seven sounds ready (decoding runs in the background). Done once.
function wake(): AudioContext {
  if (ctx) return ctx;
  const a = ctx = new AudioContext();
  loading = Promise.all(NAMES.map(n => a.decodeAudioData(bytes(SOUNDS[n].src))
    .then(b => {
      buffers.set(n, b); log.ready++;
      log.files[n] = { seconds: b.duration, peak: b.getChannelData(0).reduce((m, v) => Math.max(m, Math.abs(v)), 0) };
    }, () => { log.failed++; }))).then(() => {});
  return a;
}

// No sound before your first click or key (the rule for apps on Windows). Setting up the sound system takes about
// 55 ms (measured in R17), so it waits until the app is idle after that first click, not inside it: the first click
// usually opens a lesson, and its glide must stay smooth.
export function prepareSounds() {
  if (typeof window === 'undefined') return;
  const go = () => {
    window.removeEventListener('pointerdown', go, true); window.removeEventListener('keydown', go, true);
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 500));
    idle(() => { try { wake(); } catch { /* no audio available: fine */ } }, { timeout: 1000 });
  };
  window.addEventListener('pointerdown', go, true); window.addEventListener('keydown', go, true);
}

// The old code-made tone (R15), kept as the fallback for right and not quite.
function tone(a: AudioContext, good: boolean, t: number, gain: number) {
  const o = a.createOscillator(), g = a.createGain();
  o.frequency.setValueAtTime(good ? 660 : 200, t); o.type = good ? 'sine' : 'square';
  g.gain.value = 0.13 * gain; o.connect(g); g.connect(a.destination);
  o.start(t); if (good) o.frequency.setValueAtTime(880, t + 0.1);
  o.stop(t + 0.22);
}

// Plays a sound `at` seconds from now, at the volume in Settings. Gives back a "never mind" for a sound that hasn't
// started yet (a screen that closes early, or React setting a screen up twice). `force` plays it even with Sounds off (the sample: you asked for it).
// If the sounds aren't decoded yet (a click in the first moment after start-up), it plays once they are, unless that
// would be more than 0.15 s late: a late sound is worse than none.
export function play(name: SoundName, at = 0, force = false): () => void {
  if (!force && !prefs.sounds) return () => {};
  let a: AudioContext, stopped = false, src: AudioScheduledSourceNode | null = null, startAt = 0;
  try { a = wake(); } catch { return () => {}; }
  if (a.state === 'suspended') a.resume().catch(() => {});
  const gain = SOUNDS[name].level * prefs.volume, asked = a.currentTime;
  const start = () => {
    if (stopped) return;
    const lag = a.currentTime - asked, when = startAt = a.currentTime + Math.max(0, at - lag);
    const buf = buffers.get(name);
    log.played.push({ name, delay: at, at: performance.now() + (when - a.currentTime) * 1000, gain, real: !!buf });
    try {
      if (buf) {
        const s = a.createBufferSource(), g = a.createGain();
        s.buffer = buf; g.gain.value = gain; s.connect(g); g.connect(a.destination); s.start(when); src = s;
      } else if (name === 'right' || name === 'notQuite') tone(a, name === 'right', when, prefs.volume);
    } catch { /* no audio available: fine */ }
  };
  if (buffers.size + log.failed >= NAMES.length) start();
  else loading?.then(() => { if (a.currentTime - asked <= at + 0.15) start(); });
  // A sound that already started plays to its end (it's short); only one still waiting is called off.
  return () => { stopped = true; try { if (src && a.currentTime < startAt) src.stop(); } catch { /* already over */ } };
}

// A right or not-quite answer (the lesson player).
export const beep = (good: boolean) => { play(good ? 'right' : 'notQuite'); };

// Settings' "Play a sample" (R15, idea I55 in R19): the lesson's sounds in a row, a pick, a right answer, a not-quite
// one and a finished lesson, one every SAMPLE_GAP seconds. It plays even with Sounds off, because you asked for it
// (so you can hear them before switching them on). Gives back how long it lasts, in seconds.
export const SAMPLE_SET: SoundName[] = ['tap', 'right', 'notQuite', 'complete'];
export const SAMPLE_GAP = 0.32; // the same as SAMPLE.gap in the speed file (a unit test checks), so each ring goes with its sound
export const SAMPLE_LENGTH = (SAMPLE_SET.length - 1) * SAMPLE_GAP + SOUNDS[SAMPLE_SET.at(-1)!].length;
export function playSample(): number {
  SAMPLE_SET.forEach((n, k) => play(n, k * SAMPLE_GAP, true));
  return SAMPLE_LENGTH;
}
