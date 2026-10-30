'use client';
/* 1 · Inside the cylinder: panels sit on the inner wall of a ring; scrolling turns your head. */
import { useRef } from 'react';
import Panels, { PANELS } from './Panels';
import LabNav from './LabNav';
import { useLoop } from './useLoop';

const N = PANELS.length;

export default function Cylinder() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  useLoop(track, (p) => {
    const W = window.innerWidth, H = window.innerHeight;
    const pw = W < 700 ? W * 0.86 : Math.min(W * 0.62, 1040);
    const step = 360 / N;
    const R = pw / (2 * Math.tan(Math.PI / N));
    const P = R * 1.55;
    const turn = p * step * (N - 1);
    if (stage.current) stage.current.style.perspective = `${P}px`;
    if (ring.current) ring.current.style.transform = `translateZ(${R}px) rotateY(${turn}deg)`;
    els.current.forEach((el, i) => {
      if (!el) return;
      let d = ((i * step - turn) % 360 + 540) % 360 - 180; // angle from straight ahead
      el.style.width = `${pw}px`;
      el.style.height = `${Math.min(H * 0.78, 760)}px`;
      el.style.transform = `translate(-50%, -50%) rotateY(${-i * step}deg) translateZ(${-R}px)`;
      el.style.opacity = Math.abs(d) > 95 ? '0' : '1';
      el.style.filter = `brightness(${1 - Math.min(0.08, Math.abs(d) / 900)})`;
      void d;
    });
  });
  return (
    <div className="xl lab-cyl">
      <LabNav cur="cylinder" />
      <div className="lab-track" ref={track} style={{ height: `${N * 120}vh` }}>
        <div className="lab-sticky lab-cyl-stage" ref={stage}>
          <div className="lab-ring" ref={ring}>
            <Panels refs={(i) => (el) => { els.current[i] = el; }} />
          </div>
        </div>
      </div>
    </div>
  );
}
