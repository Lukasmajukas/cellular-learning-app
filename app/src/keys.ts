// Keyboard keys (PRD 4e, finally built in redesign R04):
//   1-9    pick answer 1-9 (the number drawn on the answer tile)
//   A-I    pick the right-hand tile with that letter (match the pairs: R22, idea I41)
//   Enter  the screen's main button (Check, Continue, Got it, Back to the path)
//   Esc    leave the lesson, or go back to the path from another tab
// keyIntent() is plain logic (unit-tested in src/keys.test.ts); useKeys() hooks it up to the window.
import { useEffect, useRef } from 'react';

export type KeyIntent = { pick: number } | { letter: string } | 'enter' | 'back' | null;
// focusByKeyboard: did the focus get to `target` with the keyboard (Tab or arrows), rather than a mouse click? (default: yes)
type KeyLike = { key: string; repeat?: boolean; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean; target: EventTarget | null; focusByKeyboard?: boolean };
type El = { tagName?: string; type?: string; disabled?: boolean; isContentEditable?: boolean; getAttribute?: (n: string) => string | null };

// Typing in a text box: the keys belong to the box (Enter sends the form by itself). A box that's switched off
// (like the number box after Check) doesn't count, so Enter then goes on to Continue.
const typing = (t: El | null) => !!t && !t.disabled && (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
  (t.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit'].includes(t.type ?? '')));
// A control you moved to with the Tab key does its own thing with Enter: a button, a link, a switch.
// One you just clicked with the mouse doesn't: then Enter means the screen's main button, as everywhere else.
// (Not ":focus-visible": Chromium turns that on for a clicked button as soon as any key is pressed. Found in R04.)
const ownsEnter = (t: El | null) => !!t && !t.disabled &&
  (t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'INPUT' || ['button', 'switch', 'radio', 'tab', 'link'].includes(t.getAttribute?.('role') ?? ''));

export function keyIntent(e: KeyLike): KeyIntent {
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return null; // holding a key down must not race through a lesson
  const t = e.target as El | null;
  if (typing(t)) return null;
  if (/^[1-9]$/.test(e.key)) return { pick: Number(e.key) };
  if (/^[a-i]$/i.test(e.key)) return { letter: e.key.toLowerCase() }; // with or without Shift (Caps Lock on)
  if (e.key === 'Enter') return e.focusByKeyboard !== false && ownsEnter(t) ? null : 'enter';
  if (e.key === 'Escape') return 'back';
  return null;
}

// Calls `act` for every key above while `on` is true. `act` returns true when it used the key (then the browser's
// own action for it is cancelled, so Enter can't also press whatever button happens to have focus).
// Remembers whether the focus last moved by keyboard (Tab, arrows) or by a click / tap. One pair of listeners for the whole app.
let focusByKeyboard = false;
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', () => { focusByKeyboard = false; }, true);
  window.addEventListener('keydown', e => { if (e.key === 'Tab' || e.key.startsWith('Arrow')) focusByKeyboard = true; }, true);
}

export function useKeys(act: (k: Exclude<KeyIntent, null>) => boolean, on = true) {
  const latest = useRef(act);
  latest.current = act;
  useEffect(() => {
    if (!on) return;
    const listen = (e: KeyboardEvent) => {
      const k = keyIntent({ key: e.key, repeat: e.repeat, ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey, target: e.target, focusByKeyboard });
      if (k && latest.current(k)) e.preventDefault();
    };
    window.addEventListener('keydown', listen);
    return () => window.removeEventListener('keydown', listen);
  }, [on]);
}

// Presses the button inside `root` that answers a key: [data-pick="n"] for a number, [data-letter="a"] for a letter
// (lower case), [data-primary] for Enter.
// Only buttons that are switched on count. Returns true when it pressed one.
export function pressFor(root: ParentNode | null, k: Exclude<KeyIntent, null | 'back'>) {
  const sel = k === 'enter' ? '[data-primary]:not([disabled])' : 'letter' in k ? `[data-letter="${k.letter}"]:not([disabled])` : `[data-pick="${k.pick}"]:not([disabled])`;
  const b = root?.querySelector<HTMLElement>(sel);
  if (!b) return false;
  b.click();
  return true;
}
