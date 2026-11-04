// Which token colours each building block uses (DESIGN.md sections 2 and 6), and the springs that make them squish.
// Kept as plain data so a unit test (src/ui.test.ts) can check every word-on-background pair for contrast, in Night and Day.
import type { TokenKey } from '../theme/tokens';

// bg = background, fg = words, border = outline, key = the little number box on an answer tile.
export type Tone = { bg: TokenKey; fg: TokenKey; border?: TokenKey; key?: TokenKey };

// Buttons: bright ones carry dark words (onBright); "quiet" is a dark button with signal-coloured words.
// "streak" (amber, R07) is kept for the streak repair, so it reads as part of the flame, not as the main action.
export const BUTTON = {
  signal: { bg: 'signal', fg: 'onBright' },
  onAir: { bg: 'onAir', fg: 'onBright' },
  miss: { bg: 'miss', fg: 'onBright' },
  quiet: { bg: 'surface', fg: 'signal', border: 'borderStrong' },
  streak: { bg: 'streak', fg: 'onBright' },   // only for saving your streak (the repair card, R07)
} as const satisfies Record<string, Tone>;
export type ButtonKind = keyof typeof BUTTON;

// Pills: small rounded labels like "6 due". `quiet` is the unselected look of a pill choice.
export const PILL = {
  signal: { bg: 'signal', fg: 'onBright' },
  onAir: { bg: 'onAir', fg: 'onBright' },
  streak: { bg: 'streak', fg: 'onBright' },
  review: { bg: 'review', fg: 'onBright' },
  quiet: { bg: 'surface2', fg: 'text', border: 'borderStrong' },
} as const satisfies Record<string, Tone>;
export type PillTone = keyof typeof PILL;

// Answer tiles: plain, picked (before checking), right, wrong, and dim (the other tiles after checking).
// Right and wrong always add an icon too, so colour is never the only clue (DESIGN.md section 2).
export const TILE = {
  idle: { bg: 'surface', fg: 'text', border: 'border', key: 'textMuted' },
  selected: { bg: 'surface2', fg: 'text', border: 'signal', key: 'signal' },
  right: { bg: 'onAirBg', fg: 'text', border: 'onAir', key: 'onAir' },
  wrong: { bg: 'missBg', fg: 'missText', border: 'miss', key: 'miss' },
  dim: { bg: 'surface', fg: 'textMuted', border: 'border', key: 'textMuted' },
} as const satisfies Record<string, Tone>;
export type TileState = keyof typeof TILE;

// The bottom sheet ("Right!" / "Not quite"): `border` is also the colour of its headline.
export const SHEET = {
  right: { bg: 'onAirBg', fg: 'text', border: 'onAir' },
  wrong: { bg: 'missBg', fg: 'missText', border: 'miss' },
} as const satisfies Record<string, Tone>;
export type SheetTone = keyof typeof SHEET;

// The springs and press sizes that used to live here moved to the one speed file, src/theme/motion.tsx (R04).
