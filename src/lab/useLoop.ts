'use client';
import { useEffect, useRef } from 'react';

/*
 * Turns the page's vertical scroll into a smoothed 0..1 progress for a tall
 * track element, and calls `frame` every animation frame with progress and
 * velocity. Native scrolling, keyboard and trackpads all keep working.
 */
export function useLoop(track: React.RefObject<HTMLElement | null>, frame: (p: number, v: number) => void) {
  const f = useRef(frame);
  f.current = frame;
  useEffect(() => {
    let raf = 0, cur = 0, vel = 0, first = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = () => {
      const el = track.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const tot = r.height - window.innerHeight;
        const target = tot > 0 ? Math.min(1, Math.max(0, -r.top / tot)) : 0;
        const next = first || reduce ? target : cur + (target - cur) * 0.1;
        first = false;
        vel = vel * 0.86 + (next - cur) * 0.14;
        cur = next;
        f.current(cur, vel);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [track]);
}
