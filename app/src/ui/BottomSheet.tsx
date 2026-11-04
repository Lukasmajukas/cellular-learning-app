import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { c, COLUMN } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { Icon } from '../Icon';
import { SHEET, type SheetTone } from './tones';
import { SPRING, QUICK_FADE, useCalm, INSTANT } from '../theme/motion';

// The panel that slides up from the bottom of the window after an answer: "Right!" (on-air green) or "Not quite" (miss, soft red).
// It always has an icon and words, never colour alone. `children` = the explanation; `action` = its button (like Continue).
// With "Reduce motion" on, it doesn't slide: it starts in place and just fades in quickly.
// It is drawn straight into the page's <body> (a "portal", R09): a screen that glides (the lesson rising, a question
// sliding) would otherwise carry the sheet along and it wouldn't sit on the window's bottom edge.
// A tall explanation scrolls inside the sheet, so the sheet never covers more than 70% of the window.
// `onHeight` reports the sheet's height (0 when it's gone), so the screen can leave room for it underneath.
export function BottomSheet({ open, tone, title, children, action, testId, onHeight }:
  { open: boolean; tone: SheetTone; title: ReactNode; children?: ReactNode; action?: ReactNode; testId?: string; onHeight?: (h: number) => void }) {
  const t: { bg: TokenKey; fg: TokenKey; border: TokenKey } = SHEET[tone];
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  const report = useRef(onHeight);
  report.current = onHeight;
  useEffect(() => {
    const el = box.current;
    if (!open || !el) { report.current?.(0); return; }
    const ro = new ResizeObserver(() => report.current?.(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" ref={box} role="status" data-testid={testId} data-tone={tone}
          initial={{ y: calm ? 0 : '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: calm ? 0 : '100%', opacity: 0 }}
          transition={{ y: calm ? INSTANT : SPRING.sheet, opacity: QUICK_FADE }}
          style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, maxHeight: '70vh', overflowY: 'auto',
            background: c[t.bg], borderTop: `2px solid ${c[t.border]}`, color: c[t.fg] }}>
          <div style={{ maxWidth: COLUMN, margin: '0 auto', padding: '18px 20px 22px', boxSizing: 'border-box', textAlign: 'left' }}>
            <div data-testid={testId && `${testId}-title`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: c[t.border], marginBottom: 6 }}>
              <Icon name={tone === 'right' ? 'check' : 'cross'} size={28} />{title}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>{children}</div>
            {action && <div style={{ marginTop: 14 }}>{action}</div>}
          </div>
        </motion.div>)}
    </AnimatePresence>,
    document.body);
}
