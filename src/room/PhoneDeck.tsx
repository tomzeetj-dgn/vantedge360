'use client';
/*
 * Phones and portrait tablets: "What changes for you" as on desktop. The section pins as one
 * screen; the title opens large in the middle and fades out as the first card arrives; each card
 * rises from below and lands on a stack in the middle, the ones underneath shrinking and dimming a
 * little. Scroll-driven, updates its own styles (never re-renders the page), and when scrolling
 * stops between two cards it eases to the nearer finished one.
 */
import { useEffect, useRef } from 'react';
import { DeckCards } from '@/components/sections/Benefits';

const N = 5;
const TITLE = 0.12;            // share of the scroll the title has to itself
const GAP = 0.16, MOVE = 0.13; // each card starts GAP after the last and takes MOVE to land
const ROT = [-1.6, 1.2, -0.9, 1.5, 0];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const out = (x: number) => 1 - Math.pow(1 - x, 3);
const start = (i: number) => TITLE + i * GAP;
const HIDDEN = Array.from({ length: N }, () => ({ cls: '', y: '0', r: '0', s: '1', b: '1' }));

export default function PhoneDeck() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current; if (!t) return;
    const pin = t.querySelector<HTMLElement>('.pd-pin')!, head = t.querySelector<HTMLElement>('.pd-hi')!;
    const cards = [...t.querySelectorAll<HTMLElement>('.dk-card')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = -1, idle: ReturnType<typeof setTimeout> | undefined, gliding = false;

    const prog = () => { const r = t.getBoundingClientRect(); return { r, p: cl(-r.top / Math.max(1, r.height - window.innerHeight)) }; };
    const draw = () => {
      raf = 0;
      const { p } = prog();
      if (Math.abs(p - last) < 0.0003) return; last = p;
      const H = pin.offsetHeight;
      const e = cards.map((_, i) => { const k = cl((p - start(i)) / MOVE); return reduce ? (k > 0.5 ? 1 : 0) : out(k); });
      cards.forEach((c, i) => {
        let depth = 0; for (let j = i + 1; j < N; j++) depth += e[j]; depth = Math.min(depth, 3);
        // start fully below the screen, whatever the card's height
        const y = (1 - e[i]) * (H / 2 + c.offsetHeight / 2 + 40) - depth * 14;
        const r = ROT[i] * (1 - depth * 0.15) + (1 - e[i]) * 7;
        // short screens (phones held sideways): shrink the card to fit the height
        const fit = Math.min(1, (H - 32) / Math.max(1, c.offsetHeight));
        c.style.setProperty('--pt', `translateY(calc(-50% + ${y.toFixed(1)}px)) rotate(${r.toFixed(2)}deg) scale(${(fit * (1 - depth * 0.04)).toFixed(3)})`);
        c.style.setProperty('--pf', `brightness(${(1 - depth * 0.05).toFixed(3)})`);
        c.style.zIndex = String(i + 1);
        c.classList.toggle('in', e[i] > 0.85);
      });
      head.style.opacity = (1 - e[0]).toFixed(3);
      head.style.transform = `scale(${(1 - 0.06 * e[0]).toFixed(4)})`;
    };

    // When scrolling comes to rest between two cards, ease to the nearer finished one
    const settle = () => {
      const { r, p } = prog();
      const len = r.height - window.innerHeight;
      if (r.top > 0 || -r.top > len || reduce) return;
      const stops = [0, ...Array.from({ length: N }, (_, i) => start(i) + MOVE)];
      const moving = Array.from({ length: N }, (_, i) => p > start(i) + 0.01 && p < start(i) + MOVE - 0.01).some(Boolean);
      if (!moving) return;
      let best = stops[0]; for (const s of stops) if (Math.abs(s - p) < Math.abs(best - p)) best = s;
      gliding = true;
      window.scrollTo({ top: window.scrollY + (best - p) * len, behavior: 'smooth' });
      setTimeout(() => { gliding = false; }, 700);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(draw);
      if (gliding) return;
      clearTimeout(idle); idle = setTimeout(settle, 320);
    };
    const rs = () => { last = -1; on(); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', rs);
    window.visualViewport?.addEventListener('resize', rs);
    draw();
    return () => {
      cancelAnimationFrame(raf); clearTimeout(idle);
      window.removeEventListener('scroll', on); window.removeEventListener('resize', rs);
      window.visualViewport?.removeEventListener('resize', rs);
    };
  }, []);

  return (
    <section className="pd" id="benefits" aria-label="What changes for you">
      <div className="pd-track" ref={track}>
        <div className="pd-pin">
          <header className="pd-head"><div className="pd-hi"><h2 className="cap">What changes<br />for you</h2></div></header>
          <div className="dk-stage pd-cards"><DeckCards c={HIDDEN} /></div>
        </div>
      </div>
    </section>
  );
}
