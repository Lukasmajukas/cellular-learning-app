// Redesign R23 (the speed check): guards for the two slow spots it found and fixed. The measurements themselves are
// click tests in the real app (tests/speed.spec.ts); these catch the causes coming back, on any computer.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Beacon, BEACON_FACES } from './ui/Beacon';

const css = readFileSync(join(__dirname, 'theme', 'theme.css'), 'utf8');
// Every screen and building block (the .tsx files), to look for endless loops inside drawings.
const files = [__dirname, join(__dirname, 'ui')].flatMap(d => readdirSync(d).filter(f => f.endsWith('.tsx')).map(f => [f, readFileSync(join(d, f), 'utf8')] as const));

describe('the night glow (R23)', () => {
  it('is never a "fixed background" (Chromium repaints the whole window at every scroll step for one)', () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');            // the rules only, not the notes about them
    expect(rules).not.toMatch(/background-attachment\s*:\s*fixed/);
    for (const [f, src] of files) expect(src, f).not.toMatch(/backgroundAttachment\s*:\s*['"]fixed/);
  });
  it('is its own fixed layer behind everything, which you can click through', () => {
    const rule = css.match(/body::before\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(rule).toMatch(/position:\s*fixed/);
    expect(rule).toMatch(/inset:\s*0/);
    expect(rule).toMatch(/z-index:\s*-1/);
    expect(rule).toMatch(/pointer-events:\s*none/);
    expect(rule).toMatch(/radial-gradient\(ellipse 620px 560px at 50% 38%, var\(--glow-1\)/); // the same glow as before
  });
});

describe('Beacon\'s breathing rings (R23)', () => {
  // Where an element sits in the drawing's markup: how many <svg> tags are still open at that point.
  const svgDepth = (html: string, at: number) => (html.slice(0, at).match(/<svg/g) ?? []).length - (html.slice(0, at).match(/<\/svg>/g) ?? []).length;
  it('are on a page layer of their own, not inside a drawing (so the graphics chip runs the breath), for every face', () => {
    for (const face of BEACON_FACES) {
      const html = renderToStaticMarkup(createElement(Beacon, { face }));
      const at = html.indexOf('data-part="rings"');
      expect(at, face).toBeGreaterThan(0);
      expect(html.lastIndexOf('<', at), face).toBe(html.lastIndexOf('<span', at)); // the rings' layer is a <span> ...
      expect(svgDepth(html, at), face).toBe(0);                                      // ... outside every drawing
      expect(html.slice(at, html.indexOf("</svg>", at)).match(/<circle[^>]*r="(22|30)"/g)?.length, face).toBe(2); // and it holds both rings
    }
  });
  it('sit in a square around the head, so they breathe about its centre (inside Beacon\'s box, with room to grow)', () => {
    const size = 100, html = renderToStaticMarkup(createElement(Beacon, { size }));
    const box = html.match(/data-part="ring-hop"[^>]*style="([^"]*)"/)?.[1] ?? '';
    const px = (k: string) => Number(box.match(new RegExp(`${k}:\\s*([\\d.]+)px`))?.[1]);
    const [l, t, w, h] = [px('left'), px('top'), px('width'), px('height')];
    expect(w).toBe(h);
    expect(l + w / 2).toBe(50); expect(t + h / 2).toBe(40);                         // the head's centre (50, 40)
    expect(w / 2).toBeGreaterThanOrEqual((30 + 1.25) * 1.07);                      // the outer ring at its biggest breath
    expect(l).toBeGreaterThanOrEqual(0); expect(t).toBeGreaterThanOrEqual(0); expect(l + w).toBeLessThanOrEqual(100);
  });
  it('no endless loop anywhere is put on a part of a drawing (an SVG <g>, circle or path)', () => {
    // An endless loop is BREATHE (the breath), LOOP or "repeat: Infinity". On a drawing's part, Chromium redraws it by
    // code every frame; on a page element (span, div), the graphics chip runs it.
    for (const [f, src] of files) {
      for (const m of src.matchAll(/<motion\.(\w+)\b([^>]|=>)*?>/g)) {
        const tag = m[0];
        if (/BREATHE\.on|\bLOOP\b|repeat:\s*Infinity/.test(tag)) expect(['span', 'div', 'button'], `${f}: ${tag.slice(0, 80)}`).toContain(m[1]);
      }
    }
  });
});
