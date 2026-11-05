import { useLayoutEffect, useRef, useState } from 'react';
import { animate, motion } from 'motion/react';
import type { BandLesson, Cell, Group, Level } from './heatmap';
import { heatLabel, heatGlow, heatBars, heatCounts, HEAT_TONE, LEVELS, LEVEL_WORD, HEAT_FILL } from './heatmap';
import type { Status } from './path';
import { c, COLUMN, RADIUS, mono } from './theme';
import { Icon } from './Icon';
import { BottomSheet, Beacon, BEACON_SIZE, Button, Card, SectionLabel, usePress } from './ui';
import { HEAT, popInDelay, useCalm, PRESS_BIG } from './theme/motion';

// The Heatmap tab, "band memory" (redesign R14). Every band the lessons teach is a tile on a dark panel, grouped low /
// mid / mmWave. A tile glows brighter the better you remember its band (green = strong, gold = okay, red = fading), and
// its signal bars say the same without colour; a band you haven't been asked about yet is a dim dashed outline.
// Tiles "fill in" one after another the first time you look (and again for a band whose level changed). Tap a tile to
// see the lessons that ask about it, and play one from there. Speeds: HEAT in src/theme/motion.tsx.
const GROUPS: { id: Group; label: string }[] = [
  { id: 'low', label: 'Low band · below 1 GHz' },
  { id: 'mid', label: 'Mid band · 1 to 24 GHz' },
  { id: 'high', label: 'mmWave · 24 GHz and up' },
];
const tone = (l: Level) => c[HEAT_TONE[l]];
const tint = (l: Level) => (l === 'new' ? 'transparent' : c[HEAT_FILL[l]]);

// What each band's level was the last time you looked (since the app started). Only tiles that changed fill in again.
const seen = new Map<string, Level>();

export type LessonLink = BandLesson & { status: Status | 'missing' };

// onPath (R21): the empty look's "Go to your first lesson" button.
export function HeatMap({ cells, lessonsOf, onStart, onPath }:
  { cells: Cell[]; lessonsOf: (band: string) => LessonLink[]; onStart: (lessonId: string) => void; onPath?: () => void }) {
  const calm = useCalm();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const opened = useRef<string | null>(null); // the tile to give the keyboard back to when the sheet closes
  // Which tiles fill in: worked out once, when the tab appears (a band's level only changes after a lesson, which leaves this screen).
  const [fresh] = useState(() => new Set(calm ? [] : cells.filter(x => x.score !== null && seen.get(x.id) !== heatLabel(x.score)).map(x => x.id)));
  useLayoutEffect(() => {
    const el = root.current;
    const tiles = el ? [...el.querySelectorAll<HTMLElement>('[data-fill-new]')] : [];
    const runs = tiles.flatMap((t, k) => {
      const fill = t.querySelector<HTMLElement>('[data-part=fill]'), glow = t.querySelector<HTMLElement>('[data-part=glow]');
      const wait = HEAT.start + popInDelay(k, tiles.length);
      return [
        fill && animate(fill, HEAT.fillKeys, { ...HEAT.fill, delay: wait }),
        glow && animate(glow, { opacity: [0, Number(glow.dataset.glow)] }, { ...HEAT.glow, delay: wait + HEAT.glow.delay }),
      ].filter((a): a is NonNullable<typeof a> => !!a);
    });
    for (const x of cells) seen.set(x.id, heatLabel(x.score));
    return () => runs.forEach(a => a.complete());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, when the tab appears
  const counts = heatCounts(cells);
  const band = cells.find(x => x.id === open);
  const close = () => {
    setOpen(null);
    const id = opened.current;
    requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`[data-testid="heat-${id}"]`)?.focus({ preventScroll: true }));
  };
  return (
    <div ref={root} data-testid="heatmap" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 32px', boxSizing: 'border-box' }}>
      <SectionLabel tone="signal" data-testid="tab-label" style={{ margin: 0 }}>Band memory</SectionLabel>
      <h1 style={{ margin: '2px 0 4px', fontSize: 28, lineHeight: 1.25 }}>Heatmap</h1>
      <p data-testid="heat-hint" style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.4, color: c.textMuted }}>
        {counts.new === cells.length
          ? 'Tap a band to see which lessons teach it.'
          : 'A band glows brighter the better you remember it. Tap one to see its lessons.'}
      </p>
      {/* R21: the empty look, before any lesson has asked about a band. The dim tiles below show what's coming. */}
      {counts.new === cells.length && onPath && (
        <Card raised data-testid="heat-empty" style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Beacon face="idle" size={BEACON_SIZE.path} breathe={false} data-testid="heat-empty-beacon" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Nothing lit up yet</div>
            <div style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.4, marginBottom: 12 }}>
              Each band lights up once a lesson asks about it, brighter the better you remember it.</div>
            <Button full icon="tower" data-testid="heat-empty-path" onClick={onPath}>Go to your first lesson</Button>
          </div>
        </Card>
      )}
      <Legend counts={counts} />
      {GROUPS.map(g => {
        const row = cells.filter(x => x.group === g.id);
        if (!row.length) return null;
        return (
          <section key={g.id} data-testid={`heat-group-${g.id}`} style={{ marginTop: 20 }}>
            <SectionLabel>{g.label}</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8 }}>
              {row.map(cell => <Tile key={cell.id} cell={cell} fill={fresh.has(cell.id)} onOpen={() => { opened.current = cell.id; setOpen(cell.id); }} />)}
            </div>
          </section>
        );
      })}
      <BottomSheet open={!!band} tone="info" icon="waves" testId="heat-sheet" onClose={close}
        title={band && <span style={mono}>{band.id}</span>}>
        {band && <BandDetail cell={band} lessons={lessonsOf(band.id)} onStart={onStart} />}
      </BottomSheet>
    </div>
  );
}

// The key: four tiny tiles with their word and how many bands are at that level ("Strong 3").
function Legend({ counts }: { counts: Record<Level, number> }) {
  return (
    <div data-testid="heat-legend" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8,
      padding: '10px 12px', background: c.surface, border: `1px solid ${c.border}`, borderRadius: RADIUS.card }}>
      {LEVELS.map(l => (
        <div key={l} data-testid={`heat-legend-${l}`} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span aria-hidden style={{ width: 14, height: 14, flexShrink: 0, borderRadius: 4, boxSizing: 'border-box', background: l === 'new' ? 'transparent' : tint(l),
            border: `1.5px ${l === 'new' ? 'dashed' : 'solid'} ${l === 'new' ? c.lockedIcon : tone(l)}` }} />
          <span style={{ minWidth: 0, lineHeight: 1.2 }}>
            <span style={{ display: 'block', fontSize: 13, color: c.textMuted }}>{LEVEL_WORD[l]}</span>
            <span style={{ ...mono, fontSize: 16, fontWeight: 700, color: counts[l] ? c.text : c.textMuted }}>{counts[l]}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// One band tile: its name, small signal bars and the %. Layers, bottom to top: the glow (behind, its see-through-ness =
// how bright), the colour fill, the words. The fill and glow start hidden when the tile is about to fill in.
function Tile({ cell, fill, onOpen }: { cell: Cell; fill: boolean; onOpen: () => void }) {
  const level = heatLabel(cell.score), isNew = level === 'new', glow = heatGlow(cell.score);
  const press = usePress(true, PRESS_BIG);
  const pct = cell.score === null ? null : Math.round(cell.score * 100);
  return (
    <motion.button type="button" data-testid={`heat-${cell.id}`} data-label={level} {...(fill ? { 'data-fill-new': '' } : {})} {...press}
      onClick={onOpen} aria-label={`${cell.id}: ${isNew ? 'not asked yet' : `${LEVEL_WORD[level].toLowerCase()}, ${pct}% remembered`}. Show its lessons.`}
      style={{ position: 'relative', height: 64, padding: 0, borderRadius: RADIUS.tile, cursor: 'pointer', boxSizing: 'border-box',
        background: c.surface, border: `1.5px ${isNew ? 'dashed' : 'solid'} ${isNew ? c.locked : tone(level)}`, color: c.text }}>
      {!isNew && <>
        <span data-part="glow" data-glow={glow} aria-hidden style={{ position: 'absolute', inset: -1.5, borderRadius: RADIUS.tile, pointerEvents: 'none',
          boxShadow: `0 0 16px 1px color-mix(in srgb, ${tone(level)} 60%, transparent)`, opacity: fill ? 0 : glow }} />
        <span data-part="fill" aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.tile - 2, background: tint(level),
          transformOrigin: '50% 100%', ...(fill ? { transform: 'scaleY(0)', opacity: 0 } : {}) }} />
      </>}
      <span style={{ position: 'relative', display: 'grid', justifyItems: 'center', gap: 4 }}>
        <span style={{ ...mono, fontSize: 17, fontWeight: 700, color: isNew ? c.textMuted : c.text }}>{cell.id}</span>
        <span style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 14 }}>
          {isNew ? <span style={{ ...mono, fontSize: 12, color: c.textMuted }}>new</span>
            : <><Bars n={heatBars(cell.score)} color={tone(level)} /><span style={{ ...mono, fontSize: 12, lineHeight: 1, color: c.textMuted }}>{pct}%</span></>}
        </span>
      </span>
    </motion.button>
  );
}

// Four little signal bars, like a phone's: `n` of them lit in the level's colour, the rest dim. (SignalBars in Icon.tsx is
// drawn for 32 px; at this 12 px size its bars come out under 2 px wide, so the tiles draw their own.)
function Bars({ n, color, size = 1 }: { n: number; color: string; size?: number }) {
  return (
    <svg data-bars={n} width={17 * size} height={12 * size} viewBox="0 0 17 12" aria-hidden>
      {[0, 1, 2, 3].map(i => <rect key={i} x={i * 4.5} y={9 - i * 3} width={3} height={3 + i * 3} rx={1} fill={i < n ? color : c.borderStrong} />)}
    </svg>
  );
}

// The sheet's inside: how well you know the band, then its lessons in path order. Done and open lessons can be
// played from here; locked ones show a lock (they open in order on the path).
function BandDetail({ cell, lessons, onStart }: { cell: Cell; lessons: LessonLink[]; onStart: (id: string) => void }) {
  const level = heatLabel(cell.score);
  const pct = cell.score === null ? null : Math.round(cell.score * 100);
  return (
    <div data-testid="heat-detail" data-label={level}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0 4px' }}>
        {level === 'new' ? <Icon name="info" size={20} style={{ color: c.textMuted }} /> : <Bars n={heatBars(cell.score)} color={tone(level)} size={1.4} />}
        <span data-testid="heat-detail-level" style={{ fontWeight: 700, color: level === 'new' ? c.textMuted : tone(level) }}>
          {level === 'new' ? 'Not asked yet' : <>{LEVEL_WORD[level]} · <span style={mono}>{pct}%</span> remembered</>}
        </span>
      </div>
      <div style={{ color: c.textMuted, margin: '0 0 12px' }}>
        {level === 'fading' ? 'The daily review brings its questions back. Or play a lesson below.'
          : level === 'new' ? 'Play one of these lessons and it lights up.'
          : <><span style={mono}>{cell.questions}</span> {cell.questions === 1 ? 'question asks' : 'questions ask'} about it, in these lessons:</>}
      </div>
      <SectionLabel style={{ margin: '0 0 6px' }}>{lessons.length === 1 ? '1 lesson' : `${lessons.length} lessons`}</SectionLabel>
      <div style={{ display: 'grid', gap: 4 }}>
        {lessons.map(l => <LessonRow key={l.id} lesson={l} onStart={onStart} />)}
      </div>
    </div>
  );
}

// A lesson you can play is a button (44 px or taller, with a chevron); a locked one is a short, quiet line with a lock,
// so a band taught in many lessons (n41: 22) doesn't fill the sheet with rows you can't press.
function LessonRow({ lesson: l, onStart }: { lesson: LessonLink; onStart: (id: string) => void }) {
  const playable = l.status === 'done' || l.status === 'current';
  const press = usePress(playable, PRESS_BIG);
  const unit = <span style={{ ...mono, fontSize: 12, color: c.textMuted, flexShrink: 0 }}>UNIT {l.unit}</span>;
  if (!playable) return (
    <div data-testid={`heat-lesson-${l.id}`} data-status={l.status} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 30, padding: '0 12px', fontSize: 14, color: c.textMuted }}>
      <Icon name="lock" size={16} label="Locked" style={{ color: c.lockedIcon, flexShrink: 0, margin: '0 2px' }} />
      <span style={{ flex: 1, minWidth: 0 }}>{l.title}</span>{unit}
    </div>
  );
  const done = l.status === 'done';
  return (
    <motion.button type="button" data-testid={`heat-lesson-${l.id}`} data-status={l.status} {...press} onClick={() => onStart(l.id)}
      aria-label={`${l.title}, unit ${l.unit}, ${done ? 'done' : 'next'}. Play it.`}
      style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '6px 12px', borderRadius: RADIUS.tile, textAlign: 'left',
        background: c.surface, border: `1px solid ${done ? c.border : c.signal}`, color: c.text, cursor: 'pointer', fontSize: 15 }}>
      <Icon name={done ? 'check' : 'tower'} size={20} style={{ color: done ? c.onAir : c.signal, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>{l.title}</span>{unit}
      <Icon name="chevron" size={18} style={{ color: c.signal, flexShrink: 0 }} />
    </motion.button>
  );
}
