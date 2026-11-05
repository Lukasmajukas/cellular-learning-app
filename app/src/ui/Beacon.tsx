import { useEffect, useId, useState } from 'react';
import { motion, type Transition } from 'motion/react';
import { c } from '../theme';
import { BEACON, BREATHE, INSTANT, useCalm, useAwake, useEntrance } from '../theme/motion';

// Beacon, the app's mascot (redesign R17, DESIGN.md section 8): a thin lattice tower with a round glowing head that has a
// face, and soft radio rings around the head. Drawn here in code (SVG), so it looks the same on every computer.
// Six faces. Background loops: the rings breathe, and the eyes blink every 4-7 s (idle, thinking, oops).
// One-off moves when the face changes: happy sends one ring out; cheering hops three times and bursts two rings.
// `still` turns the loops off (for a screen that already has a loop of its own, or a row of examples).
// `breathe={false}` keeps the blink but holds the rings still (R18, idea I35: on the path, where the current lesson's
// rings already breathe, so the screen keeps to 2 loops: their breath and Beacon's blink).
// With Reduce motion nothing moves; the face just changes. Speeds: BEACON in src/theme/motion.tsx.
export const BEACON_FACES = ['idle', 'happy', 'oops', 'thinking', 'cheering', 'sleepy'] as const;
export type BeaconFace = (typeof BEACON_FACES)[number];
// Widths in px (DESIGN.md section 8): beside the current lesson, above a question, on the lesson-complete screen.
export const BEACON_SIZE = { path: 48, question: 58, complete: 112 } as const;

// The drawing's own grid: 100 wide, 136 tall. The head sits at (50, 40) with room above it for the rings, so nothing is
// cut off when they breathe or the head hops (look A's picture cut the top of the outer ring).
const W = 100, H = 136, HX = 50, HY = 40, HEAD = 15;
export const BEACON_HEIGHT = (width: number) => (width * H) / W;   // how tall Beacon is at a width
const RINGS = [{ r: 22, o: 0.4 }, { r: 30, o: 0.18 }];
// Half the side of the rings' own square layer (R23): the outer ring and its line (30 + 1.25), with room to breathe
// (x 1.07 = 33.4), so nothing is cut off. 50 - 34 = 16 and 40 - 34 = 6 keep the square inside the drawing.
const RING_BOX = 34;

const SAYS: Record<BeaconFace, string> = {
  idle: 'waiting', happy: 'happy', oops: 'a little worried', thinking: 'thinking', cheering: 'cheering', sleepy: 'sleepy',
};
const BLINKS: BeaconFace[] = ['idle', 'thinking', 'oops'];  // faces with open, round eyes

const line = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const randomGap = () => BEACON.blinkGap[0] + Math.random() * (BEACON.blinkGap[1] - BEACON.blinkGap[0]);

// `pulse`: the happy ring pulse's keyframes and timing (a lesson passes FEEDBACK's, so it starts with the right tile's glow, I44).
export function Beacon({ face = 'idle', size = BEACON_SIZE.question, still = false, breathe = true, pulse = { keys: BEACON.pulseKeys, transition: BEACON.pulse }, 'data-testid': testId = 'beacon' }:
  { face?: BeaconFace; size?: number; still?: boolean; breathe?: boolean; pulse?: { keys: { scale: number[]; opacity: number[] }; transition: Transition }; 'data-testid'?: string }) {
  const calm = useCalm(), awake = useAwake(), on = useEntrance();
  const moving = on && !calm && !still;                    // one-off moves (pulse, hop, burst)
  const looping = moving && awake;                         // background loops pause while the window is hidden
  const breathing = looping && breathe;
  const glow = face === 'happy' || face === 'cheering' ? c.onAir : c.signal;
  const dim = face === 'oops' || face === 'sleepy' ? BEACON.dim : 1;
  const ink = c.onBright;                                  // the face is drawn in the dark "on a bright colour" ink
  const grad = `beacon-glow-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // The blink: shut for a moment, open, then wait 4-7 s (a new random gap each time) and do it again.
  const blinks = looping && BLINKS.includes(face);
  const [shut, setShut] = useState(false);
  useEffect(() => {
    if (!blinks) return;
    let t: ReturnType<typeof setTimeout>;
    const next = () => { t = setTimeout(() => { setShut(true); t = setTimeout(() => { setShut(false); next(); }, BEACON.blinkShut.duration * 1000); }, randomGap() * 1000); };
    next();
    return () => { clearTimeout(t); setShut(false); };
  }, [blinks]);

  const pulsing = moving && face === 'happy', cheering = moving && face === 'cheering';
  // R23 (speed check): Beacon is three layers stacked in one box, in the same order the parts were always painted:
  // 1. at the back, a drawing with the tower and the head's glow;
  // 2. the rings, on a plain page layer of their own (not inside a drawing), so the graphics chip runs their endless
  //    breath by itself. Inside a drawing (SVG), Chromium can't do that, so the breath was redrawn by code every frame
  //    (60 style passes a second, measured in R23) for as long as Beacon was on screen;
  // 3. at the front, a drawing with the head: the pulse, the burst rings, the disc and the face.
  // The head's parts hop together when Beacon cheers (the rings' layer hops the same distance, in pixels).
  const u = size / W, hop = cheering ? BEACON.hopKeys : { y: 0 }, hopPx = cheering ? { y: BEACON.hopKeys.y.map(y => y * u) } : { y: 0 };
  const hopT = cheering ? BEACON.hop : INSTANT;
  const layer = { position: 'absolute', inset: 0, display: 'block', overflow: 'visible' } as const;
  return (
    <span role="img" aria-label={`Beacon, ${SAYS[face]}`} data-testid={testId} data-face={face} data-looping={looping} data-breathing={breathing}
      style={{ display: 'block', position: 'relative', width: size, height: (size * H) / W, overflow: 'hidden', flexShrink: 0 }}>
      <svg width={size} height={(size * H) / W} viewBox={`0 0 ${W} ${H}`} aria-hidden data-part="back" style={layer}>
        <defs>
          <radialGradient id={grad}>
            <stop offset="0.45" style={{ stopColor: glow, stopOpacity: 0.4 }} />
            <stop offset="1" style={{ stopColor: glow, stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        {/* The tower: thin braces behind, then the legs and bars, then the little mast the head sits on. It never moves. */}
        <g data-part="tower">
          <path d="M44.3 74 61.65 94M55.7 74 38.35 94M38.35 94 67.6 114M61.65 94 32.4 114" stroke={c.beaconBrace} strokeWidth="2.5" {...line} />
          <path d="M50 55 27 132M50 55 73 132M44.3 74h11.4M38.35 94h23.3M32.4 114h35.2" stroke={c.beacon} strokeWidth="5" {...line} />
          <path d={`M${HX} ${HY + 4}V58`} stroke={c.beacon} strokeWidth="4" {...line} />
        </g>
        {/* The glow: its own still layer (never an animated blur). */}
        <motion.g data-part="glow" initial={false} animate={hop} transition={hopT}>
          <circle cx={HX} cy={HY} r={HEAD + 9} fill={`url(#${grad})`} />
        </motion.g>
      </svg>
      {/* The rings breathe together, as one layer (one background loop), like the current lesson's rings. The layer is a
          square around the head, so it grows and shrinks about the head's centre. */}
      <motion.span aria-hidden data-part="ring-hop" initial={false} animate={hopPx} transition={hopT}
        style={{ position: 'absolute', left: (HX - RING_BOX) * u, top: (HY - RING_BOX) * u, width: 2 * RING_BOX * u, height: 2 * RING_BOX * u }}>
        <motion.span data-part="rings" initial={false} animate={breathing ? BREATHE.on : BREATHE.off} transition={breathing ? BREATHE.transition : INSTANT}
          style={{ display: 'block', width: '100%', height: '100%' }}>
          <svg width="100%" height="100%" viewBox={`${HX - RING_BOX} ${HY - RING_BOX} ${2 * RING_BOX} ${2 * RING_BOX}`} style={{ display: 'block', overflow: 'visible' }}>
            {/* Dimmed on an inner layer: the breath animates the outer layer's see-through-ness. */}
            <g data-part="ring-dim" opacity={dim}>
              {RINGS.map(({ r, o }) => <circle key={r} cx={HX} cy={HY} r={r} stroke={glow} strokeOpacity={o} strokeWidth="2.5" fill="none" />)}
            </g>
          </svg>
        </motion.span>
      </motion.span>
      <svg width={size} height={(size * H) / W} viewBox={`0 0 ${W} ${H}`} aria-hidden data-part="front" style={layer}>
        {/* The head and everything on it: this part hops when Beacon cheers. */}
        <motion.g data-part="head" initial={false} animate={hop} transition={hopT}>
          <motion.circle data-part="pulse" cx={HX} cy={HY} r={RINGS[0].r} stroke={glow} strokeWidth="2.5" fill="none" style={{ originX: 0.5, originY: 0.5 }}
            initial={false} animate={pulsing ? pulse.keys : { scale: 1, opacity: 0 }} transition={pulsing ? pulse.transition : INSTANT} />
          {[0, 1].map(k => (
            <motion.circle key={k} data-part="burst" cx={HX} cy={HY} r={HEAD} stroke={c.onAir} strokeWidth="2" fill="none" style={{ originX: 0.5, originY: 0.5 }}
              initial={false} animate={cheering ? BEACON.burstKeys : { scale: 1, opacity: 0 }}
              transition={cheering ? { ...BEACON.burst, delay: BEACON.burst.delay + k * BEACON.burstGap } : INSTANT} />
          ))}
          <circle data-part="face-disc" cx={HX} cy={HY} r={HEAD} fill={glow} />
          <Face face={face} ink={ink} shut={shut} />
        </motion.g>
      </svg>
    </span>
  );
}

// The face on the head (centre 50, 40), in the dark ink. The eyes are their own group, so they can blink.
function Face({ face, ink, shut }: { face: BeaconFace; ink: string; shut: boolean }) {
  const round = (dx = 0, dy = 0, r = 2.6) => <><circle cx={45 + dx} cy={38 + dy} r={r} fill={ink} /><circle cx={55 + dx} cy={38 + dy} r={r} fill={ink} /></>;
  const arcs = <path d="M42.5 39q2.5-3 5 0M52.5 39q2.5-3 5 0" stroke={ink} strokeWidth="2.4" {...line} />;   // ^ ^
  const closed = <path d="M42.5 38q2.5 2.5 5 0M52.5 38q2.5 2.5 5 0" stroke={ink} strokeWidth="2.2" {...line} />;
  const eyes = { idle: round(), happy: arcs, oops: round(0, 0.5), thinking: round(2, -1.5, 2.4), cheering: arcs, sleepy: closed }[face];
  const muted = c.textMuted;
  return (
    <g data-part="face">
      <motion.g key={face} data-part="eyes" style={{ originX: 0.5, originY: 0.5 }} initial={false}
        animate={{ scaleY: shut ? BEACON.blinkScale : 1 }} transition={shut ? BEACON.blinkShut : BEACON.blinkOpen}>{eyes}</motion.g>
      {face === 'idle' && <path d="M45.5 45q4.5 3.5 9 0" stroke={ink} strokeWidth="2.2" {...line} />}
      {face === 'happy' && <path d="M44 44.5q6 5 12 0" stroke={ink} strokeWidth="2.4" {...line} />}
      {face === 'cheering' && <path d="M43.5 44Q50 53 56.5 44Z" fill={ink} stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />}
      {face === 'oops' && <>
        <path d="M44.5 47.5q2.75-2.5 5.5 0t5.5 0" stroke={ink} strokeWidth="2.2" {...line} />
        <path data-part="drop" d="M67.5 20q4.2 6 0 9.5q-4.2-3.5 0-9.5z" fill={c.signal} />
      </>}
      {face === 'thinking' && <>
        <path d="M46.5 46.5h7" stroke={ink} strokeWidth="2.2" {...line} />
        <g data-part="dots" fill={muted}><circle cx="71" cy="21" r="1.8" /><circle cx="76.5" cy="14.5" r="2.4" /><circle cx="83" cy="8" r="3" /></g>
      </>}
      {face === 'sleepy' && <>
        <circle cx="50" cy="46.5" r="1.7" fill={ink} />
        <path data-part="z" d="M68 22h5l-5 5h5M76 9h7l-7 7h7" stroke={muted} strokeWidth="2" {...line} />
      </>}
    </g>
  );
}
