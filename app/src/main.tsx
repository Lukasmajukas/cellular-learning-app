import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SAMPLE_PATH, allLessons, recordResult } from './path';
import { PathMap } from './PathMap';
import { LessonPlayer, type LessonResult } from './LessonPlayer';
import { finishLesson, finishReview } from './finish';
import { buildReview, dueCount, REVIEW_ID } from './dailyReview';
import { liveStreak, dayKey, doneToday, repairable, repairStreak } from './gamify';
import { SettingsScreen } from './SettingsScreen';
import { loadState, saveState, EMPTY_STATE, type SaveState } from './storage';
import { FpsMeter } from './FpsMeter';
import { prefs } from './prefs';
import { MotionKit, screenGlide } from './theme/motion';
import { useKeys } from './keys';
import { AppShell, TABS, type TabId } from './ui/AppShell';
import { Button } from './ui';
import { TopBar, RepairCard } from './ui/TopBar';
import { ReviewScreen } from './ReviewScreen';
import { REAL_PATH } from './units';
import { HeatMap } from './HeatMapScreen';
import { buildHeatmap, type BandRow, type RawLesson } from './heatmap';
import { startChanges, pendingChanges, acknowledge, type Change } from './changes';
import rawChanges from '../../content/changes.json';
import rawLessons from '../../content/lessons.json';
import { DATA } from './sampleLessons';
import './theme/fonts';
import './theme/theme.css';
import { c, applyLook, COLUMN } from './theme';
import { Icon } from './Icon';
import { BlocksSheet } from './BlocksSheet';

applyLook('night'); // before the first paint, so the window never flashes another look

// The real lessons, unless an automatic test asks for the samples (see electron/preload.cjs).
const CHANGES = (rawChanges as { changes: Change[] }).changes;
const PATH = (window as unknown as { cellApi?: { useSamplePath?: boolean } }).cellApi?.useSamplePath ? SAMPLE_PATH : REAL_PATH;
const order = (t: TabId) => TABS.findIndex(x => x.id === t);

function App() {
  const [state, setState] = useState<SaveState | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('path');
  const [dir, setDir] = useState(1); // which way the screens glide: 1 = the new tab is to the right
  const [notice, setNotice] = useState('');
  const loaded = useRef(false);

  useEffect(() => { loadState().then(({ state, recovered }) => {
    loaded.current = true; setState(startChanges(state, CHANGES));
    if (recovered) setNotice('Your save file was damaged, so I restored your latest backup.');
  }); }, []);
  // Save after every change (never before the first load finished, or we'd overwrite real progress with blanks).
  useEffect(() => { if (state && loaded.current) saveState(state); }, [state]);

  const s = state ?? EMPTY_STATE;
  prefs.sounds = s.settings.sounds;
  const look = s.settings.look, calm = s.settings.reduceMotion;
  useEffect(() => { applyLook(look); }, [look]);
  const go = (t: TabId) => { if (t === tab) return; setDir(order(t) > order(tab) ? 1 : -1); setTab(t); };
  // Esc on any other tab goes back to the path (in a lesson, the lesson player uses Esc itself).
  useKeys(k => { if (k !== 'back' || tab === 'path') return false; go('path'); return true; }, !!state && !playing);
  if (!state) return null;

  const card = pendingChanges(s, CHANGES)[0];
  const lesson = playing === REVIEW_ID ? buildReview(PATH, s.reviews, Date.now()) ?? undefined : allLessons(PATH).find(l => l.id === playing);
  const due = dueCount(PATH, s.reviews, Date.now());
  const now = new Date(), done = doneToday(s.game, now), goal = s.settings.dailyGoal, repair = repairable(s.game, now);

  // The top bar: streak, XP (and today's XP), streak freezes and the daily goal (redesign R07, src/ui/TopBar.tsx).
  const top = <TopBar streak={liveStreak(s.game, now)} xp={s.game.xp} xpToday={s.game.xpDay === dayKey(now) ? s.game.xpToday : 0}
    freezes={s.game.freezes} done={done} goal={goal} />;

  const screen = tab === 'review' ? <ReviewScreen due={due} onStart={() => setPlaying(REVIEW_ID)} />
    : tab === 'heatmap' ? <HeatMap cells={buildHeatmap(DATA.bands as unknown as BandRow[],
        (rawLessons as unknown as { units: { lessons: RawLesson[] }[] }).units.flatMap(u => u.lessons), s.reviews, Date.now())} />
    : tab === 'settings' ? <SettingsScreen settings={s.settings} onChange={settings => setState(p => p && { ...p, settings })} />
    : <>
        {repair > 0 && <div style={{ maxWidth: COLUMN, margin: '0 auto', padding: '12px 20px 0', boxSizing: 'border-box' }}>
          <RepairCard days={repair} onRepair={() => setState(p => p && { ...p, game: repairStreak(p.game, new Date()) })} /></div>}
        <PathMap units={PATH} progress={s.progress} onStart={setPlaying} due={due} onReview={() => setPlaying(REVIEW_ID)} />
      </>;

  // A lesson fills the window and rises from below; leaving it, it sinks and the frame fades back in.
  // Switching tabs, the screen glides sideways (towards the tab you picked). See screenGlide in the speed file.
  // A new screen starts at the top, except the path: it opens at your current lesson by itself (R05). Motion calls this
  // after the new screen has appeared, so resetting here too would undo the path's own scroll.
  const toTop = () => { if (lesson || tab !== 'path') window.scrollTo(0, 0); };
  return (
    <MotionKit calm={calm}>
      {s.settings.showFps && <FpsMeter />}
      <AnimatePresence mode="wait" initial={false} onExitComplete={toTop}>
        {lesson ? (
          <motion.div key={`lesson-${lesson.id}`} data-testid="lesson-screen" {...screenGlide('lesson', calm)}>
            <LessonPlayer key={lesson.id} lesson={lesson} onQuit={() => setPlaying(null)}
              onFinish={r => { setState(p => p && (lesson.id === REVIEW_ID ? finishReview(p, r) : finishLesson(p, lesson.id, r))); setPlaying(null); }} />
          </motion.div>
        ) : (
          <motion.div key="frame" {...screenGlide('frame', calm)}>
            <AppShell tab={tab} onTab={go} top={top} badges={{ review: due }}>
              {notice && <p data-testid="notice" style={{ margin: 0, padding: 8, background: c.noticeBg, color: c.notice, textAlign: 'center' }}>{notice}</p>}
              {card && (
                <div data-testid="change-card" style={{ maxWidth: COLUMN - 40, margin: '16px auto 0', padding: 16, borderRadius: 16, background: c.surface2, border: `1px solid ${c.signal}` }}>
                  <div style={{ fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="waves" size={22} style={{ color: c.signal }} />This changed: {card.title}</div>
                  <p style={{ margin: '8px 0' }}>{card.text}</p>
                  <div style={{ fontSize: 12, color: c.textMuted }}>{card.date} · {card.source}{card.questions?.length ? ` · ${card.questions.length} question(s) will come back for review` : ''}</div>
                  <Button full data-testid="change-ok" style={{ marginTop: 10 }} onClick={() => setState(p => p && acknowledge(p, card))}>Got it</Button>
                </div>)}
              <AnimatePresence mode="wait" initial={false} custom={dir} onExitComplete={toTop}>
                <motion.div key={tab} data-testid={`screen-${tab}`} custom={dir} {...screenGlide('tab', calm)}>{screen}</motion.div>
              </AnimatePresence>
            </AppShell>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionKit>
  );
}
// #blocks shows every building block on one page (for the gallery and click tests), instead of the app.
createRoot(document.getElementById('root')!).render(location.hash === '#blocks' ? <BlocksSheet /> : <App />);
