import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SAMPLE_PATH, allLessons, lessonStatus } from './path';
import { PathMap } from './PathMap';
import { LessonPlayer, type LessonResult } from './LessonPlayer';
import { finishLesson, finishReview } from './finish';
import { buildReview, dueCount, reviewOutlook, REVIEW_ID } from './dailyReview';
import { liveStreak, dayKey, doneToday, repairable, repairStreak } from './gamify';
import { SettingsScreen } from './SettingsScreen';
import { loadState, saveState, backupWhen, volumeOf, EMPTY_STATE, type SaveState } from './storage';
import { play, prepareSounds } from './sound';
import { FpsMeter } from './FpsMeter';
import { prefs } from './prefs';
import { MotionKit, screenGlide, noticeShift, TOP_BAR } from './theme/motion';
import { useKeys } from './keys';
import { AppShell, TABS, type TabId } from './ui/AppShell';
import { TopBar, RepairCard } from './ui/TopBar';
import { ReviewScreen } from './ReviewScreen';
import { REAL_PATH } from './units';
import { HeatMap } from './HeatMapScreen';
import { buildHeatmap, lessonsByBand, type BandRow, type RawUnit } from './heatmap';
import { startChanges, pendingChanges, acknowledge, type Change } from './changes';
import rawChanges from '../../content/changes.json';
import rawLessons from '../../content/lessons.json';
import { DATA } from './sampleLessons';
import './theme/fonts';
import './theme/theme.css';
import { applyLook, COLUMN, type Look } from './theme';
import { Notices } from './Notices';
import { BlocksSheet } from './BlocksSheet';
import { LookFade } from './ui/LookFade';

// The real lessons, unless an automatic test asks for the samples (see electron/preload.cjs); the same for "This changed" cards.
const TEST = (window as unknown as { cellApi?: { useSamplePath?: boolean; testChanges?: Change[]; look?: Look } }).cellApi;
// The saved look, before the first paint (R20: the main process reads it from the save file before the window opens),
// so the window never flashes the other look. In a plain browser (no app around it) it's Night.
applyLook(TEST?.look === 'day' ? 'day' : 'night');
const CHANGES = TEST?.testChanges ?? (rawChanges as { changes: Change[] }).changes;
const PATH = TEST?.useSamplePath ? SAMPLE_PATH : REAL_PATH;
const order = (t: TabId) => TABS.findIndex(x => x.id === t);
// The heatmap's bands come from the real lessons' fact tags (each question lists the bands it asks about).
const RAW_UNITS = (rawLessons as unknown as { units: RawUnit[] }).units;
const RAW_LESSONS = RAW_UNITS.flatMap(u => u.lessons);
const BAND_LESSONS = lessonsByBand(RAW_UNITS);
const IN_PATH = new Set(allLessons(PATH).map(l => l.id));

function App() {
  const [state, setState] = useState<SaveState | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('path');
  const [dir, setDir] = useState(1); // which way the screens glide: 1 = the new tab is to the right
  const [restored, setRestored] = useState<string | null>(null); // the "your progress is safe" notice (null = not shown)
  // True right after a lesson's first finish: the path plays "coming on air" then, so the top bar waits for it (R07).
  const [handOver, setHandOver] = useState(false);
  const loaded = useRef(false);

  useEffect(() => { loadState().then(({ state, recovered, backupDay }) => {
    loaded.current = true; setState(startChanges(state, CHANGES));
    if (recovered) setRestored(backupWhen(backupDay));
  }); }, []);
  // Save after every change (never before the first load finished, or we'd overwrite real progress with blanks).
  useEffect(() => { if (state && loaded.current) saveState(state); }, [state]);

  const s = state ?? EMPTY_STATE;
  prefs.sounds = s.settings.sounds; prefs.volume = volumeOf(s.settings);
  const look = s.settings.look, calm = s.settings.reduceMotion;
  // Only once the save has loaded: before that, `s` is the blank state (Night), and a Day user would see Night flash (R20).
  const ready = !!state;
  useEffect(() => { if (ready) applyLook(look); }, [look, ready]);
  // Starting the daily review gives a radar ping (R19), from the Review tab or the path's review card.
  const startReview = () => { play('review'); setPlaying(REVIEW_ID); };
  const go = (t: TabId) => { if (t === tab) return; setDir(order(t) > order(tab) ? 1 : -1); setTab(t); };
  // Esc on any other tab goes back to the path (in a lesson, the lesson player uses Esc itself).
  useKeys(k => { if (k !== 'back' || tab === 'path') return false; go('path'); return true; }, !!state && !playing);
  if (!state) return null;

  const pending = pendingChanges(s, CHANGES), card = pending[0];
  const lesson = playing === REVIEW_ID ? buildReview(PATH, s.reviews, Date.now()) ?? undefined : allLessons(PATH).find(l => l.id === playing);
  const due = dueCount(PATH, s.reviews, Date.now());
  const now = new Date(), done = doneToday(s.game, now), goal = s.settings.dailyGoal, repair = repairable(s.game, now);

  // The top bar: streak, XP (and today's XP), streak freezes and the daily goal (redesign R07, src/ui/TopBar.tsx).
  const top = <TopBar streak={liveStreak(s.game, now)} xp={s.game.xp} xpToday={s.game.xpDay === dayKey(now) ? s.game.xpToday : 0}
    freezes={s.game.freezes} done={done} goal={goal} wait={handOver ? TOP_BAR.afterPath : TOP_BAR.wait} />;

  const screen = tab === 'review' ? <ReviewScreen outlook={reviewOutlook(PATH, s.reviews, Date.now())} onStart={startReview} onPath={() => go('path')} />
    : tab === 'heatmap' ? <HeatMap cells={buildHeatmap(DATA.bands as unknown as BandRow[], RAW_LESSONS, s.reviews, Date.now())} onStart={setPlaying}
        lessonsOf={band => (BAND_LESSONS[band] ?? []).map(l => ({ ...l, status: IN_PATH.has(l.id) ? lessonStatus(PATH, s.progress, l.id) : 'missing' }))} />
    : tab === 'settings' ? <SettingsScreen settings={s.settings} onChange={settings => setState(p => p && { ...p, settings })} />
    : <>
        {repair > 0 && <div style={{ maxWidth: COLUMN, margin: '0 auto', padding: '12px 20px 0', boxSizing: 'border-box' }}>
          <RepairCard days={repair} onRepair={() => { setHandOver(false); setState(p => p && { ...p, game: repairStreak(p.game, new Date()) }); }} /></div>}
        <PathMap units={PATH} progress={s.progress} onStart={setPlaying} due={due} onReview={startReview} />
      </>;

  // A lesson fills the window and rises from below; leaving it, it sinks and the frame fades back in.
  // Switching tabs, the screen glides sideways (towards the tab you picked). See screenGlide in the speed file.
  // A new screen starts at the top, except the path: it opens at your current lesson by itself (R05). Motion calls this
  // after the new screen has appeared, so resetting here too would undo the path's own scroll.
  const toTop = () => { if (lesson || tab !== 'path') window.scrollTo(0, 0); };
  return (
    <MotionKit calm={calm}>
      {s.settings.showFps && <FpsMeter />}
      <LookFade look={look} calm={calm} />
      <AnimatePresence mode="wait" initial={false} onExitComplete={toTop}>
        {lesson ? (
          <motion.div key={`lesson-${lesson.id}`} data-testid="lesson-screen" {...screenGlide('lesson', calm)}>
            <LessonPlayer key={lesson.id} lesson={lesson} onQuit={() => setPlaying(null)}
              onFinish={r => { setHandOver(lesson.id !== REVIEW_ID && !s.progress[lesson.id]);
                setState(p => p && (lesson.id === REVIEW_ID ? finishReview(p, r) : finishLesson(p, lesson.id, r))); setPlaying(null); }} />
          </motion.div>
        ) : (
          <motion.div key="frame" {...screenGlide('frame', calm)}>
            <AppShell tab={tab} onTab={go} top={top} badges={{ review: due }}>
              <Notices restored={restored} onCloseRestored={() => setRestored(null)} change={card} changeOf={pending.length}
                onChangeOk={() => card && setState(p => p && acknowledge(p, card))} />
              {/* When a notice closes, the page glides up into its space instead of jumping (R13, NOTICE.shift). */}
              <motion.div layout="position" transition={noticeShift(calm)}>
                <AnimatePresence mode="wait" initial={false} custom={dir} onExitComplete={toTop}>
                  <motion.div key={tab} data-testid={`screen-${tab}`} custom={dir} {...screenGlide('tab', calm)}>{screen}</motion.div>
                </AnimatePresence>
              </motion.div>
            </AppShell>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionKit>
  );
}
// #blocks shows every building block on one page (for the gallery and click tests), instead of the app.
prepareSounds();
createRoot(document.getElementById('root')!).render(location.hash === '#blocks' ? <BlocksSheet /> : <App />);
