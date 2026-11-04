import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { c, COLUMN, mono } from '../theme';
import { Icon, type IconName } from '../Icon';
import { SPRING, PRESS, INSTANT, useCalm } from '../theme/motion';
import { usePress } from './press';

// The app frame (redesign R04, DESIGN.md section 6 "app shell"): a top bar that stays at the top while you scroll,
// the screen in the middle, and the bottom tabs (Path, Review, Heatmap, Settings) like a phone app.
// Lessons don't use the frame: they fill the whole window, so nothing distracts you.
export const TABS = [
  { id: 'path', label: 'Path', icon: 'mapPin' },
  { id: 'review', label: 'Review', icon: 'repeat' },
  { id: 'heatmap', label: 'Heatmap', icon: 'grid' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];
export type TabId = (typeof TABS)[number]['id'];
export const TAB_BAR_HEIGHT = 68;

// `top` = what the top bar shows (streak, XP, goal). `badges` = small counts on a tab, like the reviews due.
export function AppShell({ tab, onTab, top, badges = {}, children }:
  { tab: TabId; onTab: (t: TabId) => void; top: ReactNode; badges?: Partial<Record<TabId, number>>; children: ReactNode }) {
  return (
    <div data-testid="app-frame">
      <header data-testid="top-bar" style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${c.border}`,
        background: `color-mix(in srgb, ${c.bg} 90%, transparent)` }}>
        <div style={{ maxWidth: COLUMN, minHeight: 56, margin: '0 auto', padding: '6px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14 }}>{top}</div>
      </header>
      {/* overflowX clip: a screen gliding in from the side must not flash a sideways scrollbar (seen in R04's flip book). */}
      <main style={{ paddingBottom: TAB_BAR_HEIGHT + 16, overflowX: 'clip' }}>{children}</main>
      <nav aria-label="Main" data-testid="tab-bar" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10, height: TAB_BAR_HEIGHT,
        background: c.surface, borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: COLUMN, height: '100%', margin: '0 auto', padding: '0 8px', boxSizing: 'border-box', display: 'flex' }}>
          {TABS.map(t => <TabButton key={t.id} id={t.id} label={t.label} icon={t.icon} on={t.id === tab} badge={badges[t.id] ?? 0} onClick={() => onTab(t.id)} />)}
        </div>
      </nav>
    </div>
  );
}

// One tab: icon above its name. The tab you're on is signal blue, with a short glowing marker on top that glides
// from tab to tab (a layout animation, so it moves with transforms only).
function TabButton({ id, label, icon, on, badge, onClick }: { id: TabId; label: string; icon: IconName; on: boolean; badge: number; onClick: () => void }) {
  const calm = useCalm();
  const press = usePress(!on, PRESS);
  return (
    <motion.button type="button" data-testid={`tab-${id}`} aria-current={on ? 'page' : undefined} onClick={onClick} {...press}
      style={{ position: 'relative', flex: 1, minWidth: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
        padding: 0, border: 0, background: 'transparent', cursor: on ? 'default' : 'pointer', color: on ? c.signal : c.textMuted, fontSize: 12, fontWeight: on ? 700 : 500 }}>
      {on && <motion.span layoutId="tab-marker" data-testid="tab-marker" transition={calm ? INSTANT : SPRING.tab}
        style={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: 3, borderRadius: '0 0 3px 3px', background: c.signal }} />}
      <span style={{ position: 'relative', display: 'grid' }}>
        <Icon name={icon} size={24} />
        {badge > 0 && <span data-testid={`tab-${id}-badge`} aria-label={`${badge} due`} style={{ position: 'absolute', top: -6, left: 16, minWidth: 18, height: 18,
          padding: '0 5px', boxSizing: 'border-box', borderRadius: 9, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, lineHeight: 1,
          background: c.review, color: c.onBright, ...mono }}>{badge > 99 ? '99+' : badge}</span>}
      </span>
      {label}
    </motion.button>
  );
}
