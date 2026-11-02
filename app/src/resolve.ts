// Turns a lesson as written (with {band:..} templates, answer_from, sort_by) into finished items.
import { fill, lookup, type Data } from './templates';
import type { Item, Badge, Photo, Rect } from './questions';

export type Def = {
  id: string; kind: 'learn' | 'choice' | 'match' | 'number' | 'order' | 'scenario' | 'photo-choice' | 'tap-clue';
  facts?: string[]; no_facts_needed?: boolean; label?: 'history' | 'coming';
  prompt?: string; why?: string; text?: string; title?: string; show?: string[];
  choices?: string[]; answer?: number;
  pairs?: [string, string][];
  answer_from?: string; tolerance_mhz?: number; unit?: string;
  bands?: string[]; sort_by?: string;
  photo?: string; alt?: string; outline?: Rect; target?: Rect; clue?: string;
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

const okRect = (r: Rect | undefined): r is Rect => !!r && [r.x, r.y, r.w, r.h].every(n => typeof n === 'number' && n >= 0 && n <= 1) && r.w > 0 && r.h > 0 && r.x + r.w <= 1.0001 && r.y + r.h <= 1.0001;
// Finds the picture in the credits list and builds its credit line (required wherever the picture is shown).
function photoFor(d: Def, data: Data): Photo {
  const row = d.photo ? data.photos?.find(p => p.id === d.photo) : undefined;
  if (!row) throw new Error(`${d.id}: photo ${d.photo} is not in the credits list`);
  if (!d.alt) throw new Error(`${d.id}: a photo question needs "alt" (words describing the picture)`);
  return { id: row.id, src: `photos/${row.file}`, alt: d.alt, credit: `${row.title}, by ${row.author}, ${row.licence}` };
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
    case 'photo-choice': {
      if (!d.choices || d.choices.length < 2 || d.answer === undefined || d.answer < 0 || d.answer >= d.choices.length) throw new Error(`${d.id}: bad choices/answer`);
      if (d.outline && !okRect(d.outline)) throw new Error(`${d.id}: outline must be fractions inside the picture`);
      return { ...base, kind: 'photo-choice', prompt: f(d.prompt), photo: photoFor(d, data), choices: d.choices.map(f), answer: d.answer, outline: d.outline };
    }
    case 'tap-clue': {
      if (!d.clue) throw new Error(`${d.id}: tap-clue needs "clue" (what to find)`);
      if (!okRect(d.target)) throw new Error(`${d.id}: target must be fractions inside the picture`);
      return { ...base, kind: 'tap-clue', prompt: f(d.prompt), photo: photoFor(d, data), clue: f(d.clue), target: d.target };
    }
  }
}
export const resolveLesson = (defs: Def[], data: Data): Item[] => defs.map(d => resolveItem(d, data));
