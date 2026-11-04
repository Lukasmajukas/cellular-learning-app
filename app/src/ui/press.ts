import { SPRING, PRESS, useCalm } from '../theme/motion';

// The press-and-hover springs every clickable block shares: grow a little on hover, squish when pressed.
// Nothing at all when the block is switched off (disabled), or when "Reduce motion" is on.
// The sizes and the spring come from the one speed file (src/theme/motion.tsx).
export function usePress(on = true, amount: { hover: number; tap: number } = PRESS) {
  const calm = useCalm();
  if (!on || calm) return {};
  return { whileHover: { scale: amount.hover }, whileTap: { scale: amount.tap }, transition: SPRING.snappy };
}
