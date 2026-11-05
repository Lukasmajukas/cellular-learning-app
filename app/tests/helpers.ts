import type { Page } from '@playwright/test';

// Answers "first choice" until the lesson ends (misses come back once, so the count isn't fixed).
export async function playSampleLesson(w: Page) {
  for (let i = 0; i < 12; i++) {
    const done = w.getByTestId('done'), choice = w.locator('[data-testid=choice-0]:not([disabled])');
    await done.or(choice).first().waitFor();          // wait for the next question OR the end screen
    if (await done.isVisible()) return;
    await choice.click(); await w.getByTestId('next').click();
  }
}

// Frame-by-frame recording for animations (from R06's pathmotion.spec.ts; shared since R07).
export type Frame = Record<string, { op: number; sx: number; sy: number; x: number; y: number; tx: string } | null>;
// Records, every frame for `ms`, each selector's own see-through-ness (op), its scale (x and y, from its transform),
// its left and top edges and its text (tx, for count-ups: R07). Elements are looked up again each frame, because some only appear during the movement.
// The frame rate (fps) counts only the frames of the movement itself: from the first frame where `from` is on the page
// (when given), leaving out the gap that frame closes (building the new screen is a one-time cost, not the animation)
// and any gap during a test screenshot taken with snap() (the test pausing the page, not the app being slow; found on
// the Windows build in R06). The slowest gaps are printed, so a slow run shows where the time went.
export async function film(w: Page, sels: string[], act: () => Promise<void>, ms = 1900, from?: string) {
  await w.evaluate(([sels, ms]) => {
    const out = { frames: [] as Frame[], gaps: [] as number[], ts: [] as number[], pauses: [] as [number, number][] };
    (window as unknown as { __film: typeof out }).__film = out;
    const t0 = performance.now(); let last = t0;
    const f = (t: number) => {
      const fr: Frame = {};
      for (const s of sels as string[]) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (!el) { fr[s] = null; continue; }
        const cs = getComputedStyle(el), m = cs.transform === 'none' ? new DOMMatrix() : new DOMMatrix(cs.transform);
        fr[s] = { op: Math.round(Number(cs.opacity) * 1000) / 1000, sx: Math.round(Math.hypot(m.a, m.b) * 1000) / 1000, sy: Math.round(Math.hypot(m.c, m.d) * 1000) / 1000, x: Math.round(el.getBoundingClientRect().x * 10) / 10, y: Math.round(el.getBoundingClientRect().y * 10) / 10, tx: el.textContent ?? '' };
      }
      out.frames.push(fr); out.gaps.push(t - last); out.ts.push(t); last = t;
      if (t - t0 < (ms as number)) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [sels, ms] as const);
  await act();
  await w.waitForTimeout(ms + 150);
  const r = await w.evaluate(() => (window as unknown as { __film: { frames: Frame[]; gaps: number[]; ts: number[]; pauses: [number, number][] } }).__film);
  const start = from ? Math.max(1, r.frames.findIndex(f => f[from])) : 0;
  const gaps = r.gaps.map((g, i) => ({ g, i })).filter(({ g, i }) => i > start &&
    !r.pauses.some(([a, b]) => r.ts[i] - g < b && r.ts[i] > a)).map(x => x.g);
  const of = (s: string) => r.frames.map(f => f[s]);
  console.log(`  slowest frames (ms): ${[...gaps].sort((a, b) => b - a).slice(0, 3).map(g => g.toFixed(0)).join(', ')}; ${r.pauses.length} screenshot pause(s) left out`);
  return { ...r, of, fps: 1000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length) };
}
// A screenshot during a film: the page is paused while it's taken, so film() leaves that time out of the frame rate.
export async function snap(w: Page, path?: string) {
  const a = await w.evaluate(() => performance.now());
  const png = await w.screenshot(path ? { path } : {});
  await w.evaluate(a => { const b = performance.now(); (window as unknown as { __film: { pauses: [number, number][] } }).__film.pauses.push([a, b]); }, a);
  return png;
}

// R22: what the keyboard's focus is on, and whether you can see it: it has a ring (2 px or more; a see-through switch
// or slider draws it on its track or knob), the ring isn't cut off by a box around it, and it's on screen and not under
// the top bar or the bottom tabs. `ok: false` comes with the reason.
export type Ring = { ok: boolean; id: string; why?: string };
export const focusRing = (w: Page) => w.evaluate((): Ring => {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return { ok: false, id: 'BODY', why: 'nothing has the focus' };
  const id = el.dataset.testid ?? `${el.tagName}:${(el.getAttribute('aria-label') ?? el.textContent ?? '').slice(0, 24)}`;
  const part = el.closest('.ui-switch, .ui-slider');
  const ringEl = (part?.querySelector('.ui-switch-track, [data-part=knob]') as HTMLElement | null) ?? el;
  const cs = getComputedStyle(ringEl), wide = parseFloat(cs.outlineWidth);
  if (cs.outlineStyle === 'none' || !(wide >= 2)) return { ok: false, id, why: 'no ring' };
  const r = ringEl.getBoundingClientRect(), out = (parseFloat(cs.outlineOffset) || 0) + wide;
  const ring = { l: r.left - out, t: r.top - out, r: r.right + out, b: r.bottom + out };
  for (let p = ringEl.parentElement; p && p !== document.body; p = p.parentElement) {
    const s = getComputedStyle(p), q = p.getBoundingClientRect();
    if (s.overflowX !== 'visible' && (ring.l < q.left - 0.5 || ring.r > q.right + 0.5)) return { ok: false, id, why: `ring cut off by ${p.tagName} ${p.dataset.testid ?? ''}` };
    if (s.overflowY !== 'visible' && (ring.t < q.top - 0.5 || ring.b > q.bottom + 0.5)) return { ok: false, id, why: `ring cut off by ${p.tagName} ${p.dataset.testid ?? ''}` };
  }
  if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= document.documentElement.clientWidth) return { ok: false, id, why: 'off screen' };
  if (!el.closest('[role=dialog], [role=status]')) for (const bar of ['top-bar', 'tab-bar']) {
    const b = document.querySelector(`[data-testid=${bar}]`);
    if (!b || b.contains(el)) continue;
    const q = b.getBoundingClientRect();
    if (r.top < q.bottom - 0.5 && r.bottom > q.top + 0.5) return { ok: false, id, why: `under the ${bar}` };
  }
  return { ok: true, id };
});
// Presses Tab until the focus is on `testId` (at most `max` times), checking the ring at every stop on the way.
// Returns every stop; fails the test at the first one you couldn't see.
export async function tabTo(w: Page, testId: string | null, max = 40) {
  const stops: string[] = [];
  for (let i = 0; i < max; i++) {
    await w.keyboard.press('Tab');
    const r = await focusRing(w);
    if (!r.ok) throw new Error(`Tab stop ${i + 1} (${r.id}): ${r.why}. Stops so far: ${stops.join(', ')}`);
    stops.push(r.id);
    if (testId && r.id === testId) return stops;
  }
  if (testId) throw new Error(`Tab never reached ${testId}. Stops: ${stops.join(', ')}`);
  return stops;
}
// No screen may scroll sideways: the page is never wider than the window (R22).
export const sideways = (w: Page) => w.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
