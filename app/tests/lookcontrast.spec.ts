import { _electron as electron, test, expect, type Page } from '@playwright/test';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Redesign R20 (Day look): the contrast test on the real screens, in both looks. The unit test (src/theme.test.ts)
// checks the token pairs we planned; this one reads what the app really draws: for every piece of text on the screen,
// its colour and the colour behind it (see-through layers mixed in, faded parents counted), and the WCAG contrast
// between them. Normal text needs 4.5:1, big text (24 px, or 18.66 px bold) 3:1. Buttons you can't press yet are left
// out, as WCAG allows. Reduce motion is on, so nothing is caught halfway through moving.
// R21: also the start screen, the first-start welcome, the empty heatmap and the two error screens. I69: the "Couldn't save" notice.
// T76: the "A new version is ready" notice and the Updates card in Settings (ready, and a check that got no answer).
type Fail = { text: string; fg: string; bg: string; ratio: number; need: number };
type Audit = { checked: number; fails: Fail[]; unparsed: string[] };

// Runs inside the app's page. Kept self-contained (no imports), because Playwright sends it over as text.
function audit(): Audit {
  const parse = (s: string): [number, number, number, number] | null => {
    let m = s.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/);
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
    m = s.match(/^color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.e-]+))?\)$/);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    return null;
  };
  const over = (top: number[], under: number[]) => [0, 1, 2].map(i => top[i] * top[3] + under[i] * (1 - top[3])).concat(1);
  const lin = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const hex = (c: number[]) => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const token = (n: string) => {
    const d = document.createElement('i'); d.style.color = `var(${n})`; document.body.appendChild(d);
    const v = getComputedStyle(d).color; d.remove(); return parse(v)!;
  };
  // The page behind everything: the night (or day) glow runs from glow-1 in the middle to bg at the edges, so text on
  // the bare page is checked against both ends and the worse one counts.
  const pageEnds = [token('--bg'), token('--glow-1')];
  const unparsed: string[] = [], fails: Fail[] = [];
  let checked = 0;
  const all = [...document.querySelectorAll('body *')] as HTMLElement[];
  for (const el of all) {
    const own = [...el.childNodes].some(n => n.nodeType === 3 && (n.textContent ?? '').trim().length > 0);
    if (!own) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.visibility === 'hidden' || r.width < 1 || r.height < 1) continue;
    if (el.closest('[disabled], [aria-disabled=true], [aria-hidden=true], [data-contrast-skip]')) continue;
    if (el.closest('svg')) continue; // drawings, not words
    // Faded parents: multiply every see-through-ness from here up.
    let fade = 1;
    for (let p: HTMLElement | null = el; p; p = p.parentElement) fade *= Number(getComputedStyle(p).opacity);
    if (fade < 0.05) continue; // not on screen (a bubble that has faded away)
    const fg = parse(cs.color);
    if (!fg) { unparsed.push(cs.color); continue; }
    // The colour behind: background colours from here up, mixed together, on top of the page.
    const layers: number[][] = [];
    let opaque = false;
    for (let p: HTMLElement | null = el; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      const b = parse(getComputedStyle(p).backgroundColor);
      if (!b) { unparsed.push(getComputedStyle(p).backgroundColor); continue; }
      if (b[3] > 0) layers.push(b);
      if (b[3] >= 0.999) { opaque = true; break; }
    }
    const bases = opaque ? [[0, 0, 0, 1]] : pageEnds;
    const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    let worst = Infinity, worstBg: number[] = [];
    for (const base of bases) {
      const bg = layers.reduceRight((under, top) => over(top, under), base as number[]);
      const shown = over([fg[0], fg[1], fg[2], fg[3] * fade], bg); // faded text drifts towards what's behind it
      const k = ratio(shown, bg);
      if (k < worst) { worst = k; worstBg = bg; }
    }
    checked++;
    if (worst < need) fails.push({ text: (el.textContent ?? '').trim().slice(0, 40), fg: hex(fg) + (fade < 1 ? ` (faded ${fade.toFixed(2)})` : ''), bg: hex(worstBg), ratio: Math.round(worst * 100) / 100, need });
  }
  return { checked, fails, unparsed: [...new Set(unparsed)] };
}

const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');
const today = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// extra (R21): replaces parts of the made-up save (a brand-new one for the welcome, no reviews for the empty heatmap).
async function launch(look: string, env: Record<string, string> = {}, progress: Record<string, number> = { 'unit01-l1': 3, 'unit01-l2': 3, 'unit01-l3': 2 }, extra: object = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cell-e2e-'));
  const now = Date.now();
  const ids = ['u1-4g5g-01', 'u1-higher-01', 'u1-twin-01', 'u1-tier-01', 'u1-duplex-01', 'u1-gap-01'];
  const reviews = Object.fromEntries(ids.map((id, i) => [id, { d: 5, s: [8, 4, 3, 2, 1.5, 1][i], due: now - DAY_MS, last: now - [0.2, 1, 3, 6, 12, 20][i] * DAY_MS, reps: 2, lapses: 0 }]));
  writeFileSync(join(dir, 'save.json'), JSON.stringify({ version: 1, progress, reviews, seenChanges: [],
    settings: { sounds: false, reduceMotion: true, showFps: false, dailyGoal: 2, look },
    game: { streak: 4, lastDay: today(), xp: 120, xpToday: 30, xpDay: today(), doneToday: 1, doneDay: today(), freezes: 1, lost: 0, lostDay: '' }, ...extra }));
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: dir, ...env } });
  const w = await app.firstWindow();
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(620, 960));
  await expect(w.locator('html')).toHaveAttribute('data-look', look);
  return { app, w, dir };
}

for (const look of ['night', 'day']) {
  test(`contrast on the real screens: ${look}`, async () => {
    test.setTimeout(240_000);
    const report: Record<string, Audit> = {};
    const check = async (w: Page, name: string) => {
      await w.waitForTimeout(500);
      report[name] = await w.evaluate(audit);
    };
    let { app, w } = await launch(look);
    await w.getByTestId('path-count').waitFor();
    await check(w, 'path');
    await w.getByTestId('tab-review').click(); await w.getByTestId('review-screen').waitFor();
    await check(w, 'review');
    await w.getByTestId('tab-heatmap').click(); await w.getByTestId('heatmap').waitFor();
    await check(w, 'heatmap');
    await w.getByTestId('heat-B71').click(); await w.getByTestId('heat-sheet').waitFor();
    await check(w, 'heatmap sheet');
    await w.keyboard.press('Escape');
    await w.getByTestId('tab-settings').click(); await w.getByTestId('settings').waitFor();
    await check(w, 'settings');
    // R22: the Keys sheet.
    await w.getByTestId('show-keys').click(); await w.getByTestId('keys-sheet').waitFor();
    await check(w, 'keys sheet');
    await w.keyboard.press('Escape'); await expect(w.getByTestId('keys-sheet')).toHaveCount(0);
    // A lesson: the first screen, a question, and both answer sheets.
    await w.getByTestId('tab-path').click();
    await w.getByTestId('lesson-unit01-l4').click(); await w.getByTestId('quit').waitFor();
    await check(w, 'lesson start');
    const seen = new Set<string>();
    for (let i = 0; i < 14 && seen.size < 2; i++) {
      if (await w.getByTestId('learn-ok').isVisible()) { await check(w, 'learn card'); await w.getByTestId('learn-ok').click(); continue; }
      const pick = w.locator(`[data-testid=choice-${seen.has('not quite') ? 0 : 1}]:not([disabled])`);
      if (!(await pick.isVisible())) { await w.waitForTimeout(300); continue; }
      if (!seen.size) await check(w, 'question');
      await pick.click();
      const verdict = (await w.getByTestId('verdict').textContent()) ?? '';
      const name = verdict.startsWith('Right') ? 'right' : 'not quite';
      if (!seen.has(name)) { seen.add(name); await check(w, `sheet: ${name}`); }
      await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' });
    }
    await w.getByTestId('quit').click();
    // The building blocks page: every button, pill, tile, switch and sheet in one place.
    await w.evaluate(() => { location.hash = '#blocks'; location.reload(); });
    await w.getByTestId('blocks').waitFor();
    await check(w, 'blocks');
    await app.close();

    // Lesson complete, and the other question types (from the sample path's demo lessons).
    const done = Object.fromEntries(['u1-l1', 'u1-l2', 'u1-l3', 'u2-l1', 'u2-l2', 'u2-l3'].map(id => [id, 3]));
    ({ app, w } = await launch(look, { CELL_SAMPLE_PATH: '1' }, done));
    await w.getByTestId('path-count').waitFor();
    await w.getByTestId('lesson-u2-l3').click();
    await w.getByTestId('learn-card').waitFor();
    await check(w, 'learn card + ruler');
    await w.getByTestId('learn-ok').click();
    await w.getByTestId('choice-0').click(); await w.getByTestId('next').click();
    await w.getByTestId('number-input').fill('617');
    await check(w, 'type the number');
    await w.getByTestId('check').click(); await w.getByTestId('next').click();
    await w.getByTestId('match-left-0').click(); await w.getByTestId('match-right-0').click(); await w.getByTestId('match-left-1').click();
    await check(w, 'match');
    await w.getByTestId('match-right-1').click(); await w.getByTestId('match-left-2').click(); await w.getByTestId('match-right-2').click();
    await w.getByTestId('check').click(); await w.getByTestId('next').click();
    for (const b of ['B71', 'B12']) await w.getByTestId(`order-item-${b}`).click();
    await check(w, 'order');
    for (const b of ['B2', 'B5']) await w.getByTestId(`order-item-${b}`).click();
    await w.getByTestId('check').click();
    if (await w.getByTestId('why-toggle').count()) await w.getByTestId('why-toggle').click();
    await check(w, 'order: not quite');
    await w.getByTestId('next').click(); await w.getByTestId('verdict').waitFor({ state: 'detached' });
    await w.getByTestId('choice-0').click(); await w.getByTestId('next').click();
    await w.getByTestId('clue-0-choice-0').click(); await w.getByTestId('clue-1-choice-0').click();
    await w.getByTestId('check').click();
    await check(w, 'scenario: checked');
    await w.getByTestId('quit').click();
    await w.getByTestId('lesson-u1-l1').click();
    for (let i = 0; i < 12; i++) {
      const c = w.locator('[data-testid=choice-0]:not([disabled])');
      await w.getByTestId('done').or(c).first().waitFor();
      if (await w.getByTestId('done').isVisible()) break;
      await c.click(); await w.getByTestId('next').click();
    }
    await check(w, 'lesson complete');
    await app.close();

    // The notices: "This changed" and "Your progress is safe".
    const change = { id: 'c1', date: '2026-10-28', title: 'A made-up change', text: 'A card like this shows once.', source: 'Made up for this test', questions: ['u1-4g5g-01'] };
    ({ app, w } = await launch(look, { CELL_TEST_CHANGES: JSON.stringify([change]) }));
    await w.getByTestId('change-card').waitFor();
    await check(w, 'change card');
    await app.close();
    const damaged = await launch(look);
    await damaged.app.close();
    mkdirSync(join(damaged.dir, 'backups'), { recursive: true });
    writeFileSync(join(damaged.dir, 'backups', `save-${today(new Date(Date.now() - DAY_MS))}.json`), readFileSync(join(damaged.dir, 'save.json')));
    writeFileSync(join(damaged.dir, 'save.json'), '{ damaged');
    app = await electron.launch({ args: ['.', '--no-sandbox'], env: { ...process.env, CELL_SAMPLE_PATH: '', CELL_DATA_DIR: damaged.dir } });
    w = await app.firstWindow();
    await w.getByTestId('notice').waitFor();
    await check(w, 'restored notice');
    await app.close();

    // R21: the start screen (held up by a slow load), the first-start welcome, the empty heatmap and the error screens.
    ({ app, w } = await launch(look, { CELL_TEST_LOAD_DELAY: '5000' }));
    await w.getByTestId('start-screen').waitFor();
    await check(w, 'start screen');
    await app.close();
    const fresh = { reviews: {}, game: {}, welcomed: false };
    ({ app, w } = await launch(look, { CELL_SKIP_WELCOME: '' }, {}, fresh));
    await w.getByTestId('welcome-page-0').waitFor();
    await check(w, 'welcome');
    await w.getByTestId('welcome-next').click(); await w.getByTestId('welcome-page-1').waitFor();
    await w.getByTestId('welcome-goal-2').click();
    await check(w, 'welcome: daily goal');
    await w.getByTestId('welcome-look').click();
    await w.getByTestId('tab-heatmap').click(); await w.getByTestId('heat-empty').waitFor();
    await check(w, 'heatmap: empty');
    await app.close();
    // Idea I69: "Couldn't save your last change" (the first saves fail), with its count and "What happened" open.
    ({ app, w } = await launch(look, { CELL_TEST_SAVE_FAIL: '3' }));
    await w.getByTestId('savefail').waitFor();
    await w.getByTestId('savefail-retry').click(); await w.getByTestId('savefail-tries').waitFor();
    await w.getByTestId('savefail-details').locator('summary').click();
    await check(w, 'save failed notice');
    await app.close();
    // T76: "A new version is ready" and the Updates card saying so; then a check that got no answer, its reason open.
    ({ app, w } = await launch(look, { CELL_TEST_UPDATE: JSON.stringify({ state: 'ready', version: '0.1.177', newVersion: '0.1.180' }) }));
    await w.getByTestId('update-ready').waitFor();
    await check(w, 'update notice');
    await w.getByTestId('tab-settings').click(); await w.getByTestId('set-card-updates').waitFor();
    await check(w, 'settings: update ready');
    await app.close();
    ({ app, w } = await launch(look, { CELL_TEST_UPDATE: JSON.stringify({ state: 'failed', version: '0.1.177', detail: 'net::ERR_INTERNET_DISCONNECTED' }) }));
    await w.getByTestId('tab-settings').click(); await w.getByTestId('set-card-updates').waitFor();
    await w.getByTestId('update-details').locator('summary').click();
    await check(w, 'settings: update not reached');
    await app.close();
    for (const [kind, env] of [['load', { CELL_TEST_LOAD_FAIL: '1' }], ['crash', { CELL_TEST_CRASH: '1' }]] as const) {
      ({ app, w } = await launch(look, env));
      await w.getByTestId(`trouble-${kind}`).waitFor();
      await w.getByTestId('trouble-details').locator('summary').click();
      await check(w, `trouble: ${kind}`);
      await app.close();
    }

    const lines = Object.entries(report).map(([k, a]) => `${k}: ${a.checked} checked${a.fails.length ? `, ${a.fails.length} too faint: ` + a.fails.map(f => `"${f.text}" ${f.fg} on ${f.bg} = ${f.ratio} (needs ${f.need})`).join('; ') : ''}`);
    console.log(`${look}:\n  ` + lines.join('\n  '));
    expect(Object.values(report).flatMap(a => a.unparsed)).toEqual([]);
    for (const [k, a] of Object.entries(report)) expect(a.checked, k).toBeGreaterThan(k === 'start screen' ? 1 : 2); // its name and "Tuning in"
    expect(Object.values(report).reduce((n, a) => n + a.checked, 0)).toBeGreaterThan(300);
    expect(Object.entries(report).flatMap(([k, a]) => a.fails.map(f => `${k}: "${f.text}" ${f.fg} on ${f.bg} = ${f.ratio} (needs ${f.need})`))).toEqual([]);
  });
}

// The check itself must catch faint words: make the quiet text colour almost the background, and it has to complain.
test('the contrast check catches faint words', async () => {
  const { app, w } = await launch('day');
  await w.getByTestId('path-count').waitFor();
  await expect(w.getByTestId('start-screen')).toHaveCount(0); // R21: not while the start screen is still fading away
  const before = await w.evaluate(audit);
  await w.evaluate(() => document.documentElement.style.setProperty('--text-muted', '#C9D3DF'));
  const after = await w.evaluate(audit);
  console.log(`faint quiet words: ${before.fails.length} -> ${after.fails.length} too faint (of ${after.checked})`);
  expect(before.fails).toEqual([]);
  expect(after.fails.length).toBeGreaterThan(5);
  expect(after.fails[0].need).toBe(4.5);
  await app.close();
});
