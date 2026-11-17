// T76: checks that the update addresses really hand out a build. Run by the Windows build right after it publishes
// (.github/workflows/app-build.yml), and by hand whenever you want to know:
//
//   node tools/check-feed.mjs                        every address in electron/update-feeds.json
//   node tools/check-feed.mjs --expect 0.1.177       ... and the newest version there must be at least that
//   node tools/check-feed.mjs https://some/address   only that address
//
// For each address it does what the installed app does: reads the list file (RELEASES), then asks for the package
// the list names (only its first byte: enough to see it's there and how big it is) and compares the size.
// The GitHub address must work (the build fails if not). Any other address, like the Cloudflare front door, only
// gives a warning: the app falls back to GitHub by itself, so a build must not go red over it.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { newestFull, compareVersions } from './releases.mjs';

const args = process.argv.slice(2);
const take = flag => { const i = args.indexOf(flag); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const expect = take('--expect');
const tries = Number(take('--tries') ?? 6);
const wait = Number(take('--wait') ?? 10) * 1000;
const here = dirname(fileURLToPath(import.meta.url));
const feeds = args.length ? args : JSON.parse(readFileSync(join(here, '..', 'electron', 'update-feeds.json'), 'utf8')).feeds;

async function checkOnce(base) {
  const list = await fetch(`${base}/RELEASES`, { redirect: 'follow', cache: 'no-store' });
  if (!list.ok) throw new Error(`the list file answered ${list.status}`);
  const newest = newestFull(await list.text());
  if (expect && compareVersions(newest.version, expect) < 0) throw new Error(`the newest version there is ${newest.version}, older than ${expect}`);
  const pack = await fetch(`${base}/${newest.name}`, { redirect: 'follow', headers: { range: 'bytes=0-0' } });
  if (!pack.ok) throw new Error(`the package ${newest.name} answered ${pack.status}`);
  // "bytes 0-0/158990336" when the server sends just the first byte; otherwise the whole length.
  const size = Number(pack.headers.get('content-range')?.split('/')[1] ?? pack.headers.get('content-length'));
  await pack.body?.cancel();
  if (size !== newest.size) throw new Error(`the package ${newest.name} is ${size} bytes, the list says ${newest.size}`);
  return newest;
}

let bad = false;
for (const base of feeds) {
  const must = new URL(base).hostname === 'github.com';
  let last;
  for (let n = 1; n <= tries; n++) {
    try { last = undefined; const e = await checkOnce(base); console.log(`OK  ${base}\n    newest: ${e.version}, ${e.name}, ${e.size} bytes`); break; }
    catch (e) { last = e; if (n < tries) await new Promise(r => setTimeout(r, wait)); }
  }
  if (last) {
    const line = `${base}: ${last.message} (asked ${tries} times)`;
    if (must) { bad = true; console.log(`::error::The update address does not work. ${line}`); }
    else console.log(`::warning::An update address does not work; the app uses the next one meanwhile. ${line}`);
  }
}
process.exit(bad ? 1 : 0);
