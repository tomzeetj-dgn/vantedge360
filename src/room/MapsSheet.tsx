'use client';
/*
 * Phones and portrait tablets: "One shoot, then you're everywhere" as a full-screen room with a
 * Google Maps panel. Scrolling captures the room (slices close up), walks into it (Street View
 * arrows), then raises the place card and the results list. Everything follows the scroll and the
 * component updates its own styles, so it never re-renders the page.
 */
import { useEffect, useRef } from 'react';
import { steps } from '@/content/site';
import { LISTINGS, Stars } from './gcard';

const cl = (x: number) => Math.max(0, Math.min(1, x));
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const seg = (p: number, a: number, b: number) => io(cl((p - a) / (b - a)));
const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];

export default function MapsSheet() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current; if (!t) return;
    const q = <T extends Element = HTMLElement>(sel: string) => t.querySelector(sel) as unknown as T;
    const qa = (sel: string) => [...t.querySelectorAll<HTMLElement>(sel)];
    const sl = qa('.ms-sl'), caps = qa('.ms-c'), chevs = qa('.ms-chev');
    const fill = q('.ms-fill'), photo = q('.ms-photo'), sheet = q('.ms-sheet'), place = q('.ms-place'), list = q('.ms-list');
    const pill = q('.ms-search'), qtxt = q('.ms-q'), dim = q('.ms-dim'), capBox = q('.ms-cap');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = -1, lastStep = -1, raf = 0;

    const IMG = 1200 / 880; // restaurant photo
    const fit = () => {
      const stage = t.querySelector<HTMLElement>('.ms-stage'); if (!stage) return;
      const W = stage.offsetWidth, H = stage.offsetHeight;
      const iw = W / H > IMG ? W : H * IMG, ih = W / H > IMG ? W / IMG : H;
      const ox = (W - iw) / 2, oy = (H - ih) / 2;
      sl.forEach((d, i) => { d.style.backgroundSize = `${iw}px ${ih}px`; d.style.backgroundPosition = `${ox - (i * W) / 8}px ${oy}px`; });
    };
    fit();
    const draw = () => {
      raf = 0;
      const r = t.getBoundingClientRect(), H = window.innerHeight;
      let p = cl(-r.top / Math.max(1, r.height - H)) * 4;
      if (reduce) p = Math.min(4, Math.floor(p) + (p % 1 > 0.3 ? 1 : 0)); // jump between finished states
      if (Math.abs(p - last) < 0.0005) return; last = p;
      const step = Math.min(3, Math.floor(p + 0.0001));
      if (step !== lastStep) {
        lastStep = step;
        caps.forEach((c, i) => c.classList.toggle('on', i === step));
      }
      const s1 = seg(p, 0, 0.9), s2 = seg(p, 1, 1.6), s3 = seg(p, 2, 2.6), s4 = seg(p, 3, 3.6);
      // 1 · the slices drift together as the room is captured
      sl.forEach((d, i) => {
        const k = i - 3.5, a = 1 - s1;
        d.style.transform = `translate(${(k * 26 * a).toFixed(1)}px, ${((i % 2 ? 60 : -60) * a).toFixed(1)}px) rotate(${(k * 2.4 * a).toFixed(2)}deg) scale(${(1 - 0.22 * a).toFixed(3)})`;
        d.style.opacity = (0.55 + 0.45 * cl(p / 0.4)).toFixed(3);
      });
      fill.style.opacity = s1 >= 0.999 ? '1' : '0';
      // 2 · walk into the room; Street View arrows appear
      photo.style.transform = `scale(${(1 + 0.14 * s2).toFixed(4)})`;
      chevs.forEach((c, i) => { const v = cl((s2 - i * 0.15) / 0.5) * (1 - s3); c.style.opacity = v.toFixed(3); c.style.transform = `translateY(${(12 * (1 - v)).toFixed(1)}px)`; });
      // 3 · Maps takes over: search bar under the caption, the sheet rises with the place card
      pill.style.top = `${Math.round(capBox.getBoundingClientRect().bottom - t.querySelector('.ms-stage')!.getBoundingClientRect().top + 16)}px`;
      pill.style.opacity = s3.toFixed(3); pill.style.transform = `translateY(${(-10 * (1 - s3)).toFixed(1)}px)`;
      const up = 0.44 * s3 + 0.18 * s4;
      sheet.style.transform = `translateY(${((1 - up / 0.86) * 100).toFixed(2)}%)`;
      // 4 · the card gives way to the results list
      place.style.opacity = (1 - cl(s4 / 0.5)).toFixed(3);
      list.style.opacity = cl((s4 - 0.35) / 0.65).toFixed(3);
      list.style.transform = `translateY(${(16 * (1 - s4)).toFixed(1)}px)`;
      qtxt.textContent = s4 > 0.4 ? '360° tours near me' : LISTINGS[0].name;
      dim.style.opacity = (1 - 0.4 * s2 * (1 - s3)).toFixed(3);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const rs = () => { last = -1; fit(); on(); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', rs);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', rs); };
  }, []);

  const l = LISTINGS[0];
  return (
    <section className="ms" id="services" aria-label="How it works">
      <div className="ms-track" ref={track}>
        <div className="ms-stage">
          <div className="ms-photo" aria-hidden="true">
            {SLICES.map((i) => <div key={i} className="ms-sl" style={{ left: i * 12.5 + '%' }} />)}
            <div className="ms-fill" />
            <div className="ms-chev" style={{ left: '50%' }}><svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg></div>
            <div className="ms-chev" style={{ left: '22%' }}><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg></div>
            <div className="ms-chev" style={{ left: '78%' }}><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg></div>
          </div>
          <div className="ms-dim" aria-hidden="true" />
          <div className="ms-cap">
            {steps.map((s, i) => (
              <div key={s[1]} className={`ms-c${i === 0 ? ' on' : ''}`}><h3 className="cap">{s[1]}</h3><p>{s[2]}</p></div>
            ))}
          </div>
          <div className="ms-search" aria-hidden="true"><span className="ms-q">{l.name}</span><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></div>
          <div className="ms-sheet" aria-hidden="true">
            <div className="ms-handle" />
            <div className="ms-place">
              <h4>{l.name}</h4>
              <div className="ms-rate"><Stars l={l} /> · {l.cat}</div>
              <div className="ms-rate">{l.area} · <svg viewBox="0 0 24 24" className="ms-acc"><circle cx="12" cy="4.5" r="1.8" /><path d="M11 8v6h5l2 5M11 11h4M9 11.5a5 5 0 1 0 6.5 6" /></svg></div>
              <div className="ms-tabs"><b>Overview</b><span>Menu</span><span>Reviews</span><span>About</span></div>
              <div className="ms-acts">
                <span className="on"><i><svg viewBox="0 0 24 24"><path className="ms-dia" d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z" /><path d="M9.5 15v-2.6c0-.8.6-1.4 1.4-1.4h3.6M13 9l2 2-2 2" /></svg></i>Directions</span>
                <span><i><svg viewBox="0 0 24 24"><path d="M7.5 4.5h9v15l-4.5-3.2-4.5 3.2z" /></svg></i>Save</span>
                <span><i><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" strokeDasharray="3 2.2" /><path d="M12 8.2a3 3 0 0 1 3 3c0 2.2-3 4.8-3 4.8s-3-2.6-3-4.8a3 3 0 0 1 3-3z" /></svg></i>Nearby</span>
                <span><i><svg viewBox="0 0 24 24"><rect x="7" y="3.5" width="10" height="17" rx="1.6" /><path d="M10.5 10l2 2-2 2" /></svg></i>Send to phone</span>
                <span><i><svg viewBox="0 0 24 24"><circle cx="17" cy="6" r="2.2" /><circle cx="7" cy="12" r="2.2" /><circle cx="17" cy="18" r="2.2" /><path d="M9 11l6-3.8M9 13l6 3.8" /></svg></i>Share</span>
              </div>
            </div>
            <div className="ms-list">
              <div className="ms-lh">4 results with a 360° tour</div>
              {LISTINGS.map((x) => (
                <div key={x.name} className="ms-row">
                  <div className="ms-rt"><b>{x.name}</b><div className="ms-rate"><Stars l={x} /></div><div className="ms-rate">{x.cat} · {x.area}</div><span className="ms-tag">Street View &amp; 360°</span></div>
                  <u className={x.ph} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
