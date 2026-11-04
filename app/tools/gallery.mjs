// The gallery tool (redesign R01): pictures of every screen of the real app, for docs/redesign/gallery/latest/.
// Run from app/:  npm run gallery            (builds first, then takes the pictures)
// Options:        node tools/gallery.mjs --out <folder>   (default ../docs/redesign/gallery/latest)
//                 node tools/gallery.mjs --icons-only     (just the icon sheet, 00-icons.webp; no build needed)
// It starts the real Electron app with a made-up save file (3 lessons done, a 4-day streak, some reviews due),
// shows the building blocks page (#blocks, from R03),
// draws a sheet of all our icons (00-icons), visits each screen at the owner's window size (620 x 960) and a wide one (1280 x 800), and saves small WebP files.
// In the cloud (Linux with no screen) it restarts itself inside xvfb-run, a pretend screen.
import { _electron as electron } from 'playwright';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (process.platform === 'linux' && !process.env.DISPLAY && !process.env.GALLERY_XVFB) {
  const r = spawnSync('xvfb-run', ['-a', process.execPath, ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, GALLERY_XVFB: '1' } });
  process.exit(r.status ?? 1);
}
const outArg = process.argv.indexOf('--out');
const OUT = resolve(outArg > 0 ? process.argv[outArg + 1] : join(APP, '..', 'docs', 'redesign', 'gallery', 'latest'));
const SIZES = [{ w: 620, h: 960, suffix: '' }, { w: 1280, h: 800, suffix: '-wide' }];
const DAY = 86_400_000;
const pad = n => String(n).padStart(2, '0');
const today = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// A made-up save: unit 1 lessons 1-3 done, so lesson 4 is "current"; review cards of different ages so the
// heatmap shows several colours and the daily review has questions due.
function seedSave(dir) {
  const now = Date.now();
  const ids = ['u1-4g5g-01', 'u1-4g5g-02', 'u1-higher-01', 'u1-twin-01', 'u1-higher-02', 'u1-tier-01', 'u1-tier-02', 'u1-fr-01',
    'u1-duplex-01', 'u1-duplex-02', 'u1-duplex-03', 'u1-gap-01'];
  const reviews = Object.fromEntries(ids.map((id, i) => {
    const age = [0.2, 1, 3, 6, 12, 20][i % 6], s = [8, 4, 3, 2, 1.5, 1][i % 6];
    return [id, { d: 5, s, due: now - age * DAY + Math.round(s) * DAY, last: now - age * DAY, reps: 2, lapses: i % 3 === 0 ? 1 : 0 }];
  }));
  const save = {
    version: 1,
    progress: { 'unit01-l1': 3, 'unit01-l2': 3, 'unit01-l3': 2 },
    settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 2, look: 'night' },
    reviews,
    game: { streak: 4, lastDay: today(), xp: 120, xpToday: 30, xpDay: today(), doneToday: 1, doneDay: today(), freezes: 1, lost: 0, lostDay: '' },
    seenChanges: [],
  };
  writeFileSync(join(dir, 'save.json'), JSON.stringify(save));
}

async function launch(env) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-gallery-'));
  seedSave(dir);
  const app = await electron.launch({ cwd: APP, args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir, ...env } });
  const w = await app.firstWindow();
  await w.waitForLoadState('domcontentloaded');
  return { app, w };
}
const resize = (app, s) => app.evaluate(({ BrowserWindow }, s) => BrowserWindow.getAllWindows()[0].setContentSize(s.w, s.h), s);

// Screenshot -> WebP, using the app's own Chromium (no extra tools needed).
async function shot(w, name, s, wait = 1300) {
  await w.waitForTimeout(wait); // let pop-ins and slides finish
  const png = await w.screenshot();
  const webp = await w.evaluate(async b64 => {
    const blob = await (await fetch(`data:image/png;base64,${b64}`)).blob();
    const bmp = await createImageBitmap(blob);
    const cv = new OffscreenCanvas(bmp.width, bmp.height);
    cv.getContext('2d').drawImage(bmp, 0, 0);
    const out = await cv.convertToBlob({ type: 'image/webp', quality: 0.8 });
    const bytes = new Uint8Array(await out.arrayBuffer());
    let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }, png.toString('base64'));
  const file = join(OUT, `${name}${s.suffix}.webp`);
  writeFileSync(file, Buffer.from(webp, 'base64'));
  console.log(`  ${file.replace(APP + '/', '')}`);
}

// Moves through learn cards until a pick-one question shows. Returns false if the lesson ended first.
async function toChoice(w) {
  for (let i = 0; i < 30; i++) {
    if (await w.locator('[data-testid^=choice-]:not([disabled])').first().isVisible()) return true;
    if (await w.getByTestId('learn-ok').isVisible()) { await w.getByTestId('learn-ok').click(); await w.waitForTimeout(600); continue; }
    await w.waitForTimeout(300); // a question may still be sliding in
  }
  return false;
}

async function realScreens(s) {
  const { app, w } = await launch({});
  await resize(app, s);
  await w.getByTestId('path-count').waitFor();
  await shot(w, '01-path-map', s);
  await w.getByTestId('lesson-unit01-l4').click();
  await w.getByTestId('quit').waitFor();
  await shot(w, '02-lesson-first-screen', s);
  // One wrong and one right answer. The lesson files mostly list the right answer first, so try choice 1, then choice 0.
  const taken = new Set();
  for (const pick of [1, 0, 1, 0, 2, 0]) {
    if (taken.size === 2 || !(await toChoice(w))) break;
    if (!taken.size) await shot(w, '03-question', s);
    const btn = w.getByTestId(`choice-${pick}`);
    if (!(await btn.count())) continue;
    await btn.click();
    const verdict = (await w.getByTestId('verdict').textContent()) ?? '';
    const name = verdict.startsWith('Right') ? '05-feedback-right' : '04-feedback-wrong';
    if (!taken.has(name)) { taken.add(name); await shot(w, name, s); }
    await w.getByTestId('next').click();
    await w.getByTestId('verdict').waitFor({ state: 'detached' });
  }
  await w.getByTestId('quit').click();
  await w.getByTestId('open-heatmap').click();
  await w.getByTestId('heatmap').waitFor();
  await shot(w, '07-heatmap', s);
  await w.getByTestId('heatmap-back').click();
  await w.getByTestId('open-settings').click();
  await shot(w, '08-settings', s);
  await w.getByTestId('set-day').check();
  await w.getByTestId('settings-back').click();
  await shot(w, '09-path-map-day', s);
  await app.close();
}

// The lesson-complete screen, from the short sample lesson (all pick-one questions).
async function completeScreen(s) {
  const { app, w } = await launch({ CELL_SAMPLE_PATH: '1' });
  await resize(app, s);
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < 12 && !(await w.getByTestId('done').isVisible()); i++) {
    const c = w.locator('[data-testid=choice-0]:not([disabled])');
    await w.getByTestId('done').or(c).first().waitFor();
    if (await w.getByTestId('done').isVisible()) break;
    await c.click(); await w.getByTestId('next').click();
  }
  await w.waitForTimeout(1200); // after the confetti burst
  await shot(w, '06-lesson-complete', s);
  await app.close();
}

// The building blocks page (R03, #blocks in the app): the top (buttons, pills, switches), the answer tiles and Beacon's bubble,
// and the "Not quite" bottom sheet slid up.
async function blocksScreens(s) {
  const { app, w } = await launch({});
  await resize(app, s);
  await w.getByTestId('path-count').waitFor();
  await w.evaluate(() => { location.hash = '#blocks'; location.reload(); });
  await w.getByTestId('blocks').waitFor();
  await shot(w, '10-blocks', s);
  await w.getByTestId('block-tile-idle').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await w.getByTestId('block-bubble-again').click();
  await shot(w, '11-blocks-tiles', s);
  await w.getByTestId('block-sheet-wrong').click();
  await shot(w, '12-blocks-sheet', s);
  await app.close();
}

// The icon sheet (R02): every icon from src/theme/icons.ts at 24 px and 48 px, in the Night colours, plus the filled star.
// Node reads the .ts files directly (Node 22.18 or newer strips the types; ignore its "Reparsing as ES module" warning).
async function iconSheet() {
  const { ICONS, ICON_NAMES } = await import('../src/theme/icons.ts');
  const { NIGHT } = await import('../src/theme/tokens.ts');
  const svg = (name, size, solid = false) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${
    ICONS[name].lines.map(d => `<path d="${d}" fill="${solid ? 'currentColor' : 'none'}"/>`).join('')}${(ICONS[name].dots ?? []).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`).join('')}</svg>`;
  const cell = (name, solid) => `<div class="c"><div style="color:${NIGHT.signal}">${svg(name, 48, solid)}</div><div style="color:${NIGHT.text}">${svg(name, 24, solid)}</div><span>${name}${solid ? ' (solid)' : ''}</span></div>`;
  const html = `<html><body style="margin:0;padding:20px;background:${NIGHT.bg};color:${NIGHT.textMuted};font:13px monospace">
    <style>.g{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}.c{background:${NIGHT.surface};border:1px solid ${NIGHT.border};border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px}</style>
    <div class="g">${ICON_NAMES.map(n => cell(n, false)).join('')}${cell('star', true)}</div></body></html>`;
  const { app, w } = await launch({}); // the app's own window, just as a page to draw on (needs no extra browser)
  await resize(app, { w: 760, h: 640 });
  await w.setContent(html);
  await shot(w, '00-icons', { suffix: '' }, 300);
  await app.close();
}

if (existsSync(OUT) && !process.argv.includes('--icons-only')) for (const f of readdirSync(OUT)) if (f.endsWith('.webp')) rmSync(join(OUT, f));
mkdirSync(OUT, { recursive: true });
console.log(`Gallery -> ${OUT}`);
await iconSheet();
if (process.argv.includes('--icons-only')) process.exit(0);
for (const s of SIZES) { await realScreens(s); await completeScreen(s); await blocksScreens(s); }
console.log('Done.');
