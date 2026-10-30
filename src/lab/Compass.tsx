'use client';
/* 3 · Compass heading bar: a straight sideways scroll with a Street View–style heading ruler. */
import { useRef } from 'react';
import Panels, { PANELS } from './Panels';
import LabNav from './LabNav';
import { useLoop } from './useLoop';

const N = PANELS.length;
const PX = 9; // pixels per degree on the ruler
const NAMES: Record<number, string> = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };

function Ruler() {
  const ticks = [];
  for (let d = -360; d <= 720; d += 5) {
    const n = ((d % 360) + 360) % 360;
    const major = n % 45 === 0, mid = n % 15 === 0;
    ticks.push(
      <g key={d} transform={`translate(${(d + 360) * PX},0)`}>
        <line y1={major ? 0 : mid ? 8 : 14} y2={26} stroke="currentColor" strokeWidth={major ? 1.4 : 1} opacity={major ? 1 : 0.55} />
        {major && <text y={44} textAnchor="middle">{NAMES[n]}</text>}
        {!major && mid && <text y={44} textAnchor="middle" className="sm">{String(n).padStart(3, '0')}</text>}
      </g>,
    );
  }
  return <svg className="lab-ruler-svg" width={1080 * PX + 2} height={50} aria-hidden="true">{ticks}</svg>;
}

export default function Compass() {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const deg = useRef<HTMLSpanElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  useLoop(track, (p) => {
    const W = window.innerWidth;
    const heading = p * (360 / N) * (N - 1);
    if (row.current) row.current.style.transform = `translateX(${-p * (N - 1) * W}px)`;
    els.current.forEach((el) => { if (el) el.style.width = `${W}px`; });
    if (ruler.current) ruler.current.style.transform = `translateX(${W / 2 - (heading + 360) * PX}px)`;
    if (deg.current) deg.current.textContent = String(Math.round(heading) % 360).padStart(3, '0') + '°';
    if (label.current) label.current.textContent = PANELS[Math.min(N - 1, Math.round(p * (N - 1)))];
  });
  return (
    <div className="xl lab-compass">
      <LabNav cur="compass" />
      <div className="lab-track" ref={track} style={{ height: `${N * 100}vh` }}>
        <div className="lab-sticky">
          <div className="lab-row" ref={row}>
            <Panels refs={(i) => (el) => { els.current[i] = el; }} />
          </div>
          <div className="lab-heading" aria-live="polite">
            <div className="lab-ruler"><div ref={ruler}><Ruler /></div></div>
            <div className="lab-needle" aria-hidden="true" />
            <p className="lab-read"><span ref={deg}>000°</span><i aria-hidden="true" /><span ref={label}>Step inside</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
