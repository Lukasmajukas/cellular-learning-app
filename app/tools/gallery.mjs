// The gallery tool (redesign R01): pictures of every screen of the real app, for docs/redesign/gallery/latest/.
// Run from app/:  npm run gallery            (builds first, then takes the pictures)
// Options:        node tools/gallery.mjs --out <folder>   (default ../docs/redesign/gallery/latest)
//                 node tools/gallery.mjs --icons-only     (just the icon sheet, 00-icons.webp; no build needed)
//                 node tools/gallery.mjs --types-only     (just the other question types, 18-27; build first; keeps the rest)
//                 node tools/gallery.mjs --look day       (R20: every picture in the Day look, into ../docs/redesign/gallery/latest/day)
//                 node tools/gallery.mjs --flip-only      (idea I10: just the flip books, into flip/; build first; keeps the rest)
//                 node tools/gallery.mjs --updates-only   (T76: just the update notice and the Updates card, 56-57; build first; keeps the rest)
// R21: the start screen, its fade, the welcome, the empty heatmap and the error screens (40-46).
// R22: a phone-narrow window (360 x 640) and the keyboard: 47-54 (see r22Screens).
// Idea I69: "Couldn't save your last change" (55, in firstStartScreens).
// Idea I10: flip books, a sheet of pictures in a row for each animation (flip/f01-f13, see flipBooks).
// T76: "A new version is ready" on the path, and the Updates card in Settings (56, 57, see updateScreens).
// It starts the real Electron app with a made-up save file (3 lessons done, a 4-day streak, some reviews due),
// the other question types (18-27, from R10), a comeback question (28, from R11), the Review tab's looks and the notices (30-33, from R13), the heatmap filling in and its lessons sheet (34, 35, from R14), Settings mid-sample, its bottom and in Day (36-38, from R15), shows the building blocks page (#blocks, from R03; Beacon's faces 16, 17 from R17), the Review tab (13, from R04), the top bar mid-moment and the repair card (14, 15, from R07),
// draws a sheet of all our icons (00-icons), visits each screen at the owner's window size (620 x 960) and a wide one (1280 x 800), and saves small WebP files.
// In the cloud (Linux with no screen) it restarts itself inside xvfb-run, a pretend screen.
import { _electron as electron } from 'playwright';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, readFileSync } from 'node:fs';
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
const lookArg = process.argv.indexOf('--look');
const LOOK = lookArg > 0 ? process.argv[lookArg + 1] : 'night'; // R20: the whole gallery in either look
if (!['night', 'day'].includes(LOOK)) throw new Error(`--look must be night or day, not ${LOOK}`);
const OUT = resolve(outArg > 0 ? process.argv[outArg + 1] : join(APP, '..', 'docs', 'redesign', 'gallery', 'latest', ...(LOOK === 'day' ? ['day'] : [])));
const SIZES = [{ w: 620, h: 960, suffix: '' }, { w: 1280, h: 800, suffix: '-wide' }];
const DAY = 86_400_000;
const pad = n => String(n).padStart(2, '0');
const today = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// A made-up save: unit 1 lessons 1-3 done, so lesson 4 is "current"; review cards of different ages so the
// heatmap shows several colours and the daily review has questions due.
function seedSave(dir, game = {}, progress = { 'unit01-l1': 3, 'unit01-l2': 3, 'unit01-l3': 2 }) {
  const now = Date.now();
  const ids = ['u1-4g5g-01', 'u1-4g5g-02', 'u1-higher-01', 'u1-twin-01', 'u1-higher-02', 'u1-tier-01', 'u1-tier-02', 'u1-fr-01',
    'u1-duplex-01', 'u1-duplex-02', 'u1-duplex-03', 'u1-gap-01'];
  const reviews = Object.fromEntries(ids.map((id, i) => {
    const age = [0.2, 1, 3, 6, 12, 20][i % 6], s = [8, 4, 3, 2, 1.5, 1][i % 6];
    return [id, { d: 5, s, due: now - age * DAY + Math.round(s) * DAY, last: now - age * DAY, reps: 2, lapses: i % 3 === 0 ? 1 : 0 }];
  }));
  const save = {
    version: 1,
    progress,
    settings: { sounds: false, reduceMotion: false, showFps: false, dailyGoal: 2, look: LOOK },
    reviews,
    game: { streak: 4, lastDay: today(), xp: 120, xpToday: 30, xpDay: today(), doneToday: 1, doneDay: today(), freezes: 1, lost: 0, lostDay: '', ...game },
    seenChanges: [],
  };
  writeFileSync(join(dir, 'save.json'), JSON.stringify(save));
}

async function launch(env, game, progress, edit) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-gallery-'));
  seedSave(dir, game, progress);
  edit?.(dir); // R13: change the save after seeding (all clear, a damaged file)
  const app = await electron.launch({ cwd: APP, args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir, ...env } });
  const w = await app.firstWindow();
  await w.waitForLoadState('domcontentloaded');
  return { app, w };
}
const resize = (app, s) => app.evaluate(({ BrowserWindow }, s) => BrowserWindow.getAllWindows()[0].setContentSize(s.w, s.h), s);

// Screenshot -> WebP, using the app's own Chromium (no extra tools needed).
async function shot(w, name, s, wait = 1300) {
  // Design review 4: park the mouse in the window's top-left corner (never a button there), so no picture shows a
  // button grown by hover. Before, "Show 'Not quite'" left the mouse where the sheet's Continue slides in, and
  // `12-blocks-sheet` showed it 3% bigger than in a lesson (idea I79 was that, not a real difference).
  await w.mouse.move(0, 0);
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
  await w.getByTestId('tab-heatmap').click();
  await w.getByTestId('heatmap').waitFor();
  await shot(w, '07-heatmap', s);
  await w.getByTestId('tab-settings').click();
  await shot(w, '08-settings', s);
  await w.getByTestId('tab-review').click();
  await w.getByTestId('review-screen').waitFor();
  await shot(w, '13-review', s);
  // (09-path-map-day and 38-settings-day are gone since R20: the whole gallery is taken in Day too, in latest/day/.)
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
  // R12: caught mid-celebration (the signal burst, stars dropping in, XP counting up), then once it has all settled.
  await shot(w, '29-lesson-complete-burst', s, 380);
  await shot(w, '06-lesson-complete', s, 1500);
  // Back to the path (R07): caught mid-moment, as the XP counts up, the "+N" rises and the goal bar fills (1 of 2 -> 2 of 2).
  // That was the lesson's first finish, so the top bar waits for the path's "coming on air" (1.6 s, design review 1) before it starts.
  await w.getByTestId('finish').click();
  // R18: Beacon has arrived beside the new current lesson and is happy for a moment (its ring pulse), before the top bar's turn.
  await shot(w, '39-path-beacon-happy', s, 1100);
  await shot(w, '14-top-bar-moment', s, 650);
  await app.close();
}

// A missed question coming back (R11, idea I37): the quiet "Comeback" pill beside the label, the counter not grown.
// The sample lesson lists the right answer first, so choice 1 misses the first question; the rest are answered right.
async function comebackScreen(s) {
  const { app, w } = await launch({ CELL_SAMPLE_PATH: '1' });
  await resize(app, s);
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < 8; i++) {
    const c = w.locator(`[data-testid=choice-${i ? 0 : 1}]:not([disabled])`);
    await w.getByTestId('done').or(c).first().waitFor();
    if (await w.getByTestId('done').isVisible()) { console.log('  (no comeback seen: 28-comeback skipped)'); break; }
    if (await w.getByTestId('comeback').isVisible()) { await shot(w, '28-comeback', s, 900); break; }
    await c.click(); await w.getByTestId('next').click();
    await w.getByTestId('verdict').waitFor({ state: 'detached' });
  }
  await app.close();
}

// The other question types (R10), from the two demo lessons of the sample path: the learn card with its spectrum bar,
// type the number, match the pairs (half done), put them in order (half done, then a wrong order with "Why?" open),
// the scenario clues (one picked, then checked with one clue missed), the photo question and a missed tap on the picture.
async function typeScreens(s) {
  const done = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2', 'u2-l3'].map(id => [id, 3]));
  const { app, w } = await launch({ CELL_SAMPLE_PATH: '1' }, {}, done);
  await resize(app, s);
  const go = async () => { await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' }); };
  const why = async () => { const t = w.getByTestId('why-toggle'); if (await t.count()) await t.click(); };
  await w.getByTestId('lesson-u2-l3').click();
  await w.getByTestId('learn-card').waitFor();
  await shot(w, '18-learn-card', s);
  await w.getByTestId('learn-ok').click();
  await w.getByTestId('choice-0').click(); await go();
  await w.getByTestId('number-input').fill('617');
  await shot(w, '19-type-number', s, 900);
  await w.getByTestId('check').click();
  await shot(w, '20-type-number-right', s, 900); await go();
  await w.getByTestId('match-left-0').click(); await w.getByTestId('match-right-0').click(); await w.getByTestId('match-left-1').click();
  await shot(w, '21-match', s, 900);
  await w.getByTestId('match-right-1').click(); await w.getByTestId('match-left-2').click(); await w.getByTestId('match-right-2').click();
  await w.getByTestId('check').click(); await go();
  for (const b of ['B71', 'B12']) await w.getByTestId(`order-item-${b}`).click();
  await shot(w, '22-order', s, 900);
  for (const b of ['B2', 'B5']) await w.getByTestId(`order-item-${b}`).click();
  await w.getByTestId('check').click(); await why();
  await shot(w, '23-order-wrong', s); await go();
  await w.getByTestId('choice-0').click(); await go();
  await w.getByTestId('clue-0-choice-0').click();
  await shot(w, '24-scenario', s, 900);
  await w.getByTestId('clue-1-choice-0').click();
  await w.getByTestId('check').click();
  await shot(w, '25-scenario-wrong', s);
  await w.getByTestId('quit').click();
  await w.getByTestId('lesson-u2-l4').click();
  await w.getByTestId('photo').locator('img').waitFor();
  await shot(w, '26-photo', s);
  await w.getByTestId('choice-2').click(); await go();
  const b = (await w.getByTestId('photo').boundingBox());
  await w.mouse.click(b.x + b.width * 0.1, b.y + b.height * 0.9);
  await shot(w, '27-tap-wrong', s);
  await app.close();
}

// The streak repair card (R07): a 5-day streak whose last lesson was two days ago (yesterday was missed).
async function repairScreen(s) {
  const ago = today(new Date(Date.now() - 2 * DAY));
  const { app, w } = await launch({}, { streak: 5, lastDay: ago, xpToday: 0, xpDay: ago, doneToday: 0, doneDay: ago, freezes: 0 });
  await resize(app, s);
  await w.getByTestId('repair-card').waitFor();
  await w.evaluate(() => window.scrollTo(0, 0));
  await shot(w, '15-repair-card', s, 600);
  await app.close();
}

// R13: the Review tab's scope caught mid-pop (the blips popping in one after another), its "all clear" look, the
// "This changed" card (a made-up change, through the test door CELL_TEST_CHANGES), and "your progress is safe" (a
// damaged save file, restored from yesterday's backup).
async function reviewAndNotices(s) {
  let { app, w } = await launch({});
  await resize(app, s);
  await w.getByTestId('path-count').waitFor();
  await w.getByTestId('tab-review').click();
  await shot(w, '30-review-blips', s, 260);
  await app.close();
  const clear = dir => {
    const f = join(dir, 'save.json'), save = JSON.parse(readFileSync(f, 'utf8'));
    Object.values(save.reviews).forEach((r, i) => { r.due = Date.now() + (5 + i * 9) * 3_600_000; });
    writeFileSync(f, JSON.stringify(save));
  };
  ({ app, w } = await launch({}, {}, undefined, clear));
  await resize(app, s);
  await w.getByTestId('tab-review').click();
  await shot(w, '31-review-clear', s);
  await app.close();
  const change = { id: 'gallery-1', date: '2026-10-28', title: 'A made-up change (for the gallery)', text: 'When a carrier fact changes, a card like this shows once, and the questions about it come back for review.',
    source: 'Made up for this picture', questions: ['u1-4g5g-01', 'u1-twin-01'] };
  ({ app, w } = await launch({ CELL_TEST_CHANGES: JSON.stringify([change, { ...change, id: 'gallery-2' }]) }));
  await resize(app, s);
  await w.getByTestId('change-card').waitFor();
  await shot(w, '32-change-card', s, 600);
  await app.close();
  const damage = dir => {
    mkdirSync(join(dir, 'backups'), { recursive: true });
    writeFileSync(join(dir, 'backups', `save-${today(new Date(Date.now() - DAY))}.json`), readFileSync(join(dir, 'save.json')));
    writeFileSync(join(dir, 'save.json'), '{ damaged');
  };
  ({ app, w } = await launch({}, {}, undefined, damage));
  await resize(app, s);
  await w.getByTestId('notice').waitFor();
  await shot(w, '33-restored-notice', s, 600);
  await app.close();
}

// The building blocks page (R03, #blocks in the app): the top (buttons, pills, switches), the answer tiles and Beacon's bubble,
// the "Not quite" bottom sheet slid up, and Beacon's faces (R17).
// R14: the heatmap mid fill-in (tiles filling one after another) and a band's lessons sheet.
async function heatScreens(s) {
  const { app, w } = await launch({});
  await resize(app, s);
  await w.getByTestId('path-count').waitFor();
  await w.waitForTimeout(1800); // let the path's own pop-ins finish first
  await w.getByTestId('tab-heatmap').click();
  await w.getByTestId('heatmap').waitFor();
  await shot(w, '34-heatmap-fill', s, 330);
  await w.waitForTimeout(1000);
  await w.getByTestId('heat-B71').click();
  await w.getByTestId('heat-sheet').waitFor();
  await shot(w, '35-heatmap-sheet', s, 700);
  await app.close();
}

// R15: the Settings tab mid-sample (the speaker's glow and its first ring going out), scrolled to the bottom (look,
// progress, keys), and (R20) halfway through switching to the other look.
// T76: the app updates itself. A pretend updater (CELL_TEST_UPDATE) says a newer version has been fetched:
// the notice on the path (56), and the Updates card at the bottom of Settings with its "Restart now" (57).
async function updateScreens(s) {
  const { app, w } = await launch({ CELL_TEST_UPDATE: JSON.stringify({ state: 'ready', version: '0.1.177', newVersion: '0.1.180' }) });
  await resize(app, s);
  await w.getByTestId('update-ready').waitFor();
  await shot(w, '56-update-ready', s, 900);
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('set-card-updates').waitFor();
  await w.getByTestId('set-card-keys').scrollIntoViewIfNeeded();
  await shot(w, '57-settings-updates', s, 600);
  await app.close();
}

async function settingsScreens(s) {
  const { app, w } = await launch({});
  await resize(app, s);
  await w.getByTestId('path-count').waitFor();
  await w.getByTestId('tab-settings').click();
  await w.getByTestId('settings').waitFor();
  await w.waitForTimeout(900);
  await w.getByTestId('sound-sample').click();
  await shot(w, '36-settings-sample', s, 200);
  await w.waitForTimeout(900);
  await w.getByTestId('set-card-keys').scrollIntoViewIfNeeded();
  await shot(w, '37-settings-bottom', s, 400);
  // R20: the look changing (idea I56: a cover in the old background fades away), caught halfway.
  await w.getByTestId(`set-look-${LOOK === 'day' ? 'night' : 'day'}`).click();
  await shot(w, '38-look-change', s, 140);
  await app.close();
}

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
  // Beacon (R17): its six faces, and the big one caught mid-cheer (a hop up, the burst rings spreading out).
  await w.getByTestId('block-sheet-close').click();
  await w.getByTestId('block-beacon-card').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await shot(w, '16-beacon', s, 700);
  await w.getByTestId('block-beacon-set-cheering').click();
  await shot(w, '17-beacon-cheering', s, 280);
  await app.close();
}

// The icon sheet (R02): every icon from src/theme/icons.ts at 24 px and 48 px, in the look's colours, plus the filled star.
// Node reads the .ts files directly (Node 22.18 or newer strips the types; ignore its "Reparsing as ES module" warning).
async function iconSheet() {
  const { ICONS, ICON_NAMES } = await import('../src/theme/icons.ts');
  const { PALETTES } = await import('../src/theme/tokens.ts');
  const NIGHT = PALETTES[LOOK]; // R20: the sheet in the look being photographed
  const svg = (name, size, solid = false) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${
    ICONS[name].lines.map(d => `<path d="${d}" fill="${solid ? 'currentColor' : 'none'}"/>`).join('')}${(ICONS[name].dots ?? []).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`).join('')}</svg>`;
  const cell = (name, solid) => `<div class="c"><div style="color:${NIGHT.signal}">${svg(name, 48, solid)}</div><div style="color:${NIGHT.text}">${svg(name, 24, solid)}</div><span>${name}${solid ? ' (solid)' : ''}</span></div>`;
  const html = `<html><body style="margin:0;padding:20px;background:${NIGHT.bg};color:${NIGHT.textMuted};font:13px monospace">
    <style>.g{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}.c{background:${NIGHT.surface};border:1px solid ${NIGHT.border};border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px}</style>
    <div class="g">${ICON_NAMES.map(n => cell(n, false)).join('')}${cell('star', true)}</div></body></html>`;
  const { app, w } = await launch({}); // the app's own window, just as a page to draw on (needs no extra browser)
  await resize(app, { w: 760, h: 900 }); // R20: tall enough for every row (at 640 the first row was cut off)
  await w.setContent(html);
  await w.evaluate(() => window.scrollTo(0, 0));
  await shot(w, '00-icons', { suffix: '' }, 300);
  await app.close();
}

// R21: the start screen (held up by a slow load), the moment it fades into the path, the first-start welcome (both
// pages), the empty heatmap, and the two error screens (through the test doors CELL_TEST_LOAD_DELAY, CELL_TEST_LOAD_FAIL
// and CELL_TEST_CRASH).
async function firstStartScreens(s) {
  let { app, w } = await launch({ CELL_TEST_LOAD_DELAY: '4000' });
  await resize(app, s);
  await w.getByTestId('start-screen').waitFor();
  await shot(w, '40-start-screen', s, 400);
  // Halfway through the fade: the path arriving under the start screen.
  await w.waitForFunction(() => { const b = document.getElementById('boot'); return !b || Number(getComputedStyle(b).opacity) < 0.6; }, null, { polling: 'raf', timeout: 10_000 });
  await shot(w, '41-start-fade', s, 0);
  await app.close();
  const fresh = dir => writeFileSync(join(dir, 'save.json'), JSON.stringify({ settings: { sounds: false, look: LOOK } }));
  ({ app, w } = await launch({ CELL_SKIP_WELCOME: '' }, {}, undefined, fresh));
  await resize(app, s);
  await w.getByTestId('welcome-page-0').waitFor();
  await shot(w, '42-welcome', s, 1200);
  await w.getByTestId('welcome-next').click();
  await w.getByTestId('welcome-page-1').waitFor();
  await w.getByTestId('welcome-goal-2').click();
  await shot(w, '43-welcome-goal', s, 900);
  await w.getByTestId('welcome-look').click();
  await w.getByTestId('path-count').waitFor();
  await w.waitForTimeout(1500);
  await w.getByTestId('tab-heatmap').click();
  await w.getByTestId('heat-empty').waitFor();
  await shot(w, '44-heatmap-empty', s);
  await app.close();
  for (const [kind, env] of [['load', { CELL_TEST_LOAD_FAIL: '1' }], ['crash', { CELL_TEST_CRASH: '1' }]]) {
    ({ app, w } = await launch(env));
    await resize(app, s);
    await w.getByTestId(`trouble-${kind}`).waitFor();
    if (kind === 'load') await w.getByTestId('trouble-details').locator('summary').click();
    await shot(w, `4${kind === 'load' ? 5 : 6}-trouble-${kind}`, s, 900);
    await app.close();
  }
  // Idea I69: "Couldn't save your last change" (CELL_TEST_SAVE_FAIL: the first saves fail), after one Try again (so it
  // shows its count), on the path.
  ({ app, w } = await launch({ CELL_TEST_SAVE_FAIL: '3' }));
  await resize(app, s);
  await w.getByTestId('savefail').waitFor();
  await w.getByTestId('savefail-retry').click(); await w.getByTestId('savefail-tries').waitFor();
  await w.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
  await shot(w, '55-savefail', s, 900);
  await app.close();
}

// R22: window sizes and the keyboard. A phone-narrow window (360 x 640: the path, Settings, a match question, lesson
// complete; 47-50), and at the owner's size the keyboard's ring on the path (51), the Keys sheet (52), a match being
// paired with the number and letter keys (53) and the crosshair on a tap-the-picture question (54).
const NARROW = { w: 360, h: 640, suffix: '-narrow' };
async function r22Screens() {
  let { app, w } = await launch({});
  await resize(app, NARROW);
  await w.getByTestId('path-count').waitFor();
  await shot(w, '47-path', NARROW);
  await w.getByTestId('tab-settings').click();
  await shot(w, '48-settings', NARROW, 900);
  // The keyboard's ring, at the owner's size: Tab from the tabs onto the current lesson (the page scrolls it clear of the bars).
  await resize(app, SIZES[0]);
  await w.getByTestId('tab-path').click(); await w.waitForTimeout(1300);
  for (let i = 0; i < 12; i++) {
    await w.keyboard.press('Tab');
    if (await w.evaluate(() => document.activeElement?.getAttribute('data-testid') === 'lesson-unit01-l4')) break;
  }
  await shot(w, '51-focus-ring', SIZES[0], 500);
  await w.getByTestId('tab-settings').click(); await w.waitForTimeout(900);
  await w.getByTestId('show-keys').click();
  await shot(w, '52-keys-sheet', SIZES[0], 900);
  await app.close();
  const done = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2', 'u2-l3'].map(id => [id, 3]));
  ({ app, w } = await launch({ CELL_SAMPLE_PATH: '1' }, {}, done));
  await resize(app, SIZES[0]);
  await w.getByTestId('lesson-u2-l3').click();
  await w.getByTestId('learn-card').waitFor(); await w.keyboard.press('Enter');
  await w.getByTestId('choice-0').click(); await w.getByTestId('next').click();
  await w.getByTestId('number-input').fill('617'); await w.keyboard.press('Enter'); await w.getByTestId('next').click();
  await w.getByTestId('match-grid').waitFor(); await w.waitForTimeout(700);
  await w.keyboard.press('2'); await w.keyboard.press(await w.getByTestId('match-right-1').getAttribute('data-letter'));
  await w.keyboard.press('1');
  await shot(w, '53-match-keys', SIZES[0], 700);
  await resize(app, NARROW);
  await shot(w, '49-match', NARROW, 700);
  await app.close();
  ({ app, w } = await launch({ CELL_SAMPLE_PATH: '1' }, {}, { ...done, 'u2-l4': 3 }));
  await resize(app, SIZES[0]);
  await w.getByTestId('lesson-u2-l4').click();
  await w.getByTestId('choice-2').click(); await w.getByTestId('next').click();
  await w.getByTestId('prompt').filter({ hasText: 'Tap the antennas.' }).waitFor();
  await w.waitForTimeout(700);
  for (let i = 0; i < 12 && !(await w.evaluate(() => document.activeElement?.getAttribute('data-testid') === 'photo')); i++) await w.keyboard.press('Tab');
  for (let i = 0; i < 3; i++) await w.keyboard.press('ArrowUp');
  await shot(w, '54-tap-aim', SIZES[0], 300);
  await app.close();
  ({ app, w } = await launch({ CELL_SAMPLE_PATH: '1' }));
  await resize(app, NARROW);
  await w.getByTestId('lesson-u1-l1').click();
  for (let i = 0; i < 12; i++) {
    const c = w.locator('[data-testid=choice-0]:not([disabled])');
    await w.getByTestId('done').or(c).first().waitFor();
    if (await w.getByTestId('done').isVisible()) break;
    await c.click(); await w.getByTestId('next').click();
  }
  await shot(w, '50-lesson-complete', NARROW, 1600);
  await app.close();
}

// Idea I10: flip books. A still picture can't show movement, so for each animation the gallery also takes a short burst
// of pictures (one every `every` ms, `n` of them) and lays them out on one sheet, in rows, each labelled with the real time
// on screen (time since the click that started it). They go to `flip/` (latest/flip/, or latest/day/flip/ in Day), at the
// owner's window size (620 x 960) plus the narrow lesson complete (360 x 640, for idea I94).
// How: Chromium's own frame stream (the DevTools "screencast") sends a picture each time the screen changes, with the
// exact time it was drawn. For each planned moment (0, every, 2 x every ...) the sheet shows the last picture drawn by
// then, which is what was on screen at that moment. (Ordinary screenshots took 120-150 ms each, too slow for a 0.3 s move.)
const FLIP = join(OUT, 'flip');
async function flip(w, name, s, title, go, { n = 8, every = 80, cols = n > 8 ? 6 : 4 } = {}) {
  await w.mouse.move(0, 0); // as in shot(): no button grown by hover
  const cdp = await w.context().newCDPSession(w);
  const seen = [];
  cdp.on('Page.screencastFrame', f => { seen.push({ t: f.metadata.timestamp * 1000, png: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
  await w.waitForTimeout(250); // the stream's first picture: the screen before the click
  await go(); // a click (it returns as soon as the click has been handled) or a wait for something to start
  const t0 = Date.now();
  await w.waitForTimeout((n - 1) * every + 120);
  await cdp.send('Page.stopScreencast');
  await cdp.detach();
  if (!seen.length) throw new Error(`${name}: the frame stream sent no pictures`);
  const frames = Array.from({ length: n }, (_, i) => {
    const at = t0 + i * every, f = seen.filter(x => x.t <= at).at(-1) ?? seen[0];
    return { t: i * every, png: f.png };
  });
  const { PALETTES } = await import('../src/theme/tokens.ts');
  const c = PALETTES[LOOK];
  const webp = await w.evaluate(async ({ frames, cols, title, c, thumb }) => {
    const bmps = await Promise.all(frames.map(async f => createImageBitmap(await (await fetch(`data:image/png;base64,${f.png}`)).blob())));
    const k = thumb / bmps[0].width, tw = thumb, th = Math.round(bmps[0].height * k);
    const gap = 10, label = 22, head = 34, rows = Math.ceil(bmps.length / cols);
    const cv = new OffscreenCanvas(gap + cols * (tw + gap), head + rows * (th + label + gap));
    const g = cv.getContext('2d');
    g.fillStyle = c.bg; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = c.text; g.font = '600 15px sans-serif'; g.textBaseline = 'middle';
    g.fillText(title, gap, head / 2);
    bmps.forEach((b, i) => {
      const x = gap + (i % cols) * (tw + gap), y = head + Math.floor(i / cols) * (th + label + gap);
      g.drawImage(b, x, y, tw, th);
      g.strokeStyle = c.border; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, tw - 1, th - 1);
      g.fillStyle = c.textMuted; g.font = '12px monospace';
      g.fillText(`${i + 1}`, x, y + th + label / 2);
      g.fillStyle = c.signal; g.textAlign = 'right';
      g.fillText(`${(frames[i].t / 1000).toFixed(2)} s`, x + tw, y + th + label / 2);
      g.textAlign = 'left';
    });
    const out = await cv.convertToBlob({ type: 'image/webp', quality: 0.8 });
    const bytes = new Uint8Array(await out.arrayBuffer());
    let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }, { frames, cols, title, c, thumb: s.w <= 400 ? 180 : 200 });
  const file = join(FLIP, `${name}${s.suffix}.webp`);
  writeFileSync(file, Buffer.from(webp, 'base64'));
  console.log(`  ${file.replace(APP + '/', '')}  (${n} of ${seen.length} streamed pictures)`);
}
// A click that doesn't move the mouse (so nothing in the pictures is grown by hover).
const press = (w, id) => () => w.getByTestId(id).evaluate(el => el.click());
// The sample lesson's answer buttons are shuffled, but each keeps its own test id (choice-<number in the list>), so the
// right one is found from the question's words.
async function choiceId(w, ok) {
  const { SAMPLE } = await import('../src/lesson.ts');
  await w.locator('[data-testid^=choice-]:not([disabled])').first().waitFor();
  const prompt = await w.getByTestId('prompt').textContent(), q = SAMPLE.find(x => x.prompt === prompt);
  return `choice-${ok ? q.answer : q.choices.findIndex((_, k) => k !== q.answer)}`;
}
// Answers right until the lesson's last answer is showing, so the next Continue opens lesson complete.
async function toLastAnswer(w) {
  for (let i = 0; i < 14; i++) {
    await press(w, await choiceId(w, true))();
    await w.getByTestId('next').waitFor(); await w.waitForTimeout(500);
    const [, n, total] = (await w.getByTestId('lesson-count').getAttribute('aria-label')).match(/Question (\d+) of (\d+)/);
    if (n === total) return; // (only in a lesson with no misses: a miss comes back at the end, adding one on Continue)
    await press(w, 'next')(); await w.getByTestId('verdict').waitFor({ state: 'detached' });
  }
  throw new Error('the lesson never reached its last answer');
}

async function flipBooks() {
  const s = SIZES[0];
  // The start screen fading away as the path pops in under it (held up by a made-up slow start).
  let { app, w } = await launch({ CELL_TEST_LOAD_DELAY: '1500' });
  await resize(app, s);
  await w.getByTestId('start-screen').waitFor();
  await flip(w, 'f01-start-fade', s, 'Start screen fades, the path pops in under it', () =>
    w.waitForFunction(() => { const b = document.getElementById('boot'); return !b || Number(getComputedStyle(b).opacity) < 0.98; }, null, { polling: 'raf', timeout: 10_000 }));
  await app.close();
  // A lesson from start to end (the sample path): opening it, a right answer
  // ("signal locked"), the next question gliding in, a wrong answer, lesson complete, and back to the path.
  ({ app, w } = await launch({ CELL_SAMPLE_PATH: '1' }));
  await resize(app, s);
  await w.getByTestId('path-count').waitFor(); await w.waitForTimeout(1800);
  await flip(w, 'f02-lesson-opens', s, 'Opening a lesson (click on its circle)', press(w, 'lesson-u1-l1'), { every: 60 });
  await w.waitForTimeout(800);
  await flip(w, 'f03-answer-right', s, 'A right answer: "signal locked"', press(w, await choiceId(w, true)), { every: 60 });
  await flip(w, 'f04-next-question', s, 'Continue: the next question glides in', press(w, 'next'), { every: 60 });
  await w.waitForTimeout(500);
  await flip(w, 'f05-answer-wrong', s, 'A wrong answer: a gentle shake, the sheet slides up', press(w, await choiceId(w, false)), { every: 60 });
  await app.close();
  // Lesson complete and back to the path, from a lesson answered all right (a miss would come back at the end).
  ({ app, w } = await launch({ CELL_SAMPLE_PATH: '1' }));
  await resize(app, s);
  await w.getByTestId('lesson-u1-l1').click();
  await toLastAnswer(w);
  await flip(w, 'f06-lesson-complete', s, 'Lesson complete: Beacon grows and cheers, burst, stars, XP, bars, its line', press(w, 'next'), { n: 12, every: 150 });
  await w.waitForTimeout(600);
  await flip(w, 'f07-back-to-path', s, 'Back to the path: coming on air, Beacon arrives, then the top bar', press(w, 'finish'), { n: 12, every: 250 });
  await app.close();
  // The tabs: the review scope's blips, the heatmap filling in and a band's sheet, Settings' sample, the look changing.
  ({ app, w } = await launch({}));
  await resize(app, s);
  await w.getByTestId('path-count').waitFor(); await w.waitForTimeout(1800);
  await flip(w, 'f08-review-blips', s, 'Review tab: the blips pop in', press(w, 'tab-review'));
  await w.waitForTimeout(800);
  await flip(w, 'f09-heatmap-fill', s, 'Heatmap tab: the tiles fill in', press(w, 'tab-heatmap'));
  await w.waitForTimeout(1200);
  await flip(w, 'f10-heat-sheet', s, 'A band\'s lessons sheet slides up', press(w, 'heat-B71'), { every: 60 });
  await w.keyboard.press('Escape'); await w.waitForTimeout(600);
  await w.getByTestId('tab-settings').evaluate(el => el.click()); await w.getByTestId('settings').waitFor(); await w.waitForTimeout(900);
  await flip(w, 'f11-settings-sample', s, 'Settings, Play a sample: a ring for each of the four sounds', press(w, 'sound-sample'), { every: 200 });
  await w.waitForTimeout(600);
  await flip(w, 'f12-look-change', s, `Switching the look (${LOOK === 'day' ? 'Day to Night' : 'Night to Day'}): the old background fades away`, press(w, `set-look-${LOOK === 'day' ? 'night' : 'day'}`), { every: 50 });
  await app.close();
  // Beacon cheering, on the building blocks page.
  ({ app, w } = await launch({}));
  await resize(app, s);
  await w.getByTestId('path-count').waitFor();
  await w.evaluate(() => { location.hash = '#blocks'; location.reload(); });
  await w.getByTestId('blocks').waitFor();
  await w.getByTestId('block-beacon-card').evaluate(el => el.scrollIntoView({ block: 'start' }));
  await w.waitForTimeout(900);
  await flip(w, 'f13-beacon-cheers', s, 'Beacon cheers: a hop up, the burst rings spread out', press(w, 'block-beacon-set-cheering'), { every: 100 });
  await app.close();
  // Lesson complete on a narrow window (idea I94: the bubble's kept room under the title until it pops in at 0.9 s).
  ({ app, w } = await launch({ CELL_SAMPLE_PATH: '1' }));
  await resize(app, NARROW);
  await w.getByTestId('lesson-u1-l1').click();
  await toLastAnswer(w);
  await flip(w, 'f06-lesson-complete', NARROW, 'Lesson complete, narrow window (360 x 640)', press(w, 'next'), { n: 12, every: 150 });
  await app.close();
}

const typesOnly = process.argv.includes('--types-only');
const flipOnly = process.argv.includes('--flip-only');
const updatesOnly = process.argv.includes('--updates-only');
if (existsSync(OUT) && !process.argv.includes('--icons-only') && !typesOnly && !flipOnly && !updatesOnly) for (const f of readdirSync(OUT)) if (f.endsWith('.webp')) rmSync(join(OUT, f));
mkdirSync(OUT, { recursive: true });
if (!process.argv.includes('--icons-only') && !typesOnly && !updatesOnly) { rmSync(FLIP, { recursive: true, force: true }); mkdirSync(FLIP, { recursive: true }); }
console.log(`Gallery -> ${OUT}`);
if (typesOnly) { for (const s of SIZES) await typeScreens(s); console.log('Done.'); process.exit(0); }
if (flipOnly) { await flipBooks(); console.log('Done.'); process.exit(0); }
if (updatesOnly) { for (const s of SIZES) await updateScreens(s); console.log('Done.'); process.exit(0); }
await iconSheet();
if (process.argv.includes('--icons-only')) process.exit(0);
for (const s of SIZES) { await firstStartScreens(s); await realScreens(s); await completeScreen(s); await comebackScreen(s); await repairScreen(s); await reviewAndNotices(s); await heatScreens(s); await settingsScreens(s); await updateScreens(s); await blocksScreens(s); await typeScreens(s); }
await r22Screens();
await flipBooks();
console.log('Done.');
