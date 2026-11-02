// Turns a lesson as written (with {band:..} templates, answer_from, sort_by) into finished items.
import { fill, lookup, type Data } from './templates';
import type { Item, Badge } from './questions';

export type Def = {
  id: string; kind: 'learn' | 'choice' | 'match' | 'number' | 'order' | 'scenario';
  facts?: string[]; no_facts_needed?: boolean; label?: 'history' | 'coming';
  prompt?: string; why?: string; text?: string; title?: string; show?: string[];
  choices?: string[]; answer?: number;
  pairs?: [string, string][];
  answer_from?: string; tolerance_mhz?: number; unit?: string;
  bands?: string[]; sort_by?: string;
  clues?: { text: string; choices: string[]; answer: number; why?: string }[];
};
const RANK = ['CURRENT', 'HISTORICAL', 'PENDING', 'PLANNED', 'UNVERIFIED'];

// Status badge for items that rest on carrier or spectrum-change facts (band frequencies need none).
function badgeFor(d: Def, data: Data): Badge | undefined {
  const refs = (d.facts ?? []).filter(f => !f.startsWith('band:'));
  if (!refs.length) return undefined;
  const rows = refs.map(f => ({ status: String(lookup(`${f}.status`, data)), asOf: String(lookup(`${f}.as_of`, data)) }));
  return rows.sort((a, b) => RANK.indexOf(b.status) - RANK.indexOf(a.status))[0]; // show the weakest status
}

export function resolveItem(d: Def, data: Data): Item {
  if (!d.facts && !d.no_facts_needed) throw new Error(`${d.id}: list "facts" or set no_facts_needed`);
  const f = (t: string | undefined) => fill(t ?? '', data);
  const base = { id: d.id, why: d.why ? f(d.why) : undefined, badge: badgeFor(d, data) };
  switch (d.kind) {
    case 'learn': return { ...base, kind: 'learn', title: d.title && f(d.title), text: f(d.text), bars: d.show };
    case 'choice': {
      if (!d.choices || d.answer === undefined || d.answer < 0 || d.answer >= d.choices.length) throw new Error(`${d.id}: bad choices/answer`);
      return { ...base, kind: 'choice', prompt: f(d.prompt), choices: d.choices.map(f), answer: d.answer };
    }
    case 'match': {
      if (!d.pairs || d.pairs.length < 2) throw new Error(`${d.id}: match needs 2+ pairs`);
      return { ...base, kind: 'match', prompt: f(d.prompt), pairs: d.pairs.map(([a, b]) => [f(a), f(b)] as [string, string]) };
    }
    case 'number': {
      if (!d.answer_from) throw new Error(`${d.id}: number needs answer_from`);
      const v = Number(lookup(d.answer_from, data));
      if (Number.isNaN(v)) throw new Error(`${d.id}: answer_from is not a number`);
      return { ...base, kind: 'number', prompt: f(d.prompt), answer: v, tolerance: d.tolerance_mhz ?? 5, unit: d.unit };
    }
    case 'order': {
      if (!d.bands || d.bands.length < 2) throw new Error(`${d.id}: order needs 2+ bands`);
      const key = d.sort_by ?? 'dl_low_mhz';
      const items = d.bands.map(id => ({ label: id, value: Number(lookup(`band:${id}.${key}`, data)),
        low: Number(lookup(`band:${id}.dl_low_mhz`, data)), high: Number(lookup(`band:${id}.dl_high_mhz`, data)) }));
      if (new Set(items.map(i => i.value)).size !== items.length) throw new Error(`${d.id}: two bands tie on ${key}`);
      return { ...base, kind: 'order', prompt: f(d.prompt), items };
    }
    case 'scenario': {
      if (!d.clues || d.clues.length < 2) throw new Error(`${d.id}: scenario needs 2+ clues`);
      for (const c of d.clues) if (!c.choices || c.choices.length < 2 || c.answer < 0 || c.answer >= c.choices.length) throw new Error(`${d.id}: bad clue choices/answer`);
      return { ...base, kind: 'scenario', prompt: f(d.prompt), clues: d.clues.map(c => ({ text: f(c.text), choices: c.choices.map(f), answer: c.answer, why: c.why && f(c.why) })) };
    }
  }
}
export const resolveLesson = (defs: Def[], data: Data): Item[] => defs.map(d => resolveItem(d, data));
