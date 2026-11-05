// Idea I58 guards: the top of every tab is the one shared `TabHead` block (DESIGN.md section 6), so the four tabs
// can't drift apart again. Design review 2 found the Path tab's head 4 px lower and without its label, and lined
// them up by hand; now no tab may draw its own label or title.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TabHead, TAB_HEAD_GAP } from './ui/TabHead';

const SRC = __dirname;
const read = (f: string) => readFileSync(join(SRC, f), 'utf8');
const withoutComments = (code: string) => code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
// The four tabs, with the label, colour and title DESIGN.md section 6 gives them.
const TABS: [file: string, label: string, tone: string, title: string][] = [
  ['PathMap.tsx', 'Signal path', 'signal', 'Your path'],
  ['ReviewScreen.tsx', 'Drive test', 'review', 'Daily review'],
  ['HeatMapScreen.tsx', 'Band memory', 'signal', 'Heatmap'],
  ['SettingsScreen.tsx', 'Your app', 'signal', 'Settings'],
];
const head = (props: Parameters<typeof TabHead>[0]) => renderToStaticMarkup(createElement(TabHead, props));

describe('the tab head block (I58)', () => {
  it('draws the label, then the 28 px title, then the help line, with 16 px below it', () => {
    const html = head({ label: 'Band memory', title: 'Heatmap', help: 'Tap a band.' });
    expect(html.indexOf('data-testid="tab-label"')).toBeLessThan(html.indexOf('<h1'));
    expect(html.indexOf('<h1')).toBeLessThan(html.indexOf('data-testid="tab-help"'));
    expect(html).toMatch(/<h1 style="margin:0;font-size:28px;line-height:1.25">Heatmap<\/h1>/);
    expect(html).toContain(`margin:0 0 ${TAB_HEAD_GAP}px`);
    expect(TAB_HEAD_GAP).toBe(16);
    expect(html).toContain('>Band memory<');
    expect(html).toContain('color:var(--text-muted)');
  });
  it('the label takes the tab\'s colour; no help line unless asked; the aside sits on the title\'s line', () => {
    expect(head({ label: 'Drive test', tone: 'review', title: 'Daily review' })).toContain('color:var(--review)');
    expect(head({ label: 'Signal path', title: 'Your path' })).not.toContain('<p');
    const withAside = head({ label: 'Signal path', title: 'Your path', aside: createElement('span', { 'data-testid': 'path-count' }, '3 of 49') });
    expect(withAside).toMatch(/display:flex[^>]*><h1[^>]*>Your path<\/h1><span data-testid="path-count">/);
  });
  it('keeps a help line\'s own test ID (the heatmap\'s "heat-hint")', () => {
    expect(head({ label: 'Band memory', title: 'Heatmap', help: 'x', helpTestId: 'heat-hint' })).toContain('data-testid="heat-hint"');
  });
});

describe('every tab uses it, and draws no head of its own', () => {
  for (const [file, label, tone, title] of TABS) {
    it(file, () => {
      const code = withoutComments(read(file));
      const uses = code.match(/<TabHead\b[^>]*/g) ?? [];
      expect(uses, 'exactly one TabHead').toHaveLength(1);
      const use = uses[0] ?? '';
      expect(use).toContain(`label="${label}"`);
      expect(use).toContain(`title="${title}"`);
      expect(use.includes('tone=') ? use : 'tone="signal"').toContain(`tone="${tone}"`);
      expect(code, 'its own title').not.toMatch(/<h1\b/);
      expect(code, 'its own tab label').not.toContain('tab-label');
    });
  }
  it('the check bites: a tab drawing its own head is caught', () => {
    const old = '<SectionLabel tone="signal" data-testid="tab-label">Your app</SectionLabel><h1 style={{ fontSize: 28 }}>Settings</h1>';
    expect(old).toMatch(/<h1\b/);
    expect(old).toContain('tab-label');
    expect(old.match(/<TabHead\b[^>]*/g)).toBeNull();
  });
});
