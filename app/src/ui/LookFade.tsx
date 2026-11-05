import { useState } from 'react';
import { motion } from 'motion/react';
import { PALETTES, type Look } from '../theme/tokens';
import { lookFade } from '../theme/motion';

// Redesign R20 (idea I56): when the look changes, a cover painted like the OLD look's page background (the same glow
// as theme.css) lies over the whole window and fades out over 0.3 s, so Day comes up like dawn and Night like dusk
// instead of every colour snapping at once. It never catches clicks, and it isn't there when the app starts.
export function LookFade({ look, calm }: { look: Look; calm: boolean }) {
  const [prev, setPrev] = useState(look);
  const [fade, setFade] = useState<{ from: Look; k: number } | null>(null);
  if (prev !== look) { setPrev(look); setFade({ from: prev, k: (fade?.k ?? 0) + 1 }); } // React's "changed since last time" pattern
  if (!fade) return null;
  const p = PALETTES[fade.from];
  return <motion.div key={fade.k} data-testid="look-fade" data-from={fade.from} aria-hidden
    initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={lookFade(calm)} onAnimationComplete={() => setFade(null)}
    style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none', backgroundColor: p.bg,
      backgroundImage: `radial-gradient(ellipse 620px 560px at 50% 38%, ${p.glow1} 0%, ${p.glow2} 50%, ${p.glow3} 78%, ${p.bg} 100%)` }} />;
}
