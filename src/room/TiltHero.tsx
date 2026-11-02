'use client';
/*
 * Phones and portrait tablets: the hero is the room itself. It drifts slowly; drag to look, or tap
 * "Tilt to look around" and turn the phone (iPhone and newer Android ask once). Updates its own
 * styles every frame, so it never re-renders the page.
 *
 * Opening: the little planet turns on cream, then grows and opens out into the room; the text
 * rises in last. Waits for the images (never more than 4s), and is skipped for reduced motion, when
 * the page opens part-way down, and after the end-of-page turn-around.
 */
import { useEffect, useRef, useState } from 'react';
import { images } from '@/content/site';
import { heroPlanetSrc } from '@/content/assets';

const load = (src: string) => new Promise<void>((res) => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; });

const RATIO = 5200 / 1155;

export default function TiltHero() {
  const pano = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const deg = useRef<HTMLElement>(null);
  const st = useRef({ yaw: 40, pitch: 0, tYaw: 40, tPitch: 0, base: null as number | null, drag: null as null | { x: number; y: number; yaw: number; pitch: number }, idle: 0 });
  const [live, setLive] = useState(false);
  const [hint, setHint] = useState('Or drag the room with your finger.');
  const liveRef = useRef(false);
  const sec = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<'wait' | 'grow' | 'done'>('wait');

  useEffect(() => {
    const el = sec.current; if (!el) return;
    const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY > 40;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let started = false;
    const finish = () => { timers.forEach(clearTimeout); started = true; setPhase('done'); };
    window.addEventListener('vantedge:turned', finish);
    if (skip) finish();
    else {
      const go = () => {
        if (started) return; started = true;
        // grow until the planet covers the whole screen
        const pl = el.querySelector<HTMLElement>('.th-planet');
        const size = pl?.offsetWidth || 300, diag = Math.hypot(el.offsetWidth, el.offsetHeight);
        el.style.setProperty('--grow', ((diag / size) * 1.15).toFixed(3));
        timers.push(setTimeout(() => setPhase('grow'), 900));
        timers.push(setTimeout(() => setPhase('done'), 3200));
      };
      Promise.all([load(heroPlanetSrc), load(images.panoStrip)]).then(go);
      timers.push(setTimeout(go, 4000));
    }
    return () => { timers.forEach(clearTimeout); window.removeEventListener('vantedge:turned', finish); };
  }, []);

  // one stable listener: it only reads refs and state setters
  const onOri = useRef((e: DeviceOrientationEvent) => {
    const s = st.current;
    if (e.alpha == null || s.drag) return;
    if (!liveRef.current) { liveRef.current = true; setLive(true); setHint('Turn around. The room turns with you.'); }
    if (s.base == null) s.base = e.alpha + s.tYaw;
    let t = s.base - e.alpha;
    while (t - s.yaw > 180) t -= 360; while (t - s.yaw < -180) t += 360;
    s.tYaw = t;
    if (e.beta != null) s.tPitch = Math.max(-18, Math.min(18, (e.beta - 80) * 0.45));
  }).current;

  useEffect(() => {
    const s = st.current, el = pano.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.idle = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) return; // scrolled away: nothing to draw
      if (!liveRef.current && !s.drag && !reduce && now - s.idle > 2500 && !el.closest('.th-wait')) s.tYaw += 0.02;
      s.yaw += (s.tYaw - s.yaw) * 0.12; s.pitch += (s.tPitch - s.pitch) * 0.12;
      const w = el.offsetHeight * RATIO;
      const x = -((((s.yaw % 360) + 360) % 360) / 360) * w + window.innerWidth / 2;
      el.style.backgroundPosition = `${x.toFixed(1)}px ${(50 + s.pitch).toFixed(2)}%`;
      const d = Math.round((((s.yaw % 360) + 360) % 360));
      if (deg.current) { deg.current.textContent = d + '°'; deg.current.style.transform = `rotate(${d}deg)`; }
      if (ring.current) ring.current.style.transform = `rotate(${-d}deg)`;
    };
    raf = requestAnimationFrame(frame);
    const down = (e: PointerEvent) => { s.drag = { x: e.clientX, y: e.clientY, yaw: s.tYaw, pitch: s.tPitch }; try { el.setPointerCapture(e.pointerId); } catch { /* */ } };
    const move = (e: PointerEvent) => {
      if (!s.drag) return;
      const h = el.offsetHeight, w = h * RATIO;
      s.tYaw = s.drag.yaw - ((e.clientX - s.drag.x) / w) * 360;
      s.tPitch = Math.max(-18, Math.min(18, s.drag.pitch - ((e.clientY - s.drag.y) / h) * 60));
    };
    const up = () => { s.drag = null; s.base = null; s.idle = performance.now(); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      window.removeEventListener('deviceorientation', onOri);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const start = async () => {
    try {
      const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof D.requestPermission === 'function' && (await D.requestPermission().catch(() => 'prompt')) === 'denied') {
        setHint('Motion is off for this page. Drag the room instead.'); return;
      }
      window.removeEventListener('deviceorientation', onOri);
      window.addEventListener('deviceorientation', onOri);
      setTimeout(() => { if (!liveRef.current) setHint('No motion here. Drag the room instead.'); }, 1500);
    } catch { setHint('Drag the room to look around.'); }
  };

  return (
    <section className={`th th-${phase}${live ? ' live' : ''}`} ref={sec} id="top" aria-label="Introduction">
      <div className="th-pano" ref={pano} role="img" aria-label="360° view of a colonnaded hall. Drag to look around." />
      <div className="th-shade" aria-hidden="true" />
      <div className="th-intro" aria-hidden="true"><div className="th-planet"><img src={heroPlanetSrc} alt="" draggable={false} /></div></div>
      <header className="th-top">
        <a className="th-logo" href="#top"><img src={images.logoGold} alt="VantEdge360" width={40} height={24} /><span>VANTEDGE</span></a>
        <a className="th-cta" href="#contact">Book a shoot</a>
      </header>
      <div className="th-hud" aria-hidden="true"><div className="th-ring" ref={ring}><i /><b ref={deg}>0°</b></div></div>
      <div className="th-bottom">
        <h1 className="cap">Step inside<br />before you arrive</h1>
        <p className="th-sub">360° virtual tours for Google Maps and your Business Profile.</p>
        <button className="th-go" type="button" onClick={start}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M3 9c-1 2-1 4 0 6M21 9c1 2 1 4 0 6" /></svg>
          Tilt to look around
        </button>
        <p className="th-hint" aria-live="polite">{hint}</p>
      </div>
    </section>
  );
}
