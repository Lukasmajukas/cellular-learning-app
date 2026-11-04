import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
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
import { REAL_PATH } from './units';
import { HeatMap } from './HeatMapScreen';
import { buildHeatmap, type BandRow, type RawLesson } from './heatmap';
import { startChanges, pendingChanges, acknowledge, type Change } from './changes';
import rawChanges from '../../content/changes.json';
import rawLessons from '../../content/lessons.json';
import { DATA } from './sampleLessons';
import './theme/fonts';
import './theme/theme.css';
import { c, applyLook, mono, COLUMN } from './theme';

applyLook('night'); // before the first paint, so the window never flashes another look

// The real lessons, unless an automatic test asks for the samples (see electron/preload.cjs).
const CHANGES = (rawChanges as { changes: Change[] }).changes;
const PATH = (window as unknown as { cellApi?: { useSamplePath?: boolean } }).cellApi?.useSamplePath ? SAMPLE_PATH : REAL_PATH;

function App() {
  const [state, setState] = useState<SaveState | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHeat, setShowHeat] = useState(false);
  const [notice, setNotice] = useState('');
  const loaded = useRef(false);

  useEffect(() => { loadState().then(({ state, recovered }) => {
    loaded.current = true; setState(startChanges(state, CHANGES));
    if (recovered) setNotice('Your save file was damaged, so I restored your latest backup.');
  }); }, []);
  // Save after every change (never before the first load finished, or we'd overwrite real progress with blanks).
  useEffect(() => { if (state && loaded.current) saveState(state); }, [state]);

  const s = state ?? EMPTY_STATE;
  prefs.sounds = s.settings.sounds; prefs.reduceMotion = s.settings.reduceMotion;
  const look = s.settings.look;
  useEffect(() => { applyLook(look); }, [look]);
  if (!state) return null;

  const card = pendingChanges(s, CHANGES)[0];
  const lesson = playing === REVIEW_ID ? buildReview(PATH, s.reviews, Date.now()) ?? undefined : allLessons(PATH).find(l => l.id === playing);
  // 'never' (not 'user'): don't let Windows' own animation-effects switch silently flatten the animations. Only the in-app switch does.
  return (
    <MotionConfig reducedMotion={s.settings.reduceMotion ? 'always' : 'never'}>
      {s.settings.showFps && <FpsMeter />}
      <div>
        {notice && <p data-testid="notice" style={{ margin: 0, padding: 8, background: c.noticeBg, color: c.notice, textAlign: 'center' }}>{notice}</p>}
        {card && !lesson && (
          <div data-testid="change-card" style={{ maxWidth: COLUMN - 40, margin: '16px auto 0', padding: 16, borderRadius: 16, background: c.surface2, border: `1px solid ${c.signal}` }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>📢 This changed: {card.title}</div>
            <p style={{ margin: '8px 0' }}>{card.text}</p>
            <div style={{ fontSize: 12, color: c.textMuted }}>{card.date} · {card.source}{card.questions?.length ? ` · ${card.questions.length} question(s) will come back for review` : ''}</div>
            <button data-testid="change-ok" onClick={() => setState(p => p && acknowledge(p, card))}
              style={{ marginTop: 10, width: '100%', padding: 10, border: 0, borderRadius: 14, background: c.signal, color: c.onBright, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Got it</button>
          </div>)}
        {lesson ? (
          <LessonPlayer key={lesson.id} lesson={lesson} onQuit={() => setPlaying(null)}
            onFinish={r => { setState(p => p && (lesson.id === REVIEW_ID ? finishReview(p, r) : finishLesson(p, lesson.id, r))); setPlaying(null); }} />
        ) : showHeat ? (
          <HeatMap onBack={() => setShowHeat(false)} cells={buildHeatmap(DATA.bands as unknown as BandRow[],
            (rawLessons as unknown as { units: { lessons: RawLesson[] }[] }).units.flatMap(u => u.lessons), s.reviews, Date.now())} />
        ) : showSettings ? (
          <SettingsScreen settings={s.settings} onChange={settings => setState(p => p && { ...p, settings })} onBack={() => setShowSettings(false)} />
        ) : (
          <>
            <div style={{ maxWidth: COLUMN, margin: '0 auto', textAlign: 'right', padding: '12px 16px 0', boxSizing: 'border-box' }}>
              <button data-testid="open-heatmap" aria-label="Band memory heatmap" onClick={() => setShowHeat(true)}
                style={{ border: 0, background: 'transparent', fontSize: 24, cursor: 'pointer' }}>🌡️</button>
              <button data-testid="open-settings" aria-label="Settings" onClick={() => setShowSettings(true)}
                style={{ border: 0, background: 'transparent', fontSize: 24, cursor: 'pointer' }}>⚙️</button>
            </div>
            <div data-testid="hud" style={{ display: 'flex', justifyContent: 'center', gap: 18, fontSize: 18, ...mono }}>
              <span data-testid="streak" style={{ color: c.streak }}>🔥 {liveStreak(s.game, new Date())}</span><span data-testid="xp-total" style={{ color: c.signal }}>⚡ {s.game.xp} XP</span>
              <span data-testid="xp-today" style={{ color: c.textMuted }}>today {s.game.xpToday && s.game.xpDay === dayKey(new Date()) ? s.game.xpToday : 0}</span>
            </div>
            <div data-testid="goal" style={{ maxWidth: COLUMN, margin: '10px auto 0', padding: '0 20px', boxSizing: 'border-box' }}>
              <div style={{ fontSize: 14, marginBottom: 4, color: c.textMuted }} data-testid="goal-text">
                Daily goal: {Math.min(doneToday(s.game, new Date()), s.settings.dailyGoal)} of {s.settings.dailyGoal}{doneToday(s.game, new Date()) >= s.settings.dailyGoal ? ' ✅' : ''}
                {s.game.freezes > 0 && <span data-testid="freezes" style={{ float: 'right' }}>🧊 {s.game.freezes}</span>}
              </div>
              <div style={{ height: 10, borderRadius: 5, background: c.track, overflow: 'hidden' }}>
                <div data-testid="goal-bar" style={{ height: '100%', width: `${Math.min(100, (100 * doneToday(s.game, new Date())) / s.settings.dailyGoal)}%`, background: c.onAir, transition: s.settings.reduceMotion ? 'none' : 'width .4s' }} />
              </div>
              {repairable(s.game, new Date()) > 0 && (
                <button data-testid="repair" onClick={() => setState(p => p && { ...p, game: repairStreak(p.game, new Date()) })}
                  style={{ marginTop: 10, width: '100%', padding: 10, border: 0, borderRadius: 12, background: c.streak, color: c.onBright, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                  🛠 Repair your streak ({repairable(s.game, new Date())} days)</button>)}
            </div>
            <PathMap units={PATH} progress={s.progress} onStart={setPlaying} due={dueCount(PATH, s.reviews, Date.now())} onReview={() => setPlaying(REVIEW_ID)} />
          </>
        )}
      </div>
    </MotionConfig>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
