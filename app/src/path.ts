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
