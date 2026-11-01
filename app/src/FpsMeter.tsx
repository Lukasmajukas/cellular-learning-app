import { useEffect, useState } from 'react';

// A small corner badge that shows how many pictures per second the screen draws (about 60 = smooth).
// It counts animation frames and updates twice a second. Only mounted when the ⚙️ switch is on.
export function FpsMeter() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0, start = performance.now(), id = 0;
    const tick = (t: number) => {
      frames++;
      if (t - start >= 500) { setFps(Math.round((frames * 1000) / (t - start))); frames = 0; start = t; }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return <div data-testid="fps" style={{ position: 'fixed', left: 8, bottom: 8, zIndex: 1000, padding: '2px 8px', borderRadius: 8,
    background: 'rgba(0,0,0,.65)', color: '#fff', font: '12px monospace', pointerEvents: 'none' }}>{fps} fps</div>;
}
