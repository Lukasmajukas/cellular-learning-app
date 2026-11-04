// Redesign R04: the keyboard keys promised in PRD 4e (1-4 and Enter), plus Esc.
import { describe, it, expect } from 'vitest';
import { keyIntent } from './keys';

const el = (tagName: string, more: Record<string, unknown> = {}) => ({ tagName, getAttribute: (n: string) => (more[n] as string) ?? null, ...more });
const press = (key: string, target: unknown = el('BODY'), extra: Record<string, boolean> = {}) => keyIntent({ key, target: target as EventTarget, ...extra });

describe('keys: what each key means', () => {
  it('1 to 9 pick that answer tile', () => {
    expect(press('1')).toEqual({ pick: 1 });
    expect(press('4')).toEqual({ pick: 4 });
    expect(press('9')).toEqual({ pick: 9 });
    expect(press('0')).toBeNull();
  });
  it('Enter = the main button; Esc = leave / back', () => {
    expect(press('Enter')).toBe('enter');
    expect(press('Escape')).toBe('back');
    expect(press('a')).toBeNull();
    expect(press(' ')).toBeNull(); // Space stays the normal "press the focused button" key
  });
  it('keys belong to a text box while you type in it (Enter sends its own form)', () => {
    const box = el('INPUT', { type: 'text' }), number = el('INPUT', { type: 'number' });
    for (const k of ['1', 'Enter', 'Escape']) { expect(press(k, box), k).toBeNull(); expect(press(k, number), k).toBeNull(); }
    expect(press('1', el('TEXTAREA'))).toBeNull();
    expect(press('1', { tagName: 'DIV', isContentEditable: true })).toBeNull();
    // After Check the number box is switched off, so Enter goes on to Continue.
    expect(press('Enter', el('INPUT', { type: 'text', disabled: true }))).toBe('enter');
  });
  it('Enter on a button you moved to with Tab presses that button, not the main one', () => {
    expect(press('Enter', el('BUTTON'))).toBeNull();
    expect(press('Enter', el('DIV', { role: 'switch' }))).toBeNull();
    expect(press('Enter', el('INPUT', { type: 'checkbox' }))).toBeNull();
    // ...but a button that is switched off (like the answer you just clicked) can't, so Enter goes to the main button.
    expect(press('Enter', el('BUTTON', { disabled: true }))).toBe('enter');
    // ...and neither does one you clicked with the mouse (no focus ring): Enter is still "Check" / "Continue" then.
    expect(keyIntent({ key: 'Enter', target: el('BUTTON') as unknown as EventTarget, focusByKeyboard: false })).toBe('enter');
    expect(keyIntent({ key: 'Enter', target: el('BUTTON') as unknown as EventTarget, focusByKeyboard: true })).toBeNull();
    // Numbers still pick, even with a button focused.
    expect(press('2', el('BUTTON'))).toEqual({ pick: 2 });
  });
  it('holding a key down, or Ctrl / Alt / Cmd with it, does nothing (no racing through a lesson)', () => {
    expect(press('Enter', el('BODY'), { repeat: true })).toBeNull();
    expect(press('1', el('BODY'), { ctrlKey: true })).toBeNull();
    expect(press('1', el('BODY'), { altKey: true })).toBeNull();
    expect(press('Enter', el('BODY'), { metaKey: true })).toBeNull();
  });
});
