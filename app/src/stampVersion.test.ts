import { describe, it, expect } from 'vitest';
const { nextVersion, checkVersion, MAX_PART } = await import('../tools/stamp-version.mjs' as string);

// T76: every build gets its own version number that only goes up (tools/stamp-version.mjs), because the app updates
// itself by asking "is there a version newer than mine?".
describe('the build\'s version number', () => {
  it('keeps the first two numbers and puts the commit count last', () => {
    expect(nextVersion('0.1.0', 177)).toBe('0.1.177');
    expect(nextVersion('2.0.0', 1234)).toBe('2.0.1234');
    expect(nextVersion('0.1.999', 178)).toBe('0.1.178');
  });
  it('more commits always means a newer version, compared the way the installer compares (number by number)', () => {
    const parts = (v: string) => v.split('.').map(Number);
    const newer = (a: string, b: string) => { const x = parts(a), y = parts(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; };
    expect(newer(nextVersion('0.1.0', 178), nextVersion('0.1.0', 177))).toBe(true);
    expect(newer(nextVersion('0.1.0', 1000), nextVersion('0.1.0', 999))).toBe(true); // 1000 > 999 as numbers, not as words
    expect(newer(nextVersion('0.1.0', 177), '0.1.0')).toBe(true);                    // newer than every build before T76
    expect(newer(nextVersion('0.1.0', 177), '0.0.1')).toBe(true);                    // and than the update test's "old" build
  });
  it('accepts only three plain numbers, each within the Windows limit', () => {
    expect(checkVersion('0.0.1')).toBe('0.0.1');
    expect(MAX_PART).toBe(65535);
    expect(nextVersion('0.1.0', MAX_PART)).toBe(`0.1.${MAX_PART}`);
    for (const bad of ['0.1', '0.1.2.3', '0.1.2-beta', 'v0.1.2', '0.01.2', '', '0.1.x']) expect(() => checkVersion(bad), bad).toThrow();
    expect(() => nextVersion('0.1.0', MAX_PART + 1)).toThrow(/65535/);
  });
  it('refuses a commit count that is not a whole number above 0', () => {
    for (const bad of [0, -1, 1.5, NaN]) expect(() => nextVersion('0.1.0', bad), String(bad)).toThrow();
  });
});
