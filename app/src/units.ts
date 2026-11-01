// The real lessons (written in content/lessons/*.yaml, built into content/lessons.json by content/tools/build_lessons.py).
import lessons from '../../content/lessons.json';
import { resolveLesson, type Def } from './resolve';
import { DATA } from './sampleLessons';
import type { Unit } from './path';

type Raw = { units: { id: string; title: string; lessons: { id: string; title: string; questions: Def[] }[] }[] };
export const REAL_PATH: Unit[] = (lessons as unknown as Raw).units.map(u => ({
  id: u.id, title: u.title,
  lessons: u.lessons.map(l => ({ id: l.id, title: l.title, questions: resolveLesson(l.questions, DATA) })),
}));
