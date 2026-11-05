// Idea I69 (after redesign R24): a save that fails says so. Before, a failed save was only written to the log, so a
// finished lesson could be lost without you knowing. Now "Couldn't save your last change" shows at the top until a
// save works. The click test (tests/savefail.spec.ts) tries it in the real app through the CELL_TEST_SAVE_FAIL door.
import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSaver, EMPTY_STATE, type SaveState } from './storage';
import { Notices, SaveFailedNotice, SAVE_FAIL } from './Notices';

const st = (xp: number): SaveState => ({ ...EMPTY_STATE, game: { ...EMPTY_STATE.game, xp } });
// A save we can answer by hand, in any order.
function manual() {
  const sent: { s: SaveState; ok: () => void; no: (e: Error) => void }[] = [];
  const send = (s: SaveState) => new Promise<void>((ok, no) => { sent.push({ s, ok, no }); });
  return { sent, send };
}

describe('createSaver: says whether the newest save worked', () => {
  it('a save that works reports null; one that fails reports its words (and writes it to the log)', async () => {
    const report = vi.fn(), log = vi.spyOn(console, 'error').mockImplementation(() => {});
    await createSaver(report, async () => {})(st(1));
    expect(report).toHaveBeenLastCalledWith(null);
    await createSaver(report, async () => { throw new Error('ENOSPC: no space left on device'); })(st(2));
    expect(report).toHaveBeenLastCalledWith('ENOSPC: no space left on device');
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
  it('only the newest save counts: an older one finishing late changes nothing', async () => {
    const report = vi.fn(), log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { sent, send } = manual(), save = createSaver(report, send);
    // An old failure answering after a newer save worked must not bring the notice back...
    const a = save(st(1)), b = save(st(2));
    sent[1].ok(); await b; sent[0].no(new Error('old')); await a;
    expect(report.mock.calls).toEqual([[null]]);
    // ...and an old success answering after a newer save failed must not hide it.
    report.mockClear();
    const c = save(st(3)), d = save(st(4));
    sent[3].no(new Error('new')); await d; sent[2].ok(); await c;
    expect(report.mock.calls).toEqual([['new']]);
    log.mockRestore();
  });
});

describe('"Couldn\'t save your last change"', () => {
  const html = (tries: number) => renderToStaticMarkup(createElement(SaveFailedNotice, { fail: { detail: 'Disk full (test)', tries }, onRetry: () => {} }));
  it('is kind: no blame words, and it says the change is still here', () => {
    const words = `${SAVE_FAIL.title} ${SAVE_FAIL.text} ${SAVE_FAIL.tries(3)}`;
    expect(words).not.toMatch(/fail|fatal|crash|error|invalid/i);
    expect(SAVE_FAIL.text).toMatch(/still here/);
  });
  it('has Try again and the exact words folded away, and no close button (that would hide an unsaved change)', () => {
    const h = html(1);
    expect(h).toContain('role="alert"');
    expect(h).toContain(SAVE_FAIL.title.replace("'", '&#x27;'));
    expect(h).toContain('data-testid="savefail-retry"');
    expect(h).toContain('data-testid="savefail-details"');
    expect(h).toContain('Disk full (test)');
    expect(h).not.toMatch(/notice-close|aria-label="Close/);
    expect(h).not.toContain('savefail-tries');            // the first time, no count
    expect(html(3)).toContain('Tried 3 times.');
  });
  it('sits above the other notices: it is the one that can cost you something', () => {
    const h = renderToStaticMarkup(createElement(Notices, { saveFail: { detail: 'x', tries: 1 }, onRetrySave: () => {}, restored: 'from yesterday',
      onCloseRestored: () => {}, changeOf: 0, onChangeOk: () => {} }));
    expect(h.indexOf('data-testid="savefail"')).toBeGreaterThanOrEqual(0);
    expect(h.indexOf('data-testid="savefail"')).toBeLessThan(h.indexOf('data-testid="notice"'));
  });
});
