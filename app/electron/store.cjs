// The save file: one JSON file, written safely, with a daily backup (last 7 kept).
// Pure Node (no Electron), so tests can run it in a temp folder.
const fs = require('fs');
const path = require('path');

const KEEP_BACKUPS = 7;
const DEFAULTS = () => ({
  version: 1,
  progress: {},
  settings: { sounds: true, reduceMotion: false, showFps: false, dailyGoal: 1, theme: 'light' },
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
    reduceMotion: typeof s.reduceMotion === 'boolean' ? s.reduceMotion : d.settings.reduceMotion,
    showFps: typeof s.showFps === 'boolean' ? s.showFps : d.settings.showFps,
    dailyGoal: Number.isInteger(s.dailyGoal) && s.dailyGoal >= 1 && s.dailyGoal <= 10 ? s.dailyGoal : d.settings.dailyGoal,
    theme: s.theme === 'dark' ? 'dark' : 'light',
  };
  return { version: 1, progress, settings };
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
    let recovered = false;
    if (data === null && fs.existsSync(file)) {
      // The save file is damaged: keep it aside, then try the newest backup that reads fine.
      fs.renameSync(file, path.join(dir, `save.damaged-${Date.now()}.json`));
      for (const n of listBackups().reverse()) {
        data = readJson(path.join(backupDir, n));
        if (data !== null) { recovered = true; break; }
      }
    }
    const state = normalize(data);
    if (data !== null && recovered) writeAtomic(file, JSON.stringify(state, null, 2));
    // First start of the day: take the daily backup (only if there is something to back up).
    if (fs.existsSync(file) && !fs.existsSync(path.join(backupDir, `save-${today(clock())}.json`))) backup();
    return { state, recovered };
  }

  function save(state) {
    const clean = normalize(state);
    writeAtomic(file, JSON.stringify(clean, null, 2));
    if (!fs.existsSync(path.join(backupDir, `save-${today(clock())}.json`))) backup();
    return clean;
  }

  return { file, backupDir, load, save, backup, listBackups, normalize };
}

module.exports = { createStore, normalize, DEFAULTS, KEEP_BACKUPS };
