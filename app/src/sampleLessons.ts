// Demo lesson for the new question types. The numbers all come from content/bands.json (nothing typed by hand).
// It is a sample: the real units 1 to 3 are task T33.
import bands from '../../content/bands.json';
import { resolveLesson, type Def } from './resolve';
import type { Data } from './templates';
import type { Item } from './questions';

// A drawing made for the demo (not a photo): a monopole with antennas at the top.
export const DEMO_PHOTOS = [{ id: 'demo-drawing-01', file: 'demo-drawing-01.svg', title: 'Demo drawing of a monopole', author: 'Claude (own drawing)', licence: 'CC0' }];
export const DATA = { ...(bands as unknown as Data), photos: DEMO_PHOTOS } as Data;
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
  { id: 'demo-scenario-01', kind: 'scenario', facts: ['band:B71', 'band:B2'], prompt: 'Two clues from a phone screen. What does each one tell you?',
    clues: [
      { text: 'The band is B71', choices: ['Low band', 'Mid band'], answer: 0, why: 'B71 starts at {band:B71.dl_low_mhz} MHz, under 1000.' },
      { text: 'The band is B2', choices: ['Low band', 'Mid band'], answer: 1, why: 'B2 starts at {band:B2.dl_low_mhz} MHz, above 1000.' },
    ] },
];
export const typesDemoItems = (): Item[] => resolveLesson(TYPES_DEMO, DATA);

// Demo lesson for the picture question types (a drawing stands in until real photos are downloaded, T26).
export const PICTURES_DEMO: Def[] = [
  { id: 'demo-photo-01', kind: 'photo-choice', no_facts_needed: true, photo: 'demo-drawing-01', alt: 'A single tapered pole with antennas at the top',
    prompt: 'What type of tower is this?', choices: ['Lattice tower', 'Guyed mast', 'Monopole'], answer: 2, outline: { x: 0.4, y: 0.12, w: 0.2, h: 0.35 },
    why: 'One tapered pole with the antennas on top is a monopole.' },
  { id: 'demo-tap-01', kind: 'tap-clue', no_facts_needed: true, photo: 'demo-drawing-01', alt: 'A single tapered pole with antennas at the top',
    prompt: 'Tap the antennas.', clue: 'antennas', target: { x: 0.38, y: 0.12, w: 0.24, h: 0.35 }, why: 'Antennas sit in a bunch at the very top.' },
];
export const picturesDemoItems = (): Item[] => resolveLesson(PICTURES_DEMO, DATA);
