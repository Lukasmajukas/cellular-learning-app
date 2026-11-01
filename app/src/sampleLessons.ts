// Demo lesson for the new question types. The numbers all come from content/bands.json (nothing typed by hand).
// It is a sample: the real units 1 to 3 are task T33.
import bands from '../../content/bands.json';
import { resolveLesson, type Def } from './resolve';
import type { Data } from './templates';
import type { Item } from './questions';

export const DATA = bands as unknown as Data;
export const TYPES_DEMO: Def[] = [
  { id: 'demo-learn-01', kind: 'learn', facts: ['band:B71', 'band:n71'], title: 'What is a band?',
    text: 'A band is a stretch of radio frequencies with a number for its name. B71 sends to your phone on {band:B71.dl_low_mhz} to {band:B71.dl_high_mhz} MHz. "B" means 4G. "n" means 5G, and n71 uses the very same space.', show: ['B71'] },
  { id: 'demo-choice-01', kind: 'choice', facts: ['band:n71'], prompt: 'Your phone shows "n71". Is that 4G or 5G?', choices: ['5G (NR)', '4G (LTE)'], answer: 0,
    why: 'Bands starting with "n" are 5G. The bands file files n71 under {band:n71.kind}, a 5G (NR) band.' },
  { id: 'demo-number-01', kind: 'number', facts: ['band:B71'], prompt: 'B71 sends downlink starting at how many MHz? (type the number)', answer_from: 'band:B71.dl_low_mhz', tolerance_mhz: 5, unit: 'MHz',
    why: "B71's downlink is {band:B71.dl_low_mhz} to {band:B71.dl_high_mhz} MHz." },
  { id: 'demo-match-01', kind: 'match', facts: ['band:B2', 'band:B4', 'band:B5'], prompt: 'Match each band to its nickname.',
    pairs: [['{band:B2.id}', '{band:B2.name}'], ['{band:B4.id}', '{band:B4.name}'], ['{band:B5.id}', '{band:B5.name}']],
    why: 'The nicknames come from the bands file.' },
  { id: 'demo-order-01', kind: 'order', facts: ['band:B71', 'band:B12', 'band:B5', 'band:B2'], prompt: 'Put these bands in order, lowest frequency first.',
    bands: ['B2', 'B71', 'B5', 'B12'], sort_by: 'dl_low_mhz', why: 'Sorted by where each downlink starts (MHz).' },
  { id: 'demo-carrier-01', kind: 'choice', facts: ['carrier_use:n71/tmobile', 'carrier_use:n71/boost'], prompt: 'Which of these runs 5G n71 (600 MHz) today?', choices: ['T-Mobile', 'Dish / Boost (it used to, then sold it)'], answer: 0,
    why: 'Carrier facts always show how sure we are and the date we checked.' },
];
export const typesDemoItems = (): Item[] => resolveLesson(TYPES_DEMO, DATA);
