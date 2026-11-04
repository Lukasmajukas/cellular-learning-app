import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { allLessons, lessonStatus, doneCount, sideOf, focusLessonId, unitStatus, type Unit, type Progress, type Status } from './path';
import { c, mono, COLUMN } from './theme';
import { Icon } from './Icon';
import { PRESS_BIG, popInDelay } from './theme/motion';
import { usePress, Pill, UnitBanner, LessonNode, NODE_SIZE, NODE_BOX, NODE_RING } from './ui';
import { TAB_BAR_HEIGHT } from './ui/AppShell';

// The path map (redesign R05, look A "Night Signal"): unit banners, and lesson circles zig-zagging down the screen with
// their names beside them, joined by a dotted signal line. Towers "come on air" (light up) as lessons get finished.
// It opens scrolled to your current lesson. (R06 adds the movement: pop-ins on scroll, breathing rings, the line drawing itself.)
const ROW = 112;                          // the height of one lesson's row
const X = { left: 0.27, right: 0.71 };    // where the circles sit, as a share of the column's width
const GAP = 14;                           // between a circle and its name (the current one: between its outer ring and its name)

const nameOffset = (s: Status) => (s === 'current' ? NODE_RING : NODE_SIZE[s]) / 2 + GAP;

export function PathMap({ units, progress, onStart, due = 0, onReview }: { units: Unit[]; progress: Progress; onStart: (lessonId: string) => void; due?: number; onReview?: () => void }) {
  const total = allLessons(units).length;
  const root = useRef<HTMLDivElement>(null);
  const focus = focusLessonId(units, progress);
  // Opening the path: jump (no slide) to your current lesson. useLayoutEffect = before the first paint, so you never see
  // the top of the path first. The lesson goes a bit above the middle of the window, or lower when that lets its unit's
  // banner show too (so you know where you are).
  useLayoutEffect(() => {
    const row = root.current?.querySelector(`[data-testid="row-${focus}"]`);
    if (!row) return;
    const top = document.querySelector('[data-testid="top-bar"]')?.getBoundingClientRect().bottom ?? 0;
    const bottom = window.innerHeight - (document.querySelector('[data-testid="tab-bar"]') ? TAB_BAR_HEIGHT : 0);
    const r = row.getBoundingClientRect(), y0 = window.scrollY;
    let y = y0 + r.top + r.height / 2 - (top + (bottom - top) * 0.45);
    const banner = row.closest('section')?.querySelector('[data-testid^="banner-"]')?.getBoundingClientRect();
    if (banner) {
      const withBanner = y0 + banner.top - top - 16;
      if (withBanner < y && y0 + r.bottom - withBanner <= bottom - top) y = withBanner;
    }
    window.scrollTo(0, Math.max(0, y));
  }, []); // only when the path opens, never while you scroll around it
  return (
    <div ref={root} data-testid="path-map" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '20px 20px 8px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, margin: '0 0 16px' }}>
        <h1 style={{ margin: 0 }}>Your path</h1>
        <span data-testid="path-count" style={{ color: c.textMuted, ...mono, fontSize: 14, whiteSpace: 'nowrap' }}>{doneCount(units, progress)} of {total} lessons done</span>
      </div>
      {onReview && <ReviewCard due={due} onClick={onReview} />}
      {units.map((u, n) => (
        <section key={u.id} data-testid={`unit-${u.id}`} style={{ marginTop: 32 }}>
          <UnitBanner testId={`banner-${u.id}`} number={n + 1} title={u.title} status={unitStatus(units, progress, u.id)}
            done={u.lessons.filter(l => progress[l.id] !== undefined).length} total={u.lessons.length} />
          <Lessons unit={u} units={units} progress={progress} onStart={onStart} />
        </section>
      ))}
    </div>
  );
}

// One unit's lessons: rows of the same height, the circles left and right in turn, and the dotted line behind them.
function Lessons({ unit, units, progress, onStart }: { unit: Unit; units: Unit[]; progress: Progress; onStart: (id: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(COLUMN - 40);
  // The line is drawn in pixels, so it needs the column's real width (narrow windows make it narrower).
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setW(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const status = unit.lessons.map(l => lessonStatus(units, progress, l.id));
  const at = (i: number) => ({ x: w * X[sideOf(i)], y: i * ROW + ROW / 2 });
  return (
    <div ref={box} style={{ position: 'relative', height: unit.lessons.length * ROW, marginTop: 4 }}>
      <svg aria-hidden data-testid={`line-${unit.id}`} width={w} height={unit.lessons.length * ROW} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {unit.lessons.slice(1).map((l, k) => {
          const a = at(k), b = at(k + 1), mid = (a.y + b.y) / 2, reached = status[k + 1] !== 'locked';
          // Leaves one circle straight down, swings across in the middle, and drops into the next one (so it stays clear of the names).
          return <path key={l.id} data-testid={`line-to-${l.id}`} data-reached={reached} d={`M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`}
            fill="none" stroke={reached ? c.signal : c.locked} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="0 10" opacity={reached ? 0.6 : 1} />;
        })}
      </svg>
      {unit.lessons.map((l, i) => {
        const s = status[i], side = sideOf(i), x = X[side];
        return (
          <div key={l.id} data-testid={`row-${l.id}`} data-side={side} style={{ position: 'absolute', left: 0, right: 0, top: i * ROW, height: ROW }}>
            <div style={{ position: 'absolute', left: `calc(${x * 100}% - ${NODE_BOX / 2}px)`, top: (ROW - NODE_BOX) / 2 }}>
              <LessonNode id={l.id} title={l.title} status={s} delay={popInDelay(i, unit.lessons.length)} onClick={() => onStart(l.id)} />
            </div>
            <LessonName id={l.id} title={l.title} status={s} stars={progress[l.id] ?? 0}
              style={side === 'left' ? { left: `calc(${x * 100}% + ${nameOffset(s)}px)`, right: 0, textAlign: 'left', alignItems: 'flex-start' }
                : { right: `calc(${(1 - x) * 100}% + ${nameOffset(s)}px)`, left: 0, textAlign: 'right', alignItems: 'flex-end' }} />
          </div>
        );
      })}
    </div>
  );
}

// A lesson's name beside its circle: brighter and bold for the current one (with "Up next" above it), dim when locked,
// and the stars you earned under a finished one (filled stars earned, outlines for the rest).
function LessonName({ id, title, status, stars, style }: { id: string; title: string; status: Status; stars: number; style: CSSProperties }) {
  return (
    <div data-testid={`name-${id}`} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 3, ...style }}>
      {status === 'current' && <span style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.signal }}>Up next</span>}
      <span style={{ fontSize: 16, lineHeight: 1.3, fontWeight: status === 'current' ? 700 : 500, color: status === 'locked' ? c.textMuted : c.text }}>{title}</span>
      {stars > 0 && <span data-testid={`stars-${id}`} data-count={stars} aria-label={`${stars} of 3 stars`} style={{ display: 'flex', gap: 2 }}>
        {[0, 1, 2].map(k => <Icon key={k} name="star" size={14} solid={k < stars} style={{ color: k < stars ? c.streak : c.textMuted }} />)}</span>}
    </div>
  );
}

// The daily review, as a card at the top of the path (look A): "Daily review" with a purple "6 due" pill, or "nothing due today".
function ReviewCard({ due, onClick }: { due: number; onClick: () => void }) {
  const press = usePress(due > 0, PRESS_BIG);
  return (
    <motion.button data-testid="daily-review" disabled={due === 0} onClick={onClick} {...press}
      style={{ width: '100%', minHeight: 56, padding: '12px 16px', borderRadius: 16, cursor: due ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 12,
        background: due ? c.surface2 : c.surface, border: `1px solid ${due ? c.review : c.border}`, color: due ? c.text : c.textMuted, textAlign: 'left' }}>
      <Icon name="repeat" size={22} style={{ color: due ? c.review : c.textMuted }} />
      <span style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>Daily review</span>
      {due ? <Pill tone="review" style={mono}>{due} due</Pill> : <span style={{ fontSize: 14 }}>nothing due today</span>}
    </motion.button>
  );
}
