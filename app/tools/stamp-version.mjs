// T76: gives each build its own version number, one that only ever goes up.
//
// Why: the app updates itself by asking "is there a version newer than mine?". Until T76 every build was called
// 0.1.0, so no build was ever "newer". Now the last number is the count of saved changes (commits) on the branch:
// 0.1.177, 0.1.178, ... The first two numbers stay whatever package.json says (change those by hand for a milestone).
//
// Why the commit count and not GitHub's build number: the build number starts again at 1 if the build file is ever
// renamed, and a number that went DOWN would make every installed app think it already has the newest version.
// The commit count on `main` only grows (changes are squash-merged, never rewritten).
//
// Used by the Windows build (.github/workflows/app-build.yml), inside the build only: the stamped package.json is
// never saved back to the project.
//   node tools/stamp-version.mjs              -> <major>.<minor>.<commit count>
//   node tools/stamp-version.mjs --set 0.0.1  -> exactly that (the "old" build for the update test)
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// Windows keeps a program's version as four numbers of at most 65,535 each, and the installer's package format wants
// plain numbers (no "-beta", no leading zeros). So: three plain numbers, each 0 to 65,535.
export const MAX_PART = 65535;
export function checkVersion(v) {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(String(v));
  if (!m) throw new Error(`"${v}" is not a plain version like 0.1.177 (three numbers, no extras).`);
  if (m.slice(1).some(p => Number(p) > MAX_PART)) throw new Error(`"${v}": each number must be ${MAX_PART} or less (a Windows limit).`);
  return v;
}
// base = the version in package.json; count = commits so far. Keeps the first two numbers, replaces the third.
export function nextVersion(base, count) {
  const [major, minor] = checkVersion(base).split('.');
  if (!Number.isInteger(count) || count < 1) throw new Error(`The commit count must be a whole number above 0, got "${count}".`);
  return checkVersion(`${major}.${minor}.${count}`);
}

function commitCount(cwd) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  // A "shallow" copy holds only the newest few commits, so the count would be far too small (and the version would go
  // backwards). The build asks for the whole history (fetch-depth: 0); refuse to guess if it didn't get it.
  if (git('rev-parse', '--is-shallow-repository') === 'true') {
    throw new Error('This copy of the project holds only part of its history, so the commit count would be wrong. The build must check out with fetch-depth: 0.');
  }
  return Number(git('rev-list', '--count', 'HEAD'));
}

// The version as it is saved in the project (not as an earlier stamp in this same build left it): the build stamps
// twice, first 0.0.1 for the update test's "old" build, then the real number, and the real one must start from the
// saved 0.1.0, not from 0.0.1.
function savedVersion(cwd, fallback) {
  try {
    const prefix = execFileSync('git', ['rev-parse', '--show-prefix'], { cwd, encoding: 'utf8' }).trim();
    return JSON.parse(execFileSync('git', ['show', `HEAD:${prefix}package.json`], { cwd, encoding: 'utf8' })).version;
  } catch { return fallback; }
}

function main(argv) {
  const appDir = join(dirname(fileURLToPath(import.meta.url)), '..');
  const file = join(appDir, 'package.json');
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const at = argv.indexOf('--set');
  const version = at >= 0 ? checkVersion(argv[at + 1]) : nextVersion(savedVersion(appDir, pkg.version), commitCount(appDir));
  pkg.version = version;
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`Version stamped: ${version}`);
}

// Only when run as a program (tests import the functions above without stamping anything). Windows paths can differ
// in upper and lower case, so compare them without it.
const same = (a, b) => a.toLowerCase() === b.toLowerCase();
if (process.argv[1] && same(resolve(process.argv[1]), fileURLToPath(import.meta.url))) main(process.argv.slice(2));
