// The learning path: units hold lessons, lessons hold questions.
// The sample path below is a PLACEHOLDER (no real band facts). Real units come from content/ later (T31, T33).
import { SAMPLE_ITEMS } from './lesson';
import { typesDemoItems, picturesDemoItems } from './sampleLessons';
import type { Item } from './questions';

export type Lesson = { id: string; title: string; questions: Item[] };
export type Unit = { id: string; title: string; lessons: Lesson[] };
// lesson id -> best stars earned (1 to 3). A lesson not in the list has not been finished.
export type Progress = Record<string, number>;
export type Status = 'done' | 'current' | 'locked';

export const SAMPLE_PATH: Unit[] = [
  { id: 'u1', title: 'Sample unit A: the basics', lessons: [
    { id: 'u1-l1', title: 'Sample lesson 1', questions: SAMPLE_ITEMS },
    { id: 'u1-l2', title: 'Sample lesson 2', questions: SAMPLE_ITEMS },
    { id: 'u1-l3', title: 'Sample lesson 3', questions: SAMPLE_ITEMS },
  ] },
  { id: 'u2', title: 'Sample unit B: next steps', lessons: [
    { id: 'u2-l1', title: 'Sample lesson 4', questions: SAMPLE_ITEMS },
    { id: 'u2-l2', title: 'Sample lesson 5', questions: SAMPLE_ITEMS },
    { id: 'u2-l3', title: 'New question types (from the bands file)', questions: typesDemoItems() },
    { id: 'u2-l4', title: 'Picture questions (a drawing)', questions: picturesDemoItems() },
  ] },
];

export const allLessons = (units: Unit[]): Lesson[] => units.flatMap(u => u.lessons);

// Lessons unlock in order: a lesson is open once the one before it is finished.
export function lessonStatus(units: Unit[], progress: Progress, lessonId: string): Status {
  const list = allLessons(units);
  const i = list.findIndex(l => l.id === lessonId);
  if (i < 0) throw new Error(`Unknown lesson: ${lessonId}`);
  if (progress[lessonId] !== undefined) return 'done';
  return i === 0 || progress[list[i - 1].id] !== undefined ? 'current' : 'locked';
}

// Keeps the best star score; never lowers it.
export function recordResult(progress: Progress, lessonId: string, starsEarned: number): Progress {
  return { ...progress, [lessonId]: Math.max(progress[lessonId] ?? 0, starsEarned) };
}

// How many lessons are finished, out of all of them.
export const doneCount = (units: Unit[], progress: Progress) =>
  allLessons(units).filter(l => progress[l.id] !== undefined).length;

// --- The path map's layout (redesign R05) ---
// The lesson circles zig-zag: left, right, left... and each lesson's name sits beside its circle, on the open side.
export type Side = 'left' | 'right';
export const sideOf = (i: number): Side => (i % 2 ? 'right' : 'left');

// The lesson the map opens at: the current one (the next to do). If every lesson is done, the last one.
export function focusLessonId(units: Unit[], progress: Progress): string | undefined {
  const list = allLessons(units);
  return list.find(l => lessonStatus(units, progress, l.id) === 'current')?.id ?? list[list.length - 1]?.id;
}

// A unit is "done" when all its lessons are, "open" when one of them can be played, otherwise "locked".
export type UnitStatus = 'done' | 'open' | 'locked';
export function unitStatus(units: Unit[], progress: Progress, unitId: string): UnitStatus {
  const u = units.find(x => x.id === unitId);
  if (!u) throw new Error(`Unknown unit: ${unitId}`);
  const s = u.lessons.map(l => lessonStatus(units, progress, l.id));
  return s.every(x => x === 'done') ? 'done' : s.some(x => x !== 'locked') ? 'open' : 'locked';
}

// --- The path map's movement (redesign R06) ---
// "Coming on air": what changed since the path was last shown, so it can play the moment. Before = the progress the
// path last showed, after = now. Exactly one newly finished lesson gives a moment (none for a replay, which changes
// nothing new, or for a big jump such as a restored backup). It says which lesson came on air, which lesson it unlocked,
// whether that finished its whole unit, and whether it opened the next unit.
export type OnAir = { lesson: string; next?: string; unitDone?: string; unitOpened?: string };
export function onAirMoment(units: Unit[], before: Progress, after: Progress): OnAir | null {
  const list = allLessons(units);
  const fresh = list.filter(l => after[l.id] !== undefined && before[l.id] === undefined);
  if (fresh.length !== 1) return null;
  const lesson = fresh[0].id, i = list.findIndex(l => l.id === lesson);
  const unitOf = (id: string) => units.find(u => u.lessons.some(l => l.id === id))!;
  const n = list[i + 1];
  const next = n && lessonStatus(units, after, n.id) === 'current' ? n.id : undefined;
  const unit = unitOf(lesson);
  const unitDone = unitStatus(units, before, unit.id) !== 'done' && unitStatus(units, after, unit.id) === 'done' ? unit.id : undefined;
  const nu = next ? unitOf(next) : undefined;
  const unitOpened = nu && nu.id !== unit.id && unitStatus(units, before, nu.id) === 'locked' ? nu.id : undefined;
  return { lesson, next, unitDone, unitOpened };
}
