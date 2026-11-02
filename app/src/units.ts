// The real lessons (written in content/lessons/*.yaml, built into content/lessons.json by content/tools/build_lessons.py).
import lessons from '../../content/lessons.json';
import { resolveLesson, type Def } from './resolve';
import { DATA as BASE } from './sampleLessons';
import type { Unit } from './path';
import type { Data, PhotoRow } from './templates';
// The bands file plus the photo credits list (so lessons can show a photo and its credit).
export const DATA: Data = { ...BASE, photos: (lessons as unknown as { photos?: PhotoRow[] }).photos ?? [] };

type Raw = { photos?: PhotoRow[]; units: { id: string; title: string; lessons: { id: string; title: string; questions: Def[] }[] }[] };
export const REAL_PATH: Unit[] = (lessons as unknown as Raw).units.map(u => ({
  id: u.id, title: u.title,
  lessons: u.lessons.map(l => ({ id: l.id, title: l.title, questions: resolveLesson(l.questions, DATA) })),
}));
