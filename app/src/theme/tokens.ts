// The ONE place where the app's colours live ("design tokens"), from docs/redesign/DESIGN.md section 2.
// Screens never type a colour code: they use `c.signal`, `c.surface` and so on (see ./index.ts),
// which point at CSS variables, so switching Night/Day only swaps the values here.
export type Look = 'night' | 'day';

export const TOKEN_KEYS = [
  'bg', 'glow1', 'glow2', 'glow3',
  'surface', 'surface2', 'border', 'borderStrong', 'track',
  'text', 'textMuted',
  'signal', 'onAir', 'onAirBg', 'miss', 'missBg', 'missText', 'streak', 'streakBg', 'review',
  'locked', 'lockedIcon', 'onBright', 'notice', 'noticeBg', 'beacon', 'beaconBrace',
  'chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6',
] as const;
export type TokenKey = (typeof TOKEN_KEYS)[number];
export type Palette = Record<TokenKey, string>;

// Night: the default look (picked by the owner on 2026-11-04, look A).
export const NIGHT: Palette = {
  bg: '#08101D', glow1: '#16304F', glow2: '#0E1C31', glow3: '#0A1424',
  surface: '#0F1D33', surface2: '#132A46', border: '#1F3A5C', borderStrong: '#2A4C75', track: '#1A2F4B',
  text: '#E6EEF9', textMuted: '#8EA3BF',
  signal: '#3FD8F2', onAir: '#4BE3A1', onAirBg: '#0F2E2A', miss: '#FF6B6B', missBg: '#2A1520', missText: '#FFC9C9',
  // streakBg (R20, idea I52): a warm dark for gold fills, like onAirBg and missBg (the heatmap's "okay" tiles).
  streak: '#FFBF47', streakBg: '#2C2413', review: '#9B8CFF',
  locked: '#2A4466', lockedIcon: '#4D6688', onBright: '#08101D', notice: '#FFE2A8', noticeBg: '#2B2410',
  // Beacon's lattice tower (R17, from the look A picture): the legs and bars, and the thin cross braces behind them.
  beacon: '#86B2E0', beaconBrace: '#3B5F88',
  // Six band colours for the spectrum ruler drawings (not right/wrong colours).
  chart1: '#3FD8F2', chart2: '#FFBF47', chart3: '#9B8CFF', chart4: '#4BE3A1', chart5: '#F28DD0', chart6: '#7FB2FF',
};

// Day: the light look (DESIGN.md section 2). Started in R01, finished in R20: every screen checked by eye and by the
// contrast click test (tests/lookcontrast.spec.ts), in both looks.
export const DAY: Palette = {
  bg: '#F3F7FC', glow1: '#FFFFFF', glow2: '#F7FAFE', glow3: '#F3F7FC',
  surface: '#FFFFFF', surface2: '#EAF1F9', border: '#D5E1EF', borderStrong: '#AFC3DA', track: '#DCE6F2',
  text: '#0E1C31', textMuted: '#4F6582',
  // R01: the DESIGN.md starting values for signal, on-air, streak, review and miss failed the contrast test, so they're a little darker.
  signal: '#066E89', onAir: '#0A7A4E', onAirBg: '#E3F6EE', miss: '#C0343B', missBg: '#FCEBEC', missText: '#8A1F25',
  streak: '#8C5C00', streakBg: '#FBF0D9', review: '#5646CF',
  locked: '#C9D6E6', lockedIcon: '#6C82A0', onBright: '#FFFFFF', notice: '#5C4300', noticeBg: '#FFF1CC',
  beacon: '#4A6E98', beaconBrace: '#A9BED8',
  chart1: '#066E89', chart2: '#8C5C00', chart3: '#5646CF', chart4: '#0A7A4E', chart5: '#B83C8C', chart6: '#2F6FD6',
};

export const PALETTES: Record<Look, Palette> = { night: NIGHT, day: DAY };

// camelCase token name -> CSS variable name, e.g. borderStrong -> --border-strong.
export const cssVar = (k: TokenKey) => `--${k.replace(/[A-Z0-9]/g, m => '-' + m.toLowerCase())}`;

// Letters (DESIGN.md section 3). Both fonts are bundled in the app (see ./fonts.ts), never loaded from the internet.
export const FONT = {
  body: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace",
};
export const SIZE = { label: 12, small: 14, body: 16, tile: 18, question: 23, title: 28, big: 40 };
export const RADIUS = { tile: 14, card: 16, sheet: 18, pill: 999 };
export const SPACE = [4, 8, 12, 16, 20, 24, 32, 40] as const;
export const COLUMN = 440; // the one content column, at most this wide

// The same values as CSS, one block per look (R21): written into index.html at build time (vite.config.ts), so the start
// screen and the page have their colours and letters from the window's very first picture, before any app code runs.
// The page's first script picks the block by setting <html data-look>; applyLook() later sets the same values itself.
export function lookCss(): string {
  const fonts = `--font-body:${FONT.body};--font-mono:${FONT.mono}`;
  return (Object.keys(PALETTES) as Look[]).map(look => `html[data-look=${look}]{${TOKEN_KEYS.map(k => `${cssVar(k)}:${PALETTES[look][k]}`).join(';')};${fonts};color-scheme:${look === 'night' ? 'dark' : 'light'}}`).join('\n');
}
