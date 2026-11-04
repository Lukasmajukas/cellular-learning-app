import { useReducedMotionConfig } from 'motion/react';
import { SPRING, PRESS } from './tones';

// True when the app's own "Reduce motion" switch is on (main.tsx sets MotionConfig from it). Read it in every block that
// moves: Motion only reads that setting when a piece first appears, so without this a switch flipped on the Settings
// screen would keep sliding (found in R03).
export const useCalm = () => !!useReducedMotionConfig();
// What a block uses instead of its spring when useCalm() is true: no movement, the change happens at once.
export const INSTANT = { duration: 0 } as const;

// The press-and-hover springs every clickable block shares: grow a little on hover, squish when pressed.
// Nothing at all when the block is switched off (disabled), or when "Reduce motion" is on.
export function usePress(on = true, amount: { hover: number; tap: number } = PRESS) {
  const calm = useCalm();
  if (!on || calm) return {};
  return { whileHover: { scale: amount.hover }, whileTap: { scale: amount.tap }, transition: SPRING.snappy };
}
