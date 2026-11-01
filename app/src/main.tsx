import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { SAMPLE_PATH, allLessons, recordResult } from './path';
import { PathMap } from './PathMap';
import { LessonPlayer } from './LessonPlayer';
import { SettingsScreen } from './SettingsScreen';
import { loadState, saveState, EMPTY_STATE, type SaveState } from './storage';
import { FpsMeter } from './FpsMeter';
import { prefs } from './prefs';

function App() {
  const [state, setState] = useState<SaveState | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [notice, setNotice] = useState('');
  const loaded = useRef(false);

  useEffect(() => { loadState().then(({ state, recovered }) => {
    loaded.current = true; setState(state);
    if (recovered) setNotice('Your save file was damaged, so I restored your latest backup.');
  }); }, []);
  // Save after every change (never before the first load finished, or we'd overwrite real progress with blanks).
  useEffect(() => { if (state && loaded.current) saveState(state); }, [state]);

  const s = state ?? EMPTY_STATE;
  prefs.sounds = s.settings.sounds; prefs.reduceMotion = s.settings.reduceMotion;
  const dark = s.settings.theme === 'dark';
  useEffect(() => { document.body.style.background = dark ? '#1b2530' : '#f4f8fb'; document.body.style.color = dark ? '#e8eef4' : '#222'; }, [dark]);
  if (!state) return null;

  const lesson = allLessons(SAMPLE_PATH).find(l => l.id === playing);
  // 'never' (not 'user'): don't let Windows' own animation-effects switch silently flatten the animations. Only the in-app switch does.
  return (
    <MotionConfig reducedMotion={s.settings.reduceMotion ? 'always' : 'never'}>
      {s.settings.showFps && <FpsMeter />}
      <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>
        {notice && <p data-testid="notice" style={{ margin: 0, padding: 8, background: '#fff3c4', color: '#333', textAlign: 'center' }}>{notice}</p>}
        {lesson ? (
          <LessonPlayer key={lesson.id} lesson={lesson} onQuit={() => setPlaying(null)}
            onFinish={stars => { setState(p => p && { ...p, progress: recordResult(p.progress, lesson.id, stars) }); setPlaying(null); }} />
        ) : showSettings ? (
          <SettingsScreen settings={s.settings} onChange={settings => setState(p => p && { ...p, settings })} onBack={() => setShowSettings(false)} />
        ) : (
          <>
            <div style={{ textAlign: 'right', padding: '12px 16px 0' }}>
              <button data-testid="open-settings" aria-label="Settings" onClick={() => setShowSettings(true)}
                style={{ border: 0, background: 'transparent', fontSize: 24, cursor: 'pointer' }}>⚙️</button>
            </div>
            <PathMap units={SAMPLE_PATH} progress={s.progress} onStart={setPlaying} />
          </>
        )}
      </div>
    </MotionConfig>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
