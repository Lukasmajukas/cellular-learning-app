import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { c, COLUMN } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { Icon, type IconName } from '../Icon';
import { IconButton } from './Button';
import { SHEET, type SheetTone } from './tones';
import { SPRING, QUICK_FADE, SCRIM, useCalm, INSTANT } from '../theme/motion';

// The panel that slides up from the bottom of the window after an answer: "Right!" (on-air green) or "Not quite" (miss, soft red).
// It always has an icon and words, never colour alone. `children` = the explanation; `action` = its button (like Continue).
// With "Reduce motion" on, it doesn't slide: it starts in place and just fades in quickly.
// It is drawn straight into the page's <body> (a "portal", R09): a screen that glides (the lesson rising, a question
// sliding) would otherwise carry the sheet along and it wouldn't sit on the window's bottom edge.
// A tall explanation scrolls inside the sheet, so the sheet never covers more than 70% of the window.
// `onHeight` reports the sheet's height (0 when it's gone), so the screen can leave room for it underneath.
// R14: an `info` sheet (tone "info", with its own `icon`) shows something instead of judging an answer, like a band's
// lessons on the heatmap. Give it `onClose` and it gets a close button, closes with Esc (before Esc does anything else,
// like leaving the tab), and sits over a dark scrim that closes it when clicked.
// Design review 3 (R24): a tall sheet's own scrollbar took its width from the right, so "centred" moved the words 7-8 px
// left of the page's column (gallery `35-heatmap-sheet`). The column now starts where the page's does: half of what's
// left of the sheet's whole width, scrollbar or not (`left` below).
export function BottomSheet({ open, tone, title, icon, children, action, testId, onHeight, onClose }:
  { open: boolean; tone: SheetTone; title: ReactNode; icon?: IconName; children?: ReactNode; action?: ReactNode; testId?: string;
    onHeight?: (h: number) => void; onClose?: () => void }) {
  const t: { bg: TokenKey; fg: TokenKey; border: TokenKey } = SHEET[tone];
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  const report = useRef(onHeight);
  report.current = onHeight;
  const close = useRef(onClose);
  close.current = onClose;
  const closable = !!onClose;
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!open || !el) { report.current?.(0); return; }
    const ro = new ResizeObserver(() => { report.current?.(el.offsetHeight); setLeft(Math.max(0, (el.offsetWidth - COLUMN) / 2)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);
  // Esc closes the sheet first. Listening in the "capture" step means this runs before the app's own Esc (go back to the path).
  useEffect(() => {
    if (!open || !closable) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.repeat) return;
      e.preventDefault(); e.stopImmediatePropagation(); close.current?.();
    };
    window.addEventListener('keydown', esc, true);
    box.current?.querySelector<HTMLElement>('[data-sheet-close]')?.focus({ preventScroll: true }); // the keyboard lands inside the sheet
    return () => window.removeEventListener('keydown', esc, true);
  }, [open, closable]);
  const fade = calm ? QUICK_FADE : SCRIM;
  return createPortal(
    <AnimatePresence>
      {open && closable && (
        <motion.div key="scrim" data-testid={testId && `${testId}-scrim`} aria-hidden onClick={() => close.current?.()}
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: fade }} exit={{ opacity: 0, transition: fade }}
          style={{ position: 'fixed', inset: 0, zIndex: 19, background: `color-mix(in srgb, ${c.bg} 72%, transparent)` }} />)}
      {open && (
        <motion.div key="sheet" ref={box} role={closable ? 'dialog' : 'status'} aria-modal={closable || undefined}
          data-testid={testId} data-tone={tone}
          initial={{ y: calm ? 0 : '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: calm ? 0 : '100%', opacity: 0 }}
          transition={{ y: calm ? INSTANT : SPRING.sheet, opacity: QUICK_FADE }}
          style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, maxHeight: '70vh', overflowY: 'auto',
            background: c[t.bg], borderTop: `2px solid ${c[t.border]}`, color: c[t.fg] }}>
          <div data-sheet-column style={{ maxWidth: COLUMN, margin: left === null ? '0 auto' : `0 0 0 ${left}px`, padding: '18px 20px 22px', boxSizing: 'border-box', textAlign: 'left' }}>
            <div data-testid={testId && `${testId}-title`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: c[t.border], marginBottom: 6 }}>
              <Icon name={icon ?? (tone === 'right' ? 'check' : tone === 'wrong' ? 'cross' : 'info')} size={28} />
              <span style={{ flex: 1, minWidth: 0 }}>{title}</span>
              {closable && <IconButton icon="close" label="Close" data-sheet-close data-testid={testId && `${testId}-close`}
                onClick={() => close.current?.()} style={{ marginRight: -10 }} />}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>{children}</div>
            {action && <div style={{ marginTop: 14 }}>{action}</div>}
          </div>
        </motion.div>)}
    </AnimatePresence>,
    document.body);
}
