'use client';
/*
 * 4 · A room behind everything: a real 360° panorama turns slowly behind floating content cards.
 * Wide landscape screens: sideways panels. Phones and portrait tablets: normal vertical scrolling,
 * while the room keeps turning behind the cards (one full turn over the whole page).
 */
import { useRef } from 'react';
import Panels, { PANELS } from './Panels';
import LabNav from './LabNav';
import { useLoop } from './useLoop';

const N = PANELS.length;
const RATIO = 5200 / 1155; // panorama strip width / height
export const VERTICAL = '(max-width: 1023px), (orientation: portrait) and (max-width: 1366px)';

export default function Room() {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const deg = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const mq = useRef<MediaQueryList | null>(null);
  useLoop(track, (p) => {
    if (!mq.current) mq.current = window.matchMedia(VERTICAL);
    const vertical = mq.current.matches;
    const W = window.innerWidth, H = window.innerHeight;
    const roomH = vertical ? H : H * 1.12;
    const stripW = roomH * RATIO; // one full 360° turn of the room
    // the room turns exactly once over the whole scroll, slower than the content
    if (strip.current) {
      strip.current.style.width = `${stripW * 2 + W}px`;
      strip.current.style.transform = `translate3d(${-(p * stripW) % stripW}px,0,0)`;
    }
    if (vertical) {
      if (row.current) row.current.style.transform = '';
      els.current.forEach((el) => { if (el) el.style.width = ''; });
      // heading readout: the panel nearest the middle of the screen
      let best = 0, bd = 1e9;
      els.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - H / 2);
        if (d < bd) { bd = d; best = i; }
      });
      if (label.current && label.current.textContent !== PANELS[best]) label.current.textContent = PANELS[best];
    } else {
      if (row.current) row.current.style.transform = `translateX(${-p * (N - 1) * W}px)`;
      els.current.forEach((el) => { if (el) el.style.width = `${W}px`; });
      if (label.current) label.current.textContent = PANELS[Math.min(N - 1, Math.round(p * (N - 1)))];
    }
    if (deg.current) deg.current.textContent = String(Math.round(p * 359)).padStart(3, '0') + '°';
  });
  return (
    <div className="xl lab-room">
      <LabNav cur="room" dark />
      <div className="lab-room-bg" aria-hidden="true"><div className="lab-room-strip" ref={strip} /></div>
      <div className="lab-track" ref={track} style={{ ['--th' as string]: `${N * 110}vh` }}>
        <div className="lab-sticky">
          <div className="lab-row" ref={row}>
            <Panels refs={(i) => (el) => { els.current[i] = el; }} />
          </div>
        </div>
      </div>
      <p className="lab-room-read" aria-hidden="true"><span ref={deg}>000°</span><i /><span ref={label}>Step inside</span></p>
    </div>
  );
}
