import { review } from './fsrs';
import { recordDay } from './gamify';
import { recordResult } from './path';
import type { SaveState } from './storage';
import type { LessonResult } from './LessonPlayer';

// Saves a finished daily review: new review dates, streak and XP. No stars or path progress (it isn't a lesson).
export function finishReview(p: SaveState, r: LessonResult, now = new Date()): SaveState {
  const reviews = { ...p.reviews };
  for (const x of r.results) reviews[x.id] = review(reviews[x.id], x.ok, now.getTime());
  return { ...p, reviews, game: recordDay(p.game, r.xp, now) };
}

export // Saves a finished lesson: stars, review schedule for every question asked, streak and XP.
function finishLesson(p: SaveState, lessonId: string, r: LessonResult, now = new Date()): SaveState {
  const reviews = { ...p.reviews };
  for (const x of r.results) reviews[x.id] = review(reviews[x.id], x.ok, now.getTime());
  return { ...p, progress: recordResult(p.progress, lessonId, r.stars), reviews, game: recordDay(p.game, r.xp, now) };
}
