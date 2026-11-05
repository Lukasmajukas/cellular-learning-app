import { _electron as electron, test, expect, type Page, type CDPSession } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { film, playSampleLesson } from './helpers';
import { REAL_PATH } from '../src/units';
import { isScored } from '../src/questions';
import { SAMPLE } from '../src/lesson';

// Redesign R23, the speed check. Three things a slow PC would feel:
// 1. Sitting still costs almost nothing: no screen keeps the computer busy while nothing happens (a loop that's drawn by
//    code every frame, not by the graphics chip, is what this catches: Beacon's breathing rings were one, found in R23).
// 2. Scrolling the whole real path (49 lessons) stays smooth with the computer slowed to a quarter of its speed.
// 3. Start-up: the window shows quickly, the save is read quickly, and the start screen stays only its half second.
// And a table: every animation's frame rate with the computer slowed to a quarter speed (printed, with a floor).
// "Slowed down" is Chromium's own CPU brake (CDP Emulation.setCPUThrottlingRate), the way web developers test slow phones.

const DAY = 86_400_000;
const IDS = [...new Set(REAL_PATH.flatMap(u => u.lessons.flatMap(l => l.questions)).filter(isScored).map(q => q.id))];
// A save with two lessons done, 12 questions waiting for review (so the review's sweep turns) and memories for the heatmap.
const seeded = () => {
  const now = Date.now();
  return Object.fromEntries(IDS.slice(0, 24).map((id, i) => {
    const age = [0.2, 1, 3, 6, 12, 20][i % 6], s = [8, 4, 3, 2, 1.5, 1][i % 6];
    return [id, { d: 5, s, due: i < 12 ? now - (i + 1) * 3_600_000 : now + 3 * DAY, last: now - age * DAY, reps: 2, lapses: 0 }];
  }));
};
const launch = async (sample: boolean) => {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  if (!sample) writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress: { 'unit01-l1': 3, 'unit01-l2': 3 },
    reviews: seeded(), seenChanges: [], settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night' } }));
  const t0 = Date.now();
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: sample ? '1' : '', CELL_DATA_DIR: dir } });
  const w = await app.firstWindow();
  return { app, w, t0, cdp: await w.context().newCDPSession(w) };
};
const brake = (cdp: CDPSession, rate: number) => cdp.send('Emulation.setCPUThrottlingRate', { rate });

// How busy the page's main thread is while nothing happens: milliseconds of work per second, and style recalculations
// per second (a loop drawn by code does one every frame: 60 a second).
async function stillCost(w: Page, cdp: CDPSession, ms = 3000) {
  const read = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x => [x.name, x.value]));
  await cdp.send('Performance.enable');
  const a = await read(); await w.waitForTimeout(ms); const b = await read();
  const per = (k: string) => ((b[k] - a[k]) * 1000) / ms;
  return { busy: per('TaskDuration') * 1000, styles: per('RecalcStyleCount') };
}
// Measured in R23 (cloud): before the fix a question cost 48 ms a second and lesson complete 61, with 60 style passes a
// second (Beacon's rings); after it, every screen is under 7 ms and 5 passes. The bars leave room for a slower computer.
const BUSY_MAX = 25, STYLES_MAX = 10; // ms of work a second (2.5% of the computer), style passes a second

test('sitting still costs almost nothing on every screen (no loop is drawn by code every frame)', async () => {
  test.setTimeout(120_000);
  const rows: string[] = [];
  const check = async (name: string, w: Page, cdp: CDPSession) => {
    await w.mouse.move(2, 2); await w.waitForTimeout(2200); // let the screen's one-off moves finish (pop-ins, glides)
    const s = await stillCost(w, cdp);
    rows.push(`${name.padEnd(16)} ${s.busy.toFixed(1).padStart(5)} ms/s  ${s.styles.toFixed(1).padStart(5)} style passes/s`);
    expect.soft(s.busy, `${name}: main thread busy ms a second`).toBeLessThan(BUSY_MAX);
    expect.soft(s.styles, `${name}: style passes a second`).toBeLessThan(STYLES_MAX);
  };
  const real = await launch(false);
  await real.w.getByTestId('path-count').waitFor();
  await check('path', real.w, real.cdp);
  await real.w.getByTestId('tab-review').click(); await expect(real.w.getByTestId('scope-sweep')).toHaveCount(1);
  await check('review (sweep)', real.w, real.cdp);
  await real.w.getByTestId('tab-heatmap').click(); await real.w.getByTestId('heatmap').waitFor();
  await check('heatmap', real.w, real.cdp);
  await real.w.getByTestId('tab-settings').click(); await real.w.getByTestId('settings').waitFor();
  await check('settings', real.w, real.cdp);
  await real.app.close();
  const s = await launch(true);
  await s.w.getByTestId('lesson-u1-l1').click(); await s.w.getByTestId('prompt').first().waitFor();
  await expect(s.w.getByTestId('beacon')).toHaveAttribute('data-breathing', 'true');
  await check('question', s.w, s.cdp);
  await playSampleLesson(s.w);
  await check('lesson complete', s.w, s.cdp);
  await s.app.close();
  console.log(`  sitting still (bar: under ${BUSY_MAX} ms/s and ${STYLES_MAX} style passes/s):\n    ${rows.join('\n    ')}`);
});

test('scrolling the whole real path (49 lessons) is smooth with the computer slowed to a quarter speed', async () => {
  test.setTimeout(300_000);
  // Scroll 24 px every frame from the top to the bottom (about 1,400 px a second: a quick flick), timing every frame, with
  // the CPU brake on. The first time down, every circle pops in as it arrives, so this is the path's busiest moment too.
  const scrollDown = async (w: Page, cdp: CDPSession) => {
    await cdp.send('Performance.enable');
    const work = async () => (await cdp.send('Performance.getMetrics')).metrics.find(m => m.name === 'TaskDuration')!.value;
    await brake(cdp, 4);
    const w0 = await work(), t0 = Date.now();
    const r = await w.evaluate(() => new Promise<{ gaps: number[]; px: number }>(res => {
      const H = document.documentElement.scrollHeight - innerHeight, gaps: number[] = []; let last = performance.now(), y = 0;
      const f = (t: number) => { gaps.push(t - last); last = t; y += 24; window.scrollTo(0, y); if (y < H) requestAnimationFrame(f); else res({ gaps: gaps.slice(2), px: H }); };
      requestAnimationFrame(f);
    }));
    const busy = (await work() - w0) / ((Date.now() - t0) / 1000);
    await brake(cdp, 1);
    const fps = 1000 / (r.gaps.reduce((a, b) => a + b, 0) / r.gaps.length), slow = r.gaps.filter(g => g > 25).length;
    return { fps, busy, slow, px: r.px, frames: r.gaps.length, worst: [...r.gaps].sort((a, b) => b - a).slice(0, 3).map(g => g.toFixed(0)).join(', ') };
  };
  // The yardstick: a short fixed job (make 2,000 small boxes, style and measure them, a few rounds; the same kind of work
  // as scrolling: style, layout, a little script) timed in the very same window, right before and right after the scroll.
  // Whatever the machine does to it (a busy cloud computer, a slow laptop), it does to the path too, so the path's cost is
  // judged against the yardstick's time, not against fixed numbers. Best of 25 rounds each time, in ms.
  const yardstick = (w: Page) => w.evaluate(() => {
    let best = Infinity;
    for (let r = 0; r < 25; r++) {
      const t = performance.now(), host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-9999px;width:300px';
      for (let i = 0; i < 2000; i++) { const d = document.createElement('div'); d.style.cssText = `padding:${i % 7}px;border:1px solid #000;width:${100 + (i % 50)}px`; d.textContent = 'x' + i; host.appendChild(d); }
      document.body.appendChild(host); let h = 0; host.querySelectorAll('div').forEach(d => { h += (d as HTMLElement).offsetHeight; }); host.remove();
      best = Math.min(best, performance.now() - t);
    }
    return best;
  });
  // The glow done the old way (R23's mistake): a "fixed background" on the page, which Chromium repaints at every scroll step.
  const OLD_GLOW = `body::before{display:none!important} body{background-image:radial-gradient(ellipse 620px 560px at 50% 38%,var(--glow-1) 0%,var(--glow-2) 50%,var(--glow-3) 78%,var(--bg) 100%)!important;background-attachment:fixed!important}`;
  const scrollOnce = async (oldGlow = false) => {
    const { app, w, cdp } = await launch(false);
    if (oldGlow) await w.addStyleTag({ content: OLD_GLOW });
    await w.getByTestId('path-count').waitFor(); await w.waitForTimeout(1500);
    const circles = await w.locator('[data-testid^=lesson-unit]').count();
    expect(circles).toBe(REAL_PATH.flatMap(u => u.lessons).length);
    expect(circles).toBeGreaterThanOrEqual(49);
    await w.evaluate(() => window.scrollTo(0, 0)); await w.waitForTimeout(600);
    const y0 = await yardstick(w);
    const r = await scrollDown(w, cdp);
    const y1 = await yardstick(w), y = Math.min(y0, y1); // the quieter reading: the machine's true speed
    await app.close();
    // The path's cost in main-thread work (ms) per ms of yardstick: a quiet machine and a slow one give about the same.
    const work = r.busy * r.frames * (1000 / r.fps), cost = work / y;
    console.log(`  path ${r.px} px tall, ${circles} lessons: ${r.frames} frames, ${r.fps.toFixed(1)} fps at a quarter speed, main thread busy ${(r.busy * 100).toFixed(0)}% of the time; ${r.slow} frame(s) over 25 ms; slowest ${r.worst} ms`);
    console.log(`  yardstick ${y0.toFixed(1)} ms before, ${y1.toFixed(1)} ms after; path work ${work.toFixed(0)} ms = ${cost.toFixed(1)} yardsticks`);
    return { fps: r.fps, busy: r.busy, slow: r.slow, work, cost };
  };
  // The path and the same path with the old glow, one after the other, three times over; the cheaper try of each counts (a busy
  // moment on the machine only ever makes a try dearer). Both are timed on the same machine in the same minute, so the
  // comparison is fair on a fast laptop and a crowded cloud computer alike.
  const now: Awaited<ReturnType<typeof scrollOnce>>[] = [], old: typeof now = [];
  for (let i = 0; i < 3; i++) { now.push(await scrollOnce()); old.push(await scrollOnce(true)); }
  const best = (xs: typeof now) => xs.reduce((a, b) => (b.work < a.work ? b : a));
  const m = best(now), o = best(old);
  console.log(`  path work ${m.work.toFixed(0)} ms (${m.cost.toFixed(0)} yardsticks) against ${o.work.toFixed(0)} ms (${o.cost.toFixed(0)}) with the old glow: ${(m.work / o.work * 100).toFixed(0)}%; fps ${m.fps.toFixed(1)} (old glow ${o.fps.toFixed(1)}); hitches ${m.slow} (old glow ${o.slow})`);
  // Measured in R23 and T64 (cloud): the path costs 82-84% of the old glow's work (a sixth less); with the old glow really back in the CSS it is 94-100%, and
  // 150-220 yardsticks; the old glow 205-240. Run on the old glow, the first bar fails; the second catches any other
  // step back (a path twice as dear). Frame pacing (fps, hitches) is printed, not judged: it follows how busy the machine is.
  expect(m.work / o.work, 'the path costs less than the old fixed-background glow would (R23 fix still in)').toBeLessThan(0.9);
  expect(m.cost, 'main-thread work for the scroll, in yardsticks (the machine\'s own speed)').toBeLessThan(330);
  expect(m.fps, 'frames a second at a quarter speed (a floor, far below what the machine manages)').toBeGreaterThanOrEqual(30);
});

test('start-up: the window shows quickly, the save is read quickly, and the start screen stays only its half second', async () => {
  test.setTimeout(120_000);
  // Two starts; the faster one counts (the first start after a build can be slow while the computer reads the files
  // from its disk for the first time: once 3.9 s to the first picture in the cloud, then about 0.2 s every time).
  const runs: { shown: number; gone: number; code: number; save: number; up: number }[] = [];
  for (let i = 0; i < 2; i++) {
    const { app, w, t0 } = await launch(false);
    const shown = Date.now() - t0;
    await w.waitForFunction(() => !document.getElementById('boot')); const gone = Date.now() - t0;
    // Times inside the page, from the moment it began to load (ms): its code has run, the save is read, the app is up.
    const p = await w.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const mark = (n: string) => performance.getEntriesByName(n)[0]?.startTime ?? NaN;
      return { code: nav.domContentLoadedEventEnd, save: mark('cell-save-loaded'), up: mark('cell-app-up') };
    });
    runs.push({ shown, gone, ...p });
    await app.close();
  }
  for (const r of runs) console.log(`  window ${r.shown} ms after launch; code ran ${r.code.toFixed(0)}, save read ${r.save.toFixed(0)}, app up ${r.up.toFixed(0)} ms into the page; start screen gone ${r.gone} ms after launch`);
  const best = runs.reduce((a, b) => (b.gone < a.gone ? b : a));
  // Measured in R23 (cloud): window 0.2-0.26 s, code 0.15-0.19 s, save 0.15-0.2 s, app up 0.59-0.6 s (the half-second
  // START.hold, then the fade starts), start screen gone 1.08-1.13 s after launch.
  expect(best.shown, 'the window (with the start screen) shows within 1.5 s').toBeLessThan(1500);
  expect(best.code, 'the app\'s code has run').toBeLessThan(600);
  expect(best.save, 'the save is read').toBeLessThan(800);
  expect(best.up, 'the start screen waits only its half second (START.hold), not longer').toBeLessThan(900);
  expect(best.up, 'and it does wait its half second').toBeGreaterThanOrEqual(480);
  expect(best.gone).toBeLessThan(2500);
});

// Every animation, with the computer slowed to a quarter speed. In the cloud at full speed they all run at about 60 fps
// (each one's own test checks 50+). At a quarter speed R23 measured 41-59 fps (the lowest: the heatmap's tiles filling
// in, as the tab glides). The floor, 30 fps, catches a move that would stutter on a slow PC.
const SLOW_FLOOR = 30;
test('every animation, with the computer slowed to a quarter speed: 30+ fps (the table is printed)', async () => {
  test.setTimeout(180_000);
  const rows: [string, number][] = [];
  const measure = async (name: string, w: Page, cdp: CDPSession, act: () => Promise<void>, sel: string, ms = 1200) => {
    await w.mouse.move(2, 2); await w.waitForTimeout(400);
    await brake(cdp, 4);
    const f = await film(w, [sel], act, ms, sel);
    await brake(cdp, 1);
    rows.push([name, f.fps]);
    expect.soft(f.fps, name).toBeGreaterThanOrEqual(SLOW_FLOOR);
  };
  const real = await launch(false);
  const R = real.w; await R.getByTestId('path-count').waitFor(); await R.waitForTimeout(1500);
  await measure('tab glide + heatmap fill', R, real.cdp, () => R.getByTestId('tab-heatmap').click(), '[data-testid=screen-heatmap]');
  await measure('tab glide + review blips, sweep', R, real.cdp, () => R.getByTestId('tab-review').click(), '[data-testid=review-screen]');
  await measure('tab glide to settings', R, real.cdp, () => R.getByTestId('tab-settings').click(), '[data-testid=settings]');
  await measure('switch switches', R, real.cdp, () => R.getByTestId('set-fps').click(), '[data-testid=settings]', 600);
  await measure('look fade (Night to Day)', R, real.cdp, () => R.getByTestId('set-look-day').click(), '[data-testid=look-fade]', 700);
  await measure('look fade (Day to Night)', R, real.cdp, () => R.getByTestId('set-look-night').click(), '[data-testid=look-fade]', 700);
  await measure('tab glide back to the path', R, real.cdp, () => R.getByTestId('tab-path').click(), '[data-testid=screen-path]');
  await real.app.close();
  const s = await launch(true);
  const S = s.w; await S.getByTestId('screen-path').waitFor(); await S.waitForTimeout(1500);
  // The sample lesson's answer key: answer every question right (one wrong first, so the shake is measured too).
  const answer = async (ok: boolean) => {
    await S.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
    const prompt = await S.getByTestId('prompt').textContent(), q = SAMPLE.find(x => x.prompt === prompt)!;
    await S.getByTestId(`choice-${ok ? q.answer : q.choices.findIndex((_, k) => k !== q.answer)}`).click();
  };
  const next = async () => { await S.getByTestId('next').click(); await S.getByTestId('verdict').waitFor({ state: 'detached' }); };
  await measure('lesson rises in', S, s.cdp, () => S.getByTestId('lesson-u1-l1').click(), '[data-testid=lesson-screen]');
  await measure('wrong answer: shake, sheet', S, s.cdp, () => answer(false), '[data-testid=lesson-screen]', 900);
  await next();                                           // the missed one comes back at the end
  await measure('right answer: pop, glow, sheet', S, s.cdp, () => answer(true), '[data-testid=lesson-screen]', 900);
  await measure('next question glides in', S, s.cdp, () => next(), '[data-testid=lesson-screen]', 900);
  // One wrong, then SAMPLE.length right answers end the lesson (the missed one comes back once). Two are done; the rest
  // at full speed, up to the last "Continue".
  for (let i = 0; i < SAMPLE.length - 2; i++) { await answer(true); await next(); }
  await answer(true);
  await measure('lesson complete (burst, stars, XP)', S, s.cdp, () => S.getByTestId('next').click(), '[data-testid=end]', 2000);
  await measure('back to the path (coming on air)', S, s.cdp, () => S.getByTestId('finish').click(), '[data-testid=screen-path]', 2000);
  await s.app.close();
  console.log(`  every animation at a quarter speed (floor ${SLOW_FLOOR} fps):\n    ${rows.map(([n, f]) => `${n.padEnd(36)} ${f.toFixed(1)} fps`).join('\n    ')}`);
});
