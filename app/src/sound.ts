import { prefs } from './prefs';
let ctx: AudioContext | null = null;
export function beep(good: boolean) {
  if (!prefs.sounds) return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = good ? 660 : 200; o.type = good ? 'sine' : 'square';
    g.gain.value = 0.08; o.connect(g); g.connect(ctx.destination);
    o.start(); if (good) o.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    o.stop(ctx.currentTime + 0.22);
  } catch { /* no audio available: fine */ }
}
