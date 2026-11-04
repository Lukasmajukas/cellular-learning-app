import { describe, it, expect } from 'vitest';
import { acknowledge, pendingChanges, startChanges, type Change } from './changes';
import { EMPTY_STATE } from './storage';
import { review } from './fsrs';
import rawChanges from '../../content/changes.json';

const C1: Change = { id: 'c1', date: '2026-11-05', title: 'Sale closed', text: 'x', source: 's', questions: ['q1'] };
const C2: Change = { id: 'c2', date: '2026-12-01', title: 'Another', text: 'y', source: 's' };
const withCards = { ...EMPTY_STATE, reviews: { q1: review(undefined, true, 0), q2: review(undefined, true, 0) } };

describe('this-changed cards', () => {
  it('treats changes already in the list on first start as old news', () => {
    const s = startChanges(withCards, [C1]);
    expect(s.seenChanges).toEqual(['c1']);
    expect(pendingChanges(s, [C1])).toEqual([]);
  });
  it('shows a change added later, once', () => {
    const s = startChanges(withCards, [C1]);
    expect(pendingChanges(s, [C1, C2])).toEqual([C2]);
    const after = acknowledge(s, C2);
    expect(pendingChanges(after, [C1, C2])).toEqual([]);
  });
  it('restarts only the listed questions', () => {
    const s = acknowledge({ ...withCards, seenChanges: [] }, C1);
    expect(Object.keys(s.reviews)).toEqual(['q2']);
    expect(s.seenChanges).toEqual(['c1']);
  });
  it('leaves a save that already looked at the list alone', () => {
    const s = { ...withCards, seenChanges: [] };
    expect(startChanges(s, [C1])).toBe(s);
    expect(pendingChanges(s, [C1])).toEqual([C1]);
  });
  it('the shipped list parses', () => { expect(Array.isArray(rawChanges.changes)).toBe(true); });
});
