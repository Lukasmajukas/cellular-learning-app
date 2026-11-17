// T76: the real proof that the app can update itself. Runs on the Windows build computer only
// (.github/workflows/app-build.yml), with two freshly made builds: an "old" one (0.0.1) and the real one.
//
//   node tools/update-e2e.mjs <folder of the old build> <folder of the new build>
//   node tools/update-e2e.mjs <folder of the old build> <folder of the new build> --live
//
// What it does, like a person would:
//   1. installs the old version with its real installer (quietly, no windows);
//   2. checks the installer's helper and the Start-menu icon are there;
//   3. puts a progress file with some stars in the app's real data folder;
//   4. opens the old app. The app is told two update addresses: the first is dead on purpose, the second is this
//      project's own Cloudflare Worker code (update-server/src/worker.js), run right here in front of a pretend
//      GitHub that holds the new build;
//   5. waits until the app has found, fetched and unpacked the new version by itself (so: the dead address was
//      skipped, the Worker's list was accepted, and the installer's helper followed the Worker's "it's over there"
//      to the package);
//   6. lets the app restart itself ("Restart now"), and checks the NEW version is the one running;
//   7. opens the app once more the normal way: still the new version, and it now says "nothing newer";
//   8. checks the stars in the progress file are untouched.
// Any step that doesn't happen in time fails the build, and prints the app's own notes and the installer's logs.
//
// --live (builds of main only, right after the new build is published): the same walk, but against the REAL
// addresses in electron/update-feeds.json, over the real internet. No pretend servers and no dead address: this
// round proves the part the first round can't, that the installer's helper gets along with GitHub's (and, once it is
// switched on, Cloudflare's) secure connection and redirects. Whichever address answers first is fine; the notes say which.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { handle } from '../../update-server/src/worker.js';
import { newestFull, compareVersions } from './releases.mjs';

if (process.platform !== 'win32') { console.error('This test installs a real Windows app, so it only runs on Windows.'); process.exit(1); }
const LIVE = process.argv.includes('--live');
const [oldDir, newDir] = process.argv.slice(2).filter(a => !a.startsWith('--')).map(p => path.resolve(p));
if (!oldDir || !newDir) { console.error('Usage: node tools/update-e2e.mjs <old build folder> <new build folder> [--live]'); process.exit(1); }

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const EXE = `${pkg.productName}.exe`;                                  // Cell Learning.exe
const ROOT = path.join(process.env.LOCALAPPDATA, 'CellLearning');      // where the installer puts the app
const UPDATE_EXE = path.join(ROOT, 'Update.exe');
const LOG = path.join(process.env.RUNNER_TEMP || process.env.TEMP, `cell-update-${Date.now()}.log`);
const OLD = newestFull(fs.readFileSync(path.join(oldDir, 'RELEASES'), 'utf8'));
const NEW = newestFull(fs.readFileSync(path.join(newDir, 'RELEASES'), 'utf8'));
const SEED = { version: 1, progress: { 'unit01-l1': 3, 'unit01-l2': 2 }, reviews: {}, seenChanges: [], welcomed: true,
  // No streak in the seed: the app itself ends a streak when days were missed, which has nothing to do with updating.
  game: { streak: 0, lastDay: '', xp: 120, xpToday: 0, xpDay: '', doneToday: 0, doneDay: '', freezes: 0, lost: 0, lostDay: '' },
  settings: { sounds: false, volume: 60, reduceMotion: true, showFps: false, dailyGoal: 2, look: 'night', autoUpdate: true } };

const sleep = ms => new Promise(r => setTimeout(r, ms));
const say = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
// The app's notes, one JSON line per step. A line caught half-written is skipped; the next look reads it whole.
const lines = () => (fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean) : [])
  .flatMap(l => { try { return [JSON.parse(l)]; } catch { return []; } });
// Waits until the app's notes hold a line that fits, counting only lines from `from` on.
async function waitFor(what, fits, { from = 0, ms = 120000 } = {}) {
  const end = Date.now() + ms;
  for (;;) {
    const all = lines(), at = all.findIndex((l, i) => i >= from && fits(l));
    if (at >= 0) { say(`ok: ${what}`); return { line: all[at], next: at + 1 }; }
    if (Date.now() > end) throw new Error(`Waited ${ms / 1000} s for: ${what}`);
    await sleep(500);
  }
}
async function waitForFile(file, ms = 120000) {
  const end = Date.now() + ms;
  while (!fs.existsSync(file)) { if (Date.now() > end) throw new Error(`Waited ${ms / 1000} s for the file ${file}`); await sleep(500); }
}
const check = (ok, what) => { if (!ok) throw new Error(`Not true: ${what}`); say(`ok: ${what}`); };
const closeApp = async () => { spawnSync('taskkill', ['/F', '/T', '/IM', EXE], { stdio: 'ignore' }); await sleep(1500); };
// The app's notes and the pretend servers' notes, printed at the end (pass or not): the proof, readable in the build log.
function showNotes() {
  console.log('\n--- what the app wrote down ---'); for (const l of lines()) console.log(JSON.stringify(l));
  if (!LIVE) { console.log('\n--- what was asked of the two pretend servers ---'); for (const a of asked) console.log(a); }
}
const open = (program, args, env) => spawn(program, args, { env: { ...process.env, CELL_SKIP_WELCOME: '1', CELL_UPDATE_LOG: LOG, ...env }, detached: true, stdio: 'ignore' }).unref();
const find = (dir, name, depth = 4) => {
  if (depth < 0 || !fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const f = path.join(dir, e.name);
    return e.isDirectory() ? find(f, name, depth - 1) : e.name.toLowerCase() === name.toLowerCase() ? [f] : [];
  });
};

// The pretend GitHub (holds the new build's files) and, in front of it, the Worker's own code.
const asked = [];
const github = http.createServer((req, res) => {
  const name = path.basename(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = path.join(newDir, name);
  if (!req.url.startsWith('/files/') || !fs.existsSync(file)) { asked.push(`github ${req.method} ${req.url} -> 404`); res.writeHead(404).end('Not Found'); return; }
  asked.push(`github ${req.method} ${req.url} -> 200`);
  res.writeHead(200, { 'content-length': fs.statSync(file).size, 'content-type': 'application/octet-stream' });
  if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
});
const door = http.createServer(async (req, res) => {
  try {
    const answer = await handle(new Request(`http://127.0.0.1:${door.address().port}${req.url}`, { method: req.method }),
      { files: `http://127.0.0.1:${github.address().port}/files/` });
    asked.push(`door   ${req.method} ${req.url} -> ${answer.status}${answer.headers.get('location') ? ` ${answer.headers.get('location')}` : ''}`);
    res.writeHead(answer.status, Object.fromEntries(answer.headers));
    res.end(Buffer.from(await answer.arrayBuffer()));
  } catch (e) { asked.push(`door   ${req.method} ${req.url} -> broke: ${e}`); res.writeHead(500).end(String(e)); }
});
const listen = server => new Promise(r => server.listen(0, '127.0.0.1', r));

async function main() {
  say(`Update test${LIVE ? ' (live, over the real internet)' : ''}: ${OLD.version} -> ${NEW.version}. Notes: ${LOG}`);
  check(OLD.version !== NEW.version, `the two builds have different versions (${OLD.version}, ${NEW.version})`);
  await closeApp();
  if (fs.existsSync(ROOT)) {
    if (!process.env.CI) throw new Error(`${ROOT} exists: this test would replace your installed app. It only cleans up on the build computer.`);
    spawnSync('taskkill', ['/F', '/T', '/IM', 'Update.exe'], { stdio: 'ignore' });
    fs.rmSync(ROOT, { recursive: true, force: true, maxRetries: 20, retryDelay: 500 });
  }
  // What the app is told about where to ask. Live: nothing, so it uses its own built-in addresses. Otherwise two
  // pretend ones: the first answers nobody (port 9 is closed), so the app has to move on to the second.
  let where = {};
  if (!LIVE) {
    await listen(github); await listen(door);
    where = { CELL_UPDATE_URL: `http://127.0.0.1:9/win,http://127.0.0.1:${door.address().port}/win` };
  }

  // 1. Install the old version, quietly. (A quiet install doesn't open the app afterwards.)
  const [setup] = fs.readdirSync(oldDir).filter(n => /setup.*\.exe$/i.test(n));
  check(!!setup, `the old build has an installer (${setup})`);
  const done = spawnSync(path.join(oldDir, setup), ['--silent'], { stdio: 'inherit', timeout: 300000 });
  check(done.status === 0, `the installer finished (exit ${done.status})`);
  const oldExe = path.join(ROOT, `app-${OLD.version}`, EXE);
  await waitForFile(oldExe); await waitForFile(UPDATE_EXE);
  say(`ok: installed ${oldExe}`);

  // 2. The icons (T67): the installer starts the app with "you were just installed", and the app asks the helper for them.
  const startMenu = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs');
  const lnk = `${pkg.productName}.lnk`;
  let icons = [];
  for (let i = 0; i < 40 && !icons.length; i++) { icons = find(startMenu, lnk); if (!icons.length) await sleep(500); }
  check(icons.length > 0, `a Start-menu icon exists (${icons[0] ?? `no ${lnk} under ${startMenu}`})`);
  const desktop = find(path.join(process.env.USERPROFILE, 'Desktop'), lnk, 0).concat(find(path.join(process.env.PUBLIC || 'C:\\Users\\Public', 'Desktop'), lnk, 0));
  say(desktop.length ? `ok: a desktop icon exists (${desktop[0]})` : 'note: no desktop icon found (not required here)');

  // 3. Open the old app once, updates far away, only to learn where it keeps your progress. Then put the stars there.
  open(oldExe, [], { ...where, CELL_UPDATE_FIRST_MS: '3600000' });
  let step = await waitFor(`the old app (${OLD.version}) starts and its updater can run`, l => l.event === 'start' && l.version === OLD.version);
  check(step.line.why === null, `the updater has no reason not to run (why: ${step.line.why})`);
  const dataFile = step.line.dataFile;
  check(dataFile.toLowerCase().startsWith(process.env.APPDATA.toLowerCase()) && !dataFile.toLowerCase().startsWith(ROOT.toLowerCase()),
    `your progress lives outside the app's own folder (${dataFile})`);
  await closeApp();
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(SEED, null, 2));

  // 4.-6. Open the old app for real. It should update itself and then restart into the new version.
  // (Live: if a round gets no answer, ask again after 20 s instead of 4 hours; the internet can hiccup.)
  open(oldExe, [], { ...where, CELL_UPDATE_FIRST_MS: '2000', CELL_UPDATE_EVERY_MS: LIVE ? '20000' : '', CELL_UPDATE_TEST_RESTART: '1' });
  step = await waitFor('the old app starts again', l => l.event === 'start' && l.version === OLD.version, { from: step.next });
  let ready;
  if (LIVE) {
    check(step.line.feeds.length > 0 && step.line.feeds.every(f => f.startsWith('https://')), `the app asks its own real addresses (${step.line.feeds.join(', ')})`);
    // At least this build. (If an even newer build of main was published a moment ago, that one is fine too.)
    ready = await waitFor(`version ${NEW.version} (or newer) is fetched over the real internet`,
      l => l.event === 'ready' && /^\d+\.\d+\.\d+$/.test(String(l.newVersion)) && compareVersions(String(l.newVersion), NEW.version) >= 0, { from: step.next, ms: 900000 });
    say(`ok: it came from address ${ready.line.feed + 1} of ${step.line.feeds.length}: ${step.line.feeds[ready.line.feed]}`);
  } else {
    await waitFor('the dead first address is skipped', l => l.event === 'failed' && l.feed === 0, { from: step.next });
    ready = await waitFor(`the new version (${NEW.version}) is fetched through the second address`,
      l => l.event === 'ready' && l.feed === 1 && String(l.newVersion).startsWith(NEW.version), { from: step.next, ms: 420000 });
    check(asked.some(a => a.startsWith('door') && a.includes('/win/RELEASES') && a.endsWith('200')), 'the Worker handed over the list');
    check(asked.some(a => a.startsWith('door') && a.includes(NEW.name) && a.includes('-> 302')), 'the Worker pointed at the package (302)');
    check(asked.some(a => a.startsWith('github') && a.includes(NEW.name) && a.endsWith('200')), 'the installer\'s helper followed it to the package');
  }
  const got = LIVE ? String(ready.line.newVersion) : NEW.version; // the version the app now has
  check(fs.existsSync(path.join(ROOT, `app-${got}`, EXE)), `the new version is unpacked next to the old one (app-${got})`);
  await waitFor('"Restart now" is pressed', l => l.event === 'restart', { from: ready.next });
  step = await waitFor(`the app restarts itself as ${got}`, l => l.event === 'start' && l.version === got, { from: ready.next });

  // 7. The updated app asks too, and finds nothing newer (so it doesn't update in circles).
  await waitFor('the new version asks and has the newest', l => l.event === 'newest' && l.version === got, { from: step.next, ms: LIVE ? 300000 : 120000 });
  await closeApp();
  // ... and opened the normal way (the way the Start-menu icon does it), it is still the new version.
  open(UPDATE_EXE, ['--processStart', EXE], { ...where, CELL_UPDATE_FIRST_MS: '3600000' });
  await waitFor(`opened the normal way, it is ${got}`, l => l.event === 'start' && l.version === got, { from: step.next });
  await sleep(3000); // give it a moment to load and save, as a real start does
  await closeApp();

  // 8. Your stars.
  const after = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  check(JSON.stringify(after.progress) === JSON.stringify(SEED.progress), `the stars survived the update (${JSON.stringify(after.progress)})`);
  check(after.game.xp === SEED.game.xp, `the XP survived (${after.game.xp})`);
  check(after.settings.dailyGoal === SEED.settings.dailyGoal && after.settings.reduceMotion === true, 'the settings survived');
  showNotes();
  say(`PASSED${LIVE ? ' (live)' : ''}: ${OLD.version} updated itself to ${got} and kept the progress.`);
}

let failed = false;
try { await main(); } catch (e) {
  failed = true;
  console.log(`::error::The update test${LIVE ? ' (live)' : ''} did not pass: ${e.message}`);
  showNotes();
  console.log(`\n--- ${ROOT} ---`);
  if (fs.existsSync(ROOT)) {
    for (const n of fs.readdirSync(ROOT)) console.log(n);
    for (const n of fs.readdirSync(ROOT).filter(n => /\.log$/i.test(n))) {
      console.log(`\n--- ${n} (the installer's own notes, last 60 lines) ---`);
      console.log(fs.readFileSync(path.join(ROOT, n), 'utf8').split('\n').slice(-60).join('\n'));
    }
  } else console.log('(the folder does not exist)');
} finally {
  await closeApp();
  github.close(); door.close();
}
process.exit(failed ? 1 : 0);
