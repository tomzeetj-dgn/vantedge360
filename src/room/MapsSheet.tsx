'use client';
/*
 * Phones and portrait tablets: "One shoot, then you're everywhere" as a full-screen room.
 * The step title and text sit large on a cream panel at the bottom; the visual owns the space
 * above it. Scrolling captures the room (slices close up), stitches it (gold seams seal, then the
 * joined image glides past the screen edges), then the photo shrinks into a Google Maps place card
 * on plain cream, then the results list. Everything follows the scroll and the component updates its own styles, so it
 * never re-renders the page.
 */
import { useEffect, useRef } from 'react';
import { steps } from '@/content/site';
import { GoogleCard, MapsList } from './gcard';

const cl = (x: number) => Math.max(0, Math.min(1, x));
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const seg = (p: number, a: number, b: number) => io(cl((p - a) / (b - a)));
const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];

export default function MapsSheet() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current; if (!t) return;
    const q = (sel: string) => t.querySelector(sel) as HTMLElement;
    const qa = (sel: string) => [...t.querySelectorAll<HTMLElement>(sel)];
    const stage = q('.ms-stage'), sl = qa('.ms-sl'), caps = qa('.ms-c'), seams = qa('.ms-seam');
    const fill = q('.ms-fill'), cont = q('.ms-cont'), edge = q('.ms-edge'), dim = q('.ms-dim'), capBox = q('.ms-cap');
    const area = q('.ms-area'), card = q('.ms-card'), list = q('.ms-list'), photo = q('.ms-photo'), cream = q('.ms-cream');
    const slot = card.querySelector('.gs-ph') as HTMLElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = -1, lastStep = -1, raf = 0;

    const IMG = 1200 / 880; // restaurant photo
    let W = 0, iw = 0, ox = 0, oy = 0, kCard = 1, kList = 1;
    const place8 = (pan: number) => sl.forEach((d, i) => { d.style.backgroundPosition = `${(ox + pan - (i * W) / 8).toFixed(1)}px ${oy.toFixed(1)}px`; });
    const fit = () => {
      W = stage.offsetWidth; const H = stage.offsetHeight;
      iw = W / H > IMG ? W : H * IMG; const ih = W / H > IMG ? W / IMG : H;
      ox = (W - iw) / 2; oy = (H - ih) / 2;
      sl.forEach((d) => { d.style.backgroundSize = `${iw}px ${ih}px`; });
      place8(0);
      // the visual gets everything above the caption panel
      // phones held sideways: the caption sits on the right, so the visual gets the full height
      const side = window.matchMedia('(orientation: landscape) and (max-height: 520px)').matches;
      const capH = capBox.offsetHeight;
      area.style.bottom = side ? '14px' : `${capH + 18}px`;
      cont.style.bottom = side ? '18px' : `${capH + 22}px`;
      const room = area.offsetHeight;
      kCard = Math.min(1, room / Math.max(1, card.offsetHeight));
      kList = Math.min(1, room / Math.max(1, list.offsetHeight));
    };

    const draw = () => {
      raf = 0;
      const r = t.getBoundingClientRect(), H = window.innerHeight;
      let p = cl(-r.top / Math.max(1, r.height - H)) * 4;
      if (reduce) p = Math.min(4, Math.floor(p) + (p % 1 > 0.3 ? 1 : 0)); // jump between finished states
      if (Math.abs(p - last) < 0.0005) return; last = p;
      const step = Math.min(3, Math.floor(p + 0.0001));
      if (step !== lastStep) { lastStep = step; caps.forEach((c, i) => c.classList.toggle('on', i === step)); }
      const s1 = seg(p, 0, 0.9), s3 = seg(p, 2, 2.55), s4 = seg(p, 3, 3.55);
      // 2 · stitch: gold seams open a hair and seal; then the joined image glides past the edge and back
      const bump = Math.sin(Math.PI * cl((p - 1) / 0.4));
      const g = seg(p, 1.4, 1.95), pan = -0.85 * Math.max(0, (iw - W) / 2) * Math.sin(Math.PI * g);
      const gap = 7 * bump;
      // 1 · the slices drift together as the room is captured
      sl.forEach((d, i) => {
        const k = i - 3.5, a = 1 - s1;
        d.style.transform = `translate(${(k * 26 * a + k * gap).toFixed(1)}px, ${((i % 2 ? 60 : -60) * a).toFixed(1)}px) rotate(${(k * 2.4 * a).toFixed(2)}deg) scale(${(1 - 0.22 * a).toFixed(3)})`;
        d.style.opacity = (0.55 + 0.45 * cl(p / 0.4)).toFixed(3);
      });
      place8(pan);
      seams.forEach((m, j) => { const i = j + 1; m.style.transform = `translateX(${((i * W) / 8 + (i - 3.5) * gap - gap / 2).toFixed(1)}px)`; m.style.opacity = (0.95 * bump).toFixed(3); });
      fill.style.opacity = s1 >= 0.999 && !(p > 1.0005 && p < 1.9995) ? '1' : '0';
      const glide = Math.sin(Math.PI * g);
      cont.style.opacity = glide.toFixed(3); edge.style.opacity = glide.toFixed(3);
      // 3 · the Google place card floats in over the room
      const cIn = cl((s3 - 0.72) / 0.28) * (1 - s4);
      card.style.opacity = cIn.toFixed(3);
      card.style.transform = `translate(-50%, -50%) translateY(${(40 * (1 - s3) - 24 * s4).toFixed(1)}px) scale(${(kCard * (1 - 0.06 * s4)).toFixed(4)})`;
      // 4 · it gives way to the results list
      list.style.opacity = cl((s4 - 0.3) / 0.7).toFixed(3);
      list.style.transform = `translate(-50%, -50%) translateY(${(40 * (1 - s4)).toFixed(1)}px) scale(${kList.toFixed(4)})`;
      dim.style.opacity = '0';
      // 3 · like desktop, the photo itself shrinks into the card's photo slot and the room behind
      // gives way to plain cream: one photo becomes the listing, nothing doubled behind it
      cream.style.opacity = p > 2 ? '1' : '0';
      stage.style.setProperty('--sh', (1 - s3).toFixed(3));
      if (p > 2) {
        const sr = stage.getBoundingClientRect(), tr = slot.getBoundingClientRect();
        const Wd = sr.width, Hd = sr.height, e = s3;
        const sc = 1 + (tr.width / Wd - 1) * e;
        const Hc = Hd + ((tr.height * Wd) / tr.width - Hd) * e;
        const cut = (Hd - Hc) / 2, rad = (36 * e) / sc;
        const dx = (tr.left - sr.left + tr.width / 2 - Wd / 2) * e, dy = (tr.top - sr.top + tr.height / 2 - Hd / 2) * e;
        photo.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${sc.toFixed(4)})`;
        photo.style.clipPath = `inset(${cut.toFixed(1)}px 0px ${cut.toFixed(1)}px 0px round ${rad.toFixed(1)}px ${rad.toFixed(1)}px 0px 0px)`;
        photo.style.opacity = (1 - s4).toFixed(3);
      } else if (photo.style.transform) {
        photo.style.transform = ''; photo.style.clipPath = ''; photo.style.opacity = '';
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const rs = () => { last = -1; fit(); on(); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', rs);
    // iPhone: the address bar collapsing changes the screen height without always firing resize
    window.visualViewport?.addEventListener('resize', rs);
    fit(); draw();
    const late = setTimeout(rs, 800); // fonts in: caption height may have changed
    return () => { clearTimeout(late); cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', rs); window.visualViewport?.removeEventListener('resize', rs); };
  }, []);

  return (
    <section className="ms" id="services" aria-label="How it works">
      <div className="ms-track" ref={track}>
        <div className="ms-stage">
          <div className="ms-cream" aria-hidden="true" />
          <div className="ms-photo" aria-hidden="true">
            {SLICES.map((i) => <div key={i} className="ms-sl" style={{ left: i * 12.5 + '%' }} />)}
            <div className="ms-fill" />
            {SLICES.slice(1).map((i) => <i key={i} className="ms-seam" />)}
            <div className="ms-edge" />
          </div>
          <div className="ms-dim" aria-hidden="true" />
          <div className="ms-cont" aria-hidden="true"><i />One continuous view<i /></div>
          <div className="ms-area" aria-hidden="true">
            <div className="ms-card"><GoogleCard /></div>
            <div className="ms-list"><MapsList /></div>
          </div>
          <div className="ms-cap">
            {steps.map((s, i) => (
              <div key={s[1]} className={`ms-c${i === 0 ? ' on' : ''}`}><h3 className="cap">{s[1]}</h3><p>{s[2]}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
