'use client';
/* 4 · A room behind everything: a real 360° panorama turns slowly behind floating content cards. */
import { useRef } from 'react';
import Panels, { PANELS } from './Panels';
import LabNav from './LabNav';
import { useLoop } from './useLoop';

const N = PANELS.length;
const RATIO = 5200 / 1155; // panorama strip width / height

export default function Room() {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  useLoop(track, (p) => {
    const W = window.innerWidth, H = window.innerHeight;
    const stripW = H * 1.12 * RATIO; // one full 360° turn of the room
    if (row.current) row.current.style.transform = `translateX(${-p * (N - 1) * W}px)`;
    els.current.forEach((el) => { if (el) el.style.width = `${W}px`; });
    // the room turns exactly once over the whole scroll, slower than the cards
    if (bg.current) bg.current.style.backgroundPosition = `${-p * stripW}px 50%`;
  });
  return (
    <div className="xl lab-room">
      <LabNav cur="room" dark />
      <div className="lab-track" ref={track} style={{ height: `${N * 110}vh` }}>
        <div className="lab-sticky">
          <div className="lab-room-bg" ref={bg} aria-hidden="true" />
          <div className="lab-row" ref={row}>
            <Panels refs={(i) => (el) => { els.current[i] = el; }} />
          </div>
        </div>
      </div>
    </div>
  );
}
