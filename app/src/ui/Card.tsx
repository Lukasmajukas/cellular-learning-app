import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { c, RADIUS, mono } from '../theme';
import type { TokenKey } from '../theme/tokens';

// A small capital label above a group, like "PICK ONE" or "SOUND AND MOVEMENT" (12 px, spaced out, the "code" font).
export function SectionLabel({ children, tone = 'textMuted', style, ...rest }: { children: ReactNode; tone?: TokenKey; style?: CSSProperties } & HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} style={{ ...mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: c[tone], margin: '0 0 8px', ...style }}>{children}</div>;
}

// A card: a dark panel with a thin outline and round corners. `raised` = one step lighter (for things on top of a card);
// `accent` = an outline in a token colour (like the signal-blue "This changed" card); `title` = a section label inside the top.
export function Card({ raised, accent, title, children, style, ...rest }: { raised?: boolean; accent?: TokenKey; title?: string; style?: CSSProperties; children?: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <section {...rest} style={{ background: raised ? c.surface2 : c.surface, border: `1px solid ${accent ? c[accent] : c.border}`,
      borderRadius: RADIUS.card, padding: 16, boxSizing: 'border-box', ...style }}>
      {title && <SectionLabel>{title}</SectionLabel>}
      {children}
    </section>
  );
}
