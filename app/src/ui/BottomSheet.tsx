import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { c, COLUMN } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { Icon } from '../Icon';
import { SHEET, type SheetTone } from './tones';
import { SPRING, QUICK_FADE, useCalm, INSTANT } from '../theme/motion';

// The panel that slides up from the bottom of the window after an answer: "Right!" (on-air green) or "Not quite" (miss, soft red).
// It always has an icon and words, never colour alone. `children` = the explanation; `action` = its button (like Continue).
// With "Reduce motion" on, it doesn't slide: it just fades in quickly.
export function BottomSheet({ open, tone, title, children, action, testId }:
  { open: boolean; tone: SheetTone; title: string; children?: ReactNode; action?: ReactNode; testId?: string }) {
  const t: { bg: TokenKey; fg: TokenKey; border: TokenKey } = SHEET[tone];
  const calm = useCalm();
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" role="status" data-testid={testId} data-tone={tone}
          initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
          transition={{ y: calm ? INSTANT : SPRING.sheet, opacity: QUICK_FADE }}
          style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, background: c[t.bg], borderTop: `2px solid ${c[t.border]}`, color: c[t.fg] }}>
          <div style={{ maxWidth: COLUMN, margin: '0 auto', padding: '18px 20px 22px', boxSizing: 'border-box' }}>
            <div data-testid={testId && `${testId}-title`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: c[t.border], marginBottom: 6 }}>
              <Icon name={tone === 'right' ? 'check' : 'cross'} size={28} />{title}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>{children}</div>
            {action && <div style={{ marginTop: 14 }}>{action}</div>}
          </div>
        </motion.div>)}
    </AnimatePresence>
  );
}
