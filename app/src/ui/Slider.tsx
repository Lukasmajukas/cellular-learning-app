import { c, RADIUS } from '../theme';

// A slider (redesign R19, for the sound volume). Like the switch, inside is a real (see-through) range input, so the
// mouse, the arrow keys, Home / End and screen readers all work; on top of it we draw our own look: a dark track, the
// part up to the value filled with signal blue, and a round knob. Nothing animates: the knob follows your finger.
// `onDone` runs when you let go (mouse up, or an arrow key released), for things that shouldn't happen on every step.
// The 44 px tall box is the clickable area (DESIGN.md: at least 44 x 44).
// The keys that move a slider (Tab arriving on it must not count as "done").
const STEP_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);
export function Slider({ value, min = 0, max = 100, step = 10, onChange, onDone, testId, label, width = 132 }:
  { value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void; onDone?: (v: number) => void;
    testId?: string; label: string; width?: number }) {
  const at = (value - min) / (max - min), KNOB = 20;
  return (
    <span className="ui-slider" style={{ position: 'relative', display: 'inline-block', width, height: 44, flexShrink: 0 }}>
      <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 19, height: 6, borderRadius: RADIUS.pill, background: c.track,
        border: `1px solid ${c.borderStrong}`, boxSizing: 'border-box', overflow: 'hidden' }}>
        <span data-part="fill" style={{ position: 'absolute', inset: 0, background: c.signal, transformOrigin: 'left center', transform: `scaleX(${at})` }} />
      </span>
      <span aria-hidden data-part="knob" style={{ position: 'absolute', top: 12, left: `calc(${at} * (100% - ${KNOB}px))`, width: KNOB, height: KNOB,
        borderRadius: '50%', background: c.text, border: `2px solid ${c.signal}`, boxSizing: 'border-box' }} />
      <input type="range" data-testid={testId} aria-label={label} aria-valuetext={`${value}%`} min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        onPointerUp={e => onDone?.(Number(e.currentTarget.value))} onKeyUp={e => { if (STEP_KEYS.has(e.key)) onDone?.(Number(e.currentTarget.value)); }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: 'pointer' }} />
    </span>
  );
}
