// What screens import: `c` (colours as CSS variables), FONT, SIZE, RADIUS, and applyLook().
import { TOKEN_KEYS, PALETTES, cssVar, FONT, type Look, type TokenKey } from './tokens';
export { FONT, SIZE, RADIUS, SPACE, COLUMN, type Look } from './tokens';

// c.signal === 'var(--signal)', and so on. Use these in style={{ ... }} instead of colour codes.
export const c = Object.fromEntries(TOKEN_KEYS.map(k => [k, `var(${cssVar(k)})`])) as Record<TokenKey, string>;

// Puts one look's values into the page's CSS variables. Called by main.tsx whenever the look setting changes.
export function applyLook(look: Look, root: HTMLElement = document.documentElement) {
  const p = PALETTES[look];
  for (const k of TOKEN_KEYS) root.style.setProperty(cssVar(k), p[k]);
  root.style.setProperty('--font-body', FONT.body);
  root.style.setProperty('--font-mono', FONT.mono);
  root.style.colorScheme = look === 'night' ? 'dark' : 'light';
  root.dataset.look = look;
}

// Numbers people read like data (MHz, XP, counts): the "code" font with same-width digits.
export const mono = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' } as const;
