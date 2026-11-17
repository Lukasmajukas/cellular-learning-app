// T76: reads the installer's list file (RELEASES). Shared by the update test (update-e2e.mjs) and the address check
// (check-feed.mjs). One line per package: a 40-letter check code, the package's file name, its size in bytes.
// The file may start with an invisible "byte order mark".
export function parseReleases(text) {
  return String(text).replace(/^﻿/, '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(line => {
    const m = /^([0-9a-fA-F]{40})\s+(\S+)\s+(\d+)$/.exec(line);
    if (!m) throw new Error(`Not a line of a release list: "${line.slice(0, 120)}"`);
    const name = m[2].split('/').pop();
    const v = /^(.+)-(\d+\.\d+\.\d+)-(full|delta)\.nupkg$/.exec(name);
    if (!v) throw new Error(`Not a package name: "${name}"`);
    return { sha1: m[1].toUpperCase(), name, size: Number(m[3]), id: v[1], version: v[2], kind: v[3] };
  });
}

// 1 if a is newer than b, -1 if older, 0 if the same. Number by number: 0.1.1000 is newer than 0.1.999.
export function compareVersions(a, b) {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  return 0;
}

// The newest whole package the list names.
export function newestFull(text) {
  const full = parseReleases(text).filter(e => e.kind === 'full');
  if (!full.length) throw new Error('The release list names no whole package.');
  return full.reduce((best, e) => (compareVersions(e.version, best.version) > 0 ? e : best));
}
