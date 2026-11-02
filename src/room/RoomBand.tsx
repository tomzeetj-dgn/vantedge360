'use client';
/*
 * Phones and portrait tablets: a band of the 360° room between sections. One room seen through
 * every band; scrolling down turns it about once over the page, each band a quarter turn further.
 * Updates its own style on scroll, so it never re-renders the page.
 */
import { memo, useEffect, useRef } from 'react';

const RATIO = 5200 / 1155;

function RoomBand({ i }: { i: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const b = el.current; if (!b) return;
    const img = b.querySelector<HTMLElement>('i'), lab = b.querySelector<HTMLElement>('b');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const draw = () => {
      raf = 0;
      if (!img || !lab) return;
      const r = b.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const yaw = (reduce ? 0 : (window.scrollY / max) * 360) + i * 90;
      const w = img.offsetHeight * RATIO;
      const par = reduce ? 0 : (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      img.style.backgroundPosition = `${(-(yaw / 360) * w).toFixed(1)}px ${(50 + par * 14).toFixed(2)}%`;
      lab.textContent = Math.round(((yaw % 360) + 360) % 360) + '°';
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [i]);
  return <div className="rband" ref={el} aria-hidden="true"><i /><b /></div>;
}

export default memo(RoomBand);
