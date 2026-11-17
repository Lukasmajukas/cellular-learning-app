// T76: the "front door" for the app's updates, a Cloudflare Worker (a tiny program that Cloudflare runs for free).
//
// In simple words: the installed app asks this address "what is the newest version?". The Worker fetches the small
// list file (RELEASES) from the project's GitHub Releases page and hands it over. When the app then asks for the big
// package the list names, the Worker answers "it's over there" and points at GitHub, so the 160 MB download never
// runs through the Worker. It stores nothing, keeps no notes about who asked, and holds no passwords or keys.
//
// Why have it at all, when the app could ask GitHub itself (and does, as its spare)? One address that stays the
// same: if the files ever move, only this file changes, and no installed app has to be reinstalled.
//
// What it answers:
//   /                           one line, to see that it's alive
//   /win/RELEASES               the list file, straight from GitHub (never from a cache)
//   /win/CellLearning-1.2.3-full.nupkg   "go to GitHub for this" (only names shaped exactly like that)
//   anything else               "not found"
//
// Tested by app/src/updateServer.test.ts, and by the real install-and-update test (app/tools/update-e2e.mjs),
// which runs this same code on the build computer in front of a pretend GitHub.

export const RELEASE_FILES = 'https://github.com/Lukasmajukas/cellular-learning-app/releases/download/latest-build/';
// The package's name, exactly: our app's name, three plain numbers, "-full.nupkg". Nothing else is passed on.
export const PACKAGE = /^CellLearning-\d{1,5}\.\d{1,5}\.\d{1,5}-full\.nupkg$/;
// One line of the list file: a 40-letter check code, the package's name, its size in bytes.
const LIST_LINE = /^[0-9a-fA-F]{40}\s+CellLearning-\d{1,5}\.\d{1,5}\.\d{1,5}-full\.nupkg\s+\d+$/;

const words = (text, status = 200, more = {}) =>
  new Response(`${text}\n`, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', ...more } });

// Does this text look like our list file? (GitHub answering with a web page instead must not be passed on as a list.)
// The file may start with an invisible "byte order mark", which the installer's helper puts there.
export function looksLikeList(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim() !== '');
  return lines.length > 0 && lines.every(l => LIST_LINE.test(l.trim()));
}

// `files` = where the release files live (tests and the update test point it at a pretend GitHub);
// `fetchFn` = how to fetch (tests pass a pretend one).
export async function handle(request, { files = RELEASE_FILES, fetchFn = fetch } = {}) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return words('Only reading works here.', 405, { allow: 'GET, HEAD' });
  const { pathname } = new URL(request.url);
  if (pathname === '/') return words('Cell Learning update server: OK');
  const name = /^\/win\/([^/]+)$/.exec(pathname)?.[1];

  if (name === 'RELEASES') {
    let answer;
    try {
      answer = await fetchFn(`${files}RELEASES`, { redirect: 'follow', headers: { 'user-agent': 'cell-learning-updates' } });
    } catch {
      return words('Could not reach the release files just now.', 502);
    }
    if (answer.status === 404) return words('No release list there right now.', 404);
    if (!answer.ok) return words('The release files did not answer properly just now.', 502);
    const bytes = await answer.arrayBuffer();
    if (!looksLikeList(new TextDecoder().decode(bytes))) return words('What came back is not a release list.', 502);
    return new Response(request.method === 'HEAD' ? null : bytes, { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  }

  if (name && PACKAGE.test(name)) {
    return new Response(null, { status: 302, headers: { location: `${files}${name}`, 'cache-control': 'no-store' } });
  }
  return words('Not found.', 404);
}

export default { fetch: request => handle(request) };
