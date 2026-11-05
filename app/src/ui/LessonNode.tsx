import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { c } from '../theme';
import { Icon } from '../Icon';
import { SPRING, PRESS_ROUND, BREATHE, ON_AIR, INSTANT, popInQueue, useCalm, useAwake, useEntrance } from '../theme/motion';
import { usePress } from './press';
import { Beacon, BEACON_SIZE, BEACON_HEIGHT, type BeaconFace } from './Beacon';
import { TAB_BAR_HEIGHT } from './AppShell';
import type { Status } from '../path';

// One lesson circle on the path map (redesign R05, DESIGN.md section 6 "lesson node"), in three looks:
// - done: a dark green disc with a green tower and a small check badge (on air);
// - current: the biggest, a bright signal-blue disc with two rings and a soft glow around it (on air next);
// - locked: a small dark disc with a dashed outline and a lock.
// Every look has its own icon too, so colour is never the only clue.
// R06 makes it move: it pops in the first time it scrolls into view, the current one's rings breathe, and it can play a
// "moment" after you finish a lesson (see ON_AIR in the speed file):
// - onAir: the lesson you just finished turns from blue to green with a ring burst;
// - unlock: the next lesson's lock flies off and its circle pops up;
// - wave: one ring from a circle of a unit you just finished (one after another, up the unit).
// R18: the current lesson has Beacon standing beside it ("you are here"), on the side away from its name, where the
// dotted line never runs. It sits inside the circle's pop-in, so it pops in (and arrives after an unlock) with its circle,
// then gives one happy ring pulse. It blinks, but its rings stay still: the lesson's own rings already breathe (idea I35).
export const NODE_SIZE: Record<Status, number> = { done: 64, current: 80, locked: 56 };
export const NODE_BOX = 128; // the square every node is centred in (the current one's outer ring fits inside)
const RINGS = [100, 122];    // the current lesson's two rings (diameters)
export const NODE_RING = RINGS[0]; // its name starts beside the inner ring (the outer one is faint enough to pass behind words)
export type Moment = { kind: 'onAir' | 'unlock' } | { kind: 'wave'; delay: number };

const LOOK = {
  done: { background: c.onAirBg, color: c.onAir, border: `2px solid ${c.onAir}` },
  current: { background: c.signal, color: c.onBright, border: `2px solid ${c.signal}` },
  locked: { background: c.bg, color: c.lockedIcon, border: `2px dashed ${c.locked}` },
};
const ICON_SIZE: Record<Status, number> = { done: 30, current: 40, locked: 24 };
const centred = (d: number): CSSProperties => ({ position: 'absolute', left: '50%', top: '50%', width: d, height: d, margin: -d / 2,
  borderRadius: '50%', boxSizing: 'border-box', pointerEvents: 'none' });
const disc = (s: Status): CSSProperties => ({ ...centred(NODE_SIZE[s]), ...LOOK[s], display: 'grid', placeItems: 'center' });

// Lessons that have already popped in since the app started: they don't pop in again when you come back to the path
// (idea I17). Forgotten when the app closes.
const seen = new Set<string>();

export function LessonNode({ id, title, status, moment, beacon, onClick }:
  { id: string; title: string; status: Status; moment?: Moment; beacon?: 'left' | 'right'; onClick: () => void }) {
  const open = status !== 'locked', size = NODE_SIZE[status];
  const calm = useCalm(), awake = useAwake(), on = useEntrance();
  const press = usePress(open, PRESS_ROUND);
  const show = calm ? undefined : moment;
  const box = useRef<HTMLSpanElement>(null);
  // The pop-in: 'still' = already seen (or Reduce motion): just there. 'waiting' = not scrolled into view yet.
  // A number = it came into view: pop in after that many seconds (several at once go one after another).
  const [pop, setPop] = useState<'still' | 'waiting' | number>(() => (calm || show || seen.has(id) ? 'still' : 'waiting'));
  useEffect(() => {
    if (show) seen.add(id);
    if (pop !== 'waiting') return;
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') { seen.add(id); setPop('still'); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect(); seen.add(id); setPop(popInQueue());
    }, { rootMargin: `0px 0px -${TAB_BAR_HEIGHT}px 0px`, threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [pop]); // eslint-disable-line react-hooks/exhaustive-deps
  const hidden = { scale: 0.6, opacity: 0 }, shown = { scale: 1, opacity: 1 };
  const wrapper = show?.kind === 'unlock'
    ? { initial: { scale: 0, opacity: 0 }, animate: on ? shown : { scale: 0, opacity: 0 }, transition: ON_AIR.arrive }
    : pop === 'still' ? { initial: false as const, animate: shown }
    : { initial: hidden, animate: pop === 'waiting' ? hidden : shown, transition: { ...SPRING.bouncy, delay: pop === 'waiting' ? 0 : pop } };
  const breathing = status === 'current' && !calm && awake && on;
  return (
    <span ref={box} style={{ position: 'relative', width: NODE_BOX, height: NODE_BOX, display: 'grid', placeItems: 'center' }}>
      {show?.kind === 'onAir' && <OnAirBurst />}
      {show?.kind === 'wave' && <motion.span aria-hidden data-testid="wave-ring" style={{ ...centred(NODE_SIZE.done), border: `2px solid ${c.onAir}` }}
        initial={{ scale: 1, opacity: 0.8 }} animate={on ? { scale: 1.9, opacity: 0 } : { scale: 1, opacity: 0.8 }} transition={{ ...ON_AIR.wave, delay: show.delay }} />}
      {show?.kind === 'unlock' && <LockOff />}
      {/* It pops in on this wrapper, so the button's press keeps its own quick spring (and no pop-in delay). */}
      <motion.span data-testid={`pop-${id}`} data-pop={typeof pop === 'number' ? 'in' : pop} {...wrapper}
        style={{ position: 'relative', width: NODE_BOX, height: NODE_BOX, display: 'grid', placeItems: 'center' }}>
        {status === 'current' && (
          // The glow and the two rings breathe together, as one layer (one background loop). The glow is its own layer:
          // only its see-through-ness and size change, never a blur.
          <motion.span aria-hidden data-testid="lesson-breath" data-breathing={breathing} style={{ ...centred(NODE_BOX) }}
            initial={false} animate={breathing ? BREATHE.on : BREATHE.off} transition={breathing ? BREATHE.transition : INSTANT}>
            <span aria-hidden data-testid="lesson-glow" style={{ ...centred(NODE_BOX),
              background: `radial-gradient(circle, color-mix(in srgb, ${c.signal} 28%, transparent) 30%, transparent 70%)` }} />
            {RINGS.map((d, k) => <span key={d} aria-hidden data-testid="lesson-ring" style={{ ...centred(d), border: `1.5px solid ${c.signal}`, opacity: k ? 0.18 : 0.38 }} />)}
          </motion.span>
        )}
        {beacon && status === 'current' && <PathBeacon side={beacon} arriving={show?.kind === 'unlock'} />}
        <motion.button data-testid={`lesson-${id}`} data-status={status} disabled={!open} onClick={onClick}
          aria-label={`${title}, ${status}${beacon && status === 'current' ? ', you are here' : ''}`} {...press}
          style={{ position: 'relative', width: size, height: size, borderRadius: '50%', padding: 0, display: 'grid', placeItems: 'center', boxSizing: 'border-box',
            ...LOOK[status], cursor: open ? 'pointer' : 'not-allowed' }}>
          <Icon name={status === 'locked' ? 'lock' : 'tower'} size={ICON_SIZE[status]} />
          {status === 'done' && <motion.span data-testid="lesson-check" style={{ position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
            display: 'grid', placeItems: 'center', background: c.onAir, color: c.onBright, border: `2px solid ${c.bg}` }}
            initial={false} animate={{ scale: show?.kind === 'onAir' && !on ? 0 : 1 }} transition={ON_AIR.check}><Icon name="check" size={14} /></motion.span>}
        </motion.button>
      </motion.span>
      {/* Coming on air: the old blue "current" disc sits on top of the new green one, then fades and shrinks away. */}
      {show?.kind === 'onAir' && <motion.span aria-hidden data-testid="on-air-ghost" style={disc('current')}
        initial={{ opacity: 1, scale: 1 }} animate={on ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }} transition={ON_AIR.turn}><Icon name="tower" size={ICON_SIZE.current} /></motion.span>}
    </span>
  );
}

// Two green rings spread out from the circle that just came on air, and fade.
function OnAirBurst() {
  const on = useEntrance();
  return <>{[0, 1].map(k => <motion.span key={k} aria-hidden data-testid="on-air-ring" style={{ ...centred(NODE_SIZE.done), border: `2px solid ${c.onAir}` }}
    initial={{ scale: 1, opacity: 0.9 }} animate={on ? { scale: 2, opacity: 0 } : { scale: 1, opacity: 0.9 }} transition={{ ...ON_AIR.burst, delay: ON_AIR.burst.delay + k * ON_AIR.burstGap }} />)}</>;
}

// The next lesson was locked a moment ago: its old dashed disc stays for a beat, then the lock flies up and off and the
// disc fades, while the new current circle pops up in its place.
function LockOff() {
  const on = useEntrance(), leave = ON_AIR.lockOff;
  return <>
    <motion.span aria-hidden data-testid="lock-disc" style={{ ...centred(NODE_SIZE.locked), border: LOOK.locked.border, background: LOOK.locked.background }}
      initial={{ opacity: 1 }} animate={{ opacity: on ? 0 : 1 }} transition={leave} />
    <motion.span aria-hidden data-testid="lock-off" style={{ position: 'absolute', left: '50%', top: '50%', width: 24, height: 24, margin: -12, color: c.lockedIcon, pointerEvents: 'none', zIndex: 1 }}
      initial={{ y: 0, rotate: 0, opacity: 1 }} animate={on ? { y: -36, rotate: -25, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }} transition={leave}><Icon name="lock" size={24} /></motion.span>
  </>;
}

// Beacon beside the current lesson (R18), standing on the same ground as the circle (its feet level with the circle's
// bottom), just outside the inner ring. After an unlock it arrives with the circle and is happy for a moment.
function PathBeacon({ side, arriving }: { side: 'left' | 'right'; arriving: boolean }) {
  const [face, setFace] = useState<BeaconFace>('idle');
  useEffect(() => {
    if (!arriving) return;
    const a = setTimeout(() => setFace('happy'), ON_AIR.beaconHappy * 1000);
    const b = setTimeout(() => setFace('idle'), ON_AIR.beaconRest * 1000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [arriving]);
  const w = BEACON_SIZE.path, off = NODE_RING / 2 + 2;
  return (
    <span aria-hidden data-testid="path-beacon-spot" data-side={side} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 1,
      top: NODE_BOX / 2 + NODE_SIZE.current / 2 - BEACON_HEIGHT(w), left: side === 'left' ? NODE_BOX / 2 - off - w : NODE_BOX / 2 + off }}>
      <Beacon face={face} size={w} breathe={false} data-testid="path-beacon" />
    </span>
  );
}
