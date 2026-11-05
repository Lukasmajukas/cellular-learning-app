import type { CSSProperties, ReactNode } from 'react';
import { c, SIZE } from '../theme';
import type { TokenKey } from '../theme/tokens';
import { SectionLabel } from './Card';

// Idea I58: the top of every tab, as one building block, so the four tabs can't drift apart again (design review 2
// had to line them up by hand). DESIGN.md section 6: a small capital label in the tab's colour ("SIGNAL PATH"),
// the 28 px title just under it, an optional one-line help in the muted colour, then always 16 px before the
// tab's first card. `aside` sits on the title's line, at the right (the path's "3 of 49 lessons done").
export const TAB_HEAD_GAP = 16;     // from the head's last line to the tab's first card
export const TAB_HELP_SIZE = 15;    // the help line (between body text and the small labels)

export function TabHead({ label, tone = 'signal', title, help, helpTestId, aside, style }: {
  label: string; tone?: TokenKey; title: string; help?: ReactNode; helpTestId?: string; aside?: ReactNode; style?: CSSProperties;
}) {
  const h1 = <h1 style={{ margin: 0, fontSize: SIZE.title, lineHeight: 1.25 }}>{title}</h1>;
  return (
    <header data-testid="tab-head" style={{ margin: `0 0 ${TAB_HEAD_GAP}px`, ...style }}>
      <SectionLabel tone={tone} data-testid="tab-label" style={{ margin: 0 }}>{label}</SectionLabel>
      {aside
        ? <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 2 }}>{h1}{aside}</div>
        : <div style={{ marginTop: 2 }}>{h1}</div>}
      {help !== undefined && <p data-testid={helpTestId ?? 'tab-help'} style={{ margin: '4px 0 0', fontSize: TAB_HELP_SIZE, lineHeight: 1.4, color: c.textMuted }}>{help}</p>}
    </header>
  );
}
