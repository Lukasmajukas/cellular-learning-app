import { motion } from 'motion/react';
// The antenna pivots at the tower tip: originX/originY are fractions of the antenna's own box (middle, bottom).
// A little cell tower that waves. Drawn in code (SVG), so it can be changed any time.
export function Mascot({ happy = true }: { happy?: boolean }) {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" overflow="visible" aria-label="Tower mascot" data-testid="mascot">
      <polygon points="60,20 30,130 90,130" fill="#4a90d9" stroke="#2d5f99" strokeWidth="3" />
      <rect x="45" y="70" width="30" height="8" fill="#2d5f99" /><rect x="40" y="95" width="40" height="8" fill="#2d5f99" />
      <circle cx="50" cy="52" r="5" fill="#fff" /><circle cx="70" cy="52" r="5" fill="#fff" />
      <circle cx="50" cy="52" r="2" fill="#222" /><circle cx="70" cy="52" r="2" fill="#222" />
      <path d={happy ? 'M50 64 Q60 74 70 64' : 'M50 70 Q60 62 70 70'} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <motion.g style={{ originX: 0.5, originY: 1 }} data-testid="antenna" animate={{ rotate: [0, -12, 12, -12, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
        <line x1="60" y1="20" x2="60" y2="6" stroke="#2d5f99" strokeWidth="3" />
        <circle cx="60" cy="6" r="5" fill="#ffb703" />
      </motion.g>
    </svg>
  );
}
