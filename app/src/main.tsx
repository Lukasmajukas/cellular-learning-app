import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { SAMPLE_PATH, allLessons, recordResult, type Progress } from './path';
import { PathMap } from './PathMap';
import { LessonPlayer } from './LessonPlayer';

// Progress lives in memory only for now. Saving to a file is task T30.
function App() {
  const [progress, setProgress] = useState<Progress>({});
  const [playing, setPlaying] = useState<string | null>(null);
  const lesson = allLessons(SAMPLE_PATH).find(l => l.id === playing);
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      {lesson ? (
        <LessonPlayer key={lesson.id} lesson={lesson} onQuit={() => setPlaying(null)}
          onFinish={s => { setProgress(p => recordResult(p, lesson.id, s)); setPlaying(null); }} />
      ) : (
        <PathMap units={SAMPLE_PATH} progress={progress} onStart={setPlaying} />
      )}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
