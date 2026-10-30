'use client';
/* 2 · Flat at rest, curved in motion: a sideways strip that bends into a cylinder while it moves. */
import { useRef } from 'react';
import Panels, { PANELS } from './Panels';
import LabNav from './LabNav';
import { useLoop } from './useLoop';

const N = PANELS.length;

export default function Curve() {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const bend = useRef(0);
  useLoop(track, (p, v) => {
    const W = window.innerWidth;
    const pw = W < 700 ? W * 0.84 : Math.min(W * 0.66, 1080);
    const gap = W < 700 ? 18 : 40;
    const total = N * pw + (N - 1) * gap;
    const x = W / 2 - pw / 2 - p * (total - pw);
    // how much to bend: follows scroll speed, eases back to flat when you stop
    const target = Math.min(1, Math.abs(v) * 260);
    bend.current += (target - bend.current) * 0.12;
    const b = bend.current;
    if (row.current) row.current.style.transform = `translateX(${x}px)`;
    els.current.forEach((el, i) => {
      if (!el) return;
      el.style.width = `${pw}px`;
      el.style.marginRight = `${gap}px`;
      const cx = x + i * (pw + gap) + pw / 2 - W / 2; // panel centre vs screen centre
      const c = Math.max(-2, Math.min(2, cx / (W / 2)));
      el.style.transform = `translateZ(${-Math.abs(c) * 220 * b}px) rotateY(${-c * 34 * b}deg) scale(${1 - 0.05 * b})`;
    });
  });
  return (
    <div className="xl lab-curve">
      <LabNav cur="curve" />
      <div className="lab-track" ref={track} style={{ height: `${N * 110}vh` }}>
        <div className="lab-sticky lab-curve-stage">
          <div className="lab-row" ref={row}>
            <Panels refs={(i) => (el) => { els.current[i] = el; }} />
          </div>
        </div>
      </div>
    </div>
  );
}
