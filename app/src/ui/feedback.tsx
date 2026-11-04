// How answers react after Check (redesign R11, DESIGN.md section 7, moment 2), shared by the answer tiles, chips, the
// number box and the tap dot. The speeds live in the one speed file (FEEDBACK in src/theme/motion.tsx).
// - right: a small pop (3.5% bigger and back) while the glow layer flashes on and settles;
// - wrong: a gentle shake, 3 times side to side;
// - order chips glide between the pool and their slots (Fly).
// With Reduce motion nothing moves: the look (colour, tick or cross) just changes, and the glow fades in quickly.
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, animate } from 'motion/react';
import { c } from '../theme';
import { FEEDBACK, QUICK_FADE, useCalm } from '../theme/motion';
import type { TileState } from './tones';

// The props that make a block pop (right) or shake (wrong) when its state changes to that. initial={false}: a block
// that is already right or wrong when it first appears (the building blocks page) just shows it, without moving.
export function useFeedback(state: TileState | undefined) {
  const calm = useCalm();
  const animate = calm ? undefined
    : state === 'wrong' ? { ...FEEDBACK.shakeKeys, transition: FEEDBACK.shake }
    : state === 'right' ? { ...FEEDBACK.popKeys, transition: FEEDBACK.pop }
    : undefined;
  return { initial: false as const, animate, 'data-move': animate ? state : undefined };
}

// The green glow around a right answer: its own layer, a still soft shadow, and only its see-through-ness changes
// (DESIGN.md: glows never animate a blur or a shadow). Always there, see-through until `on`, so it can flash on.
export function Glow({ on, radius, color = c.onAir }: { on: boolean; radius: number | string; color?: string }) {
  const calm = useCalm();
  return (
    <motion.span aria-hidden data-glow={on || undefined} data-glow-layer initial={false}
      animate={!on ? { opacity: 0, transition: QUICK_FADE } : calm ? { opacity: FEEDBACK.glowKeys.opacity.at(-1), transition: QUICK_FADE } : { ...FEEDBACK.glowKeys, transition: FEEDBACK.glow }}
      style={{ position: 'absolute', inset: -1.5, borderRadius: radius, pointerEvents: 'none', opacity: 0,
        boxShadow: `0 0 16px color-mix(in srgb, ${color} 45%, transparent)` }} />
  );
}

// Moves its child smoothly when the child changes place (put them in order, R11 idea I40). Every Fly in one group
// shares a `places` map: name -> where it last was, measured from the group's box (so scrolling or the question
// gliding doesn't count as moving). A chip tapped into a slot is a new element there, but it has the same name, so it
// starts where the chip was and glides into the slot; the chips left behind glide to close the gap. Only a whole
// transform moves (translate), so the browser runs it on its graphics side. With Reduce motion it just jumps.
// The group is the nearest box marked data-fly-group around it. (Found in R11: a ref to the group isn't hooked up yet
// when the Flys inside it first measure themselves, so the very first tap didn't glide.)
export type Places = Map<string, { x: number; y: number }>;
export function Fly({ name, places, children, style }: { name: string; places: Places; children: ReactNode; style?: CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const calm = useCalm();
  const run = useRef<{ stop: () => void } | null>(null);
  useLayoutEffect(() => {
    const el = box.current, group = el?.parentElement?.closest('[data-fly-group]');
    if (!el || !group) return;
    // Where it sits without its glide (a glide still running is taken out), so a redraw mid-glide changes nothing.
    const g = group.getBoundingClientRect(), r = el.getBoundingClientRect(), t = getComputedStyle(el).transform;
    const m = t && t !== 'none' ? new DOMMatrix(t) : new DOMMatrix();
    const now = { x: r.left - m.e - g.left, y: r.top - m.f - g.top }, was = places.get(name);
    places.set(name, now);
    if (!was) return;
    if (Math.abs(was.x - now.x) < 1 && Math.abs(was.y - now.y) < 1) return;
    // From where it is seen right now (its old place, plus whatever is left of a glide still running) to its new place.
    const dx = was.x + m.e - now.x, dy = was.y + m.f - now.y;
    run.current?.stop(); el.style.transform = '';
    if (calm) return;
    el.dataset.flying = 'true';
    const a = animate(el, { transform: [`translate(${dx}px, ${dy}px)`, 'translate(0px, 0px)'] }, FEEDBACK.fly);
    run.current = a;
    a.then(() => { delete el.dataset.flying; });
  });
  return <div ref={box} data-fly={name} style={style}>{children}</div>;
}
