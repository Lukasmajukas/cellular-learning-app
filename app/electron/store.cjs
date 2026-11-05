// The save file: one JSON file, written safely, with a daily backup (last 7 kept).
// Pure Node (no Electron), so tests can run it in a temp folder.
const fs = require('fs');
const path = require('path');

const KEEP_BACKUPS = 7;
const DEFAULTS = () => ({
  version: 1,
  progress: {},
  reviews: {},
  seenChanges: null,
  welcomed: false, // R21: has the first-start welcome been shown (and the daily goal picked)?
  game: { streak: 0, lastDay: '', xp: 0, xpToday: 0, xpDay: '', doneToday: 0, doneDay: '', freezes: 0, lost: 0, lostDay: '' },
  settings: { sounds: true, volume: 60, reduceMotion: false, showFps: false, dailyGoal: 1, look: 'night' },
});

// Fills in anything missing, so an older or damaged file never crashes the app.
function normalize(raw) {
  const d = DEFAULTS();
  if (!raw || typeof raw !== 'object') return d;
  const progress = {};
  if (raw.progress && typeof raw.progress === 'object') {
    for (const [k, v] of Object.entries(raw.progress)) if (Number.isInteger(v) && v >= 1 && v <= 3) progress[k] = v;
  }
  const s = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  const settings = {
    sounds: typeof s.sounds === 'boolean' ? s.sounds : d.settings.sounds,
    // R19: the sound volume, 0 to 100 (%), in steps of 10.
    volume: Number.isInteger(s.volume) && s.volume >= 0 && s.volume <= 100 && s.volume % 10 === 0 ? s.volume : d.settings.volume,
    reduceMotion: typeof s.reduceMotion === 'boolean' ? s.reduceMotion : d.settings.reduceMotion,
    showFps: typeof s.showFps === 'boolean' ? s.showFps : d.settings.showFps,
    dailyGoal: Number.isInteger(s.dailyGoal) && s.dailyGoal >= 1 && s.dailyGoal <= 10 ? s.dailyGoal : d.settings.dailyGoal,
    // Night is the default look (redesign R01, 2026-11-04). The old light/dark 'theme' setting is dropped on purpose,
    // so everyone starts on Night; 'day' is the light look (finished in R20).
    look: s.look === 'day' ? 'day' : 'night',
  };
  // Review schedule (one card per question ID) and streak/XP: keep only well-formed numbers.
  const num = v => typeof v === 'number' && Number.isFinite(v);
  const reviews = {};
  if (raw.reviews && typeof raw.reviews === 'object') {
    for (const [k, c] of Object.entries(raw.reviews)) {
      if (c && ['d', 's', 'due', 'last', 'reps', 'lapses'].every(f => num(c[f])) && c.s > 0) reviews[k] = { d: c.d, s: c.s, due: c.due, last: c.last, reps: c.reps, lapses: c.lapses };
    }
  }
  const g = raw.game && typeof raw.game === 'object' ? raw.game : {};
  const nn = v => (Number.isInteger(v) && v >= 0 ? v : 0);
  const day = v => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');
  const game = { streak: nn(g.streak), lastDay: day(g.lastDay), xp: nn(g.xp), xpToday: nn(g.xpToday), xpDay: day(g.xpDay),
    doneToday: nn(g.doneToday), doneDay: day(g.doneDay), freezes: Math.min(2, nn(g.freezes)), lost: nn(g.lost), lostDay: day(g.lostDay) };
  const seenChanges = Array.isArray(raw.seenChanges) ? raw.seenChanges.filter(x => typeof x === 'string') : null;
  // R21: a save from before the welcome existed counts as welcomed if anything was ever played (so the owner never sees it).
  const welcomed = typeof raw.welcomed === 'boolean' ? raw.welcomed
    : Object.keys(progress).length > 0 || Object.keys(reviews).length > 0 || game.xp > 0;
  return { version: 1, progress, settings, reviews, game, seenChanges, welcomed };
}

const today = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

function createStore(dir, clock = () => new Date()) {
  const file = path.join(dir, 'save.json');
  const backupDir = path.join(dir, 'backups');

  const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
  const listBackups = () => (fs.existsSync(backupDir) ? fs.readdirSync(backupDir) : [])
    .filter(n => /^save-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();

  // Write to a temp file, flush it to disk, then rename: a crash can never leave half a file.
  function writeAtomic(target, text) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const tmp = `${target}.tmp`;
    const fd = fs.openSync(tmp, 'w');
    try { fs.writeSync(fd, text); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    fs.renameSync(tmp, target);
  }

  function backup() {
    if (!fs.existsSync(file)) return null;
    const name = `save-${today(clock())}.json`;
    fs.mkdirSync(backupDir, { recursive: true });
    fs.copyFileSync(file, path.join(backupDir, name));
    const all = listBackups();
    for (const old of all.slice(0, Math.max(0, all.length - KEEP_BACKUPS))) fs.unlinkSync(path.join(backupDir, old));
    return name;
  }

  function load() {
    fs.mkdirSync(dir, { recursive: true });
    let data = readJson(file);
    let recovered = false, backupDay = null;
    if (data === null && fs.existsSync(file)) {
      // The save file is damaged: keep it aside, then try the newest backup that reads fine.
      fs.renameSync(file, path.join(dir, `save.damaged-${Date.now()}.json`));
      for (const n of listBackups().reverse()) {
        data = readJson(path.join(backupDir, n));
        if (data !== null) { recovered = true; backupDay = n.slice(5, 15); break; } // save-YYYY-MM-DD.json
      }
    }
    const state = normalize(data);
    if (data !== null && recovered) writeAtomic(file, JSON.stringify(state, null, 2));
    // First start of the day: take the daily backup (only if there is something to back up).
    if (fs.existsSync(file) && !fs.existsSync(path.join(backupDir, `save-${today(clock())}.json`))) backup();
    return { state, recovered, backupDay };
  }

  // R20: which look the save file asks for, read before the window opens (no backups, no writing), so the window and
  // the first paint already have the right background and a Day user never sees a dark flash at start-up.
  // R21: also Reduce motion, so the start screen's fade-out follows it before the save has loaded.
  const startup = () => { const { look, reduceMotion } = normalize(readJson(file)).settings; return { look, reduceMotion }; };
  const look = () => startup().look;

  function save(state) {
    const clean = normalize(state);
    writeAtomic(file, JSON.stringify(clean, null, 2));
    if (!fs.existsSync(path.join(backupDir, `save-${today(clock())}.json`))) backup();
    return clean;
  }

  return { file, backupDir, load, save, backup, listBackups, normalize, look, startup };
}

// R20: each look's far background ('bg' in src/theme/tokens.ts; a unit test keeps them the same), for the window itself.
const WINDOW_BG = { night: '#08101D', day: '#F3F7FC' };

module.exports = { createStore, normalize, DEFAULTS, KEEP_BACKUPS, WINDOW_BG };
