'use client';
/*
 * Phones and portrait tablets: after the footer, one extra screen turns you around.
 * The room turns, the little planet rolls a full turn and fills the screen; at 360° the page
 * jumps back to the top behind it and the planet settles into the hero. Scroll-driven only.
 */
import { useEffect, useRef } from 'react';
import { heroPlanetSrc } from '@/content/assets';

const RATIO = 5200 / 1155;
const cl = (x: number) => Math.max(0, Math.min(1, x));

export default function TurnAround() {
  const sec = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const planet = useRef<HTMLDivElement>(null);
  const deg = useRef<HTMLSpanElement>(null);
  const lab = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, jumping = false, still = 0;
    const set = (q: number) => {
      const vh = window.innerHeight, W = window.innerWidth;
      const stripW = vh * RATIO;
      if (strip.current) { strip.current.style.width = `${stripW + W}px`; strip.current.style.transform = `translate3d(${-q * stripW * 0.35}px,0,0)`; }
      const a = cl((q - 0.35) / 0.4), b = cl((q - 0.75) / 0.25);
      if (layer.current) layer.current.style.opacity = String(cl(q * 6));
      if (planet.current && !jumping) {
        const scale = (0.3 + 0.7 * a) * (1 + b * 2.7);
        planet.current.style.transform = `translate(-50%,-50%) translateY(${(1 - a) * 55}vh) scale(${scale}) rotate(${-(a * 270 + b * 90)}deg)`;
        planet.current.style.opacity = String(cl(a * 3));
      }
      const d = Math.round(270 + 90 * q);
      if (deg.current) deg.current.textContent = (d >= 360 ? '000' : String(d)) + '°';
      if (lab.current) lab.current.textContent = d >= 360 ? 'Step inside' : 'Turning around';
    };
    const jump = () => {
      jumping = true;
      const root = document.documentElement;
      root.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      window.dispatchEvent(new Event('vantedge:turned'));
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const target = document.querySelector('.g-narrow .planetwrap .pbtn') as HTMLElement | null;
        const p = planet.current;
        if (p && target) {
          const r = target.getBoundingClientRect(), size = p.offsetWidth;
          p.style.transition = 'transform .95s cubic-bezier(.65,0,.2,1)';
          p.style.transform = `translate(-50%,-50%) translate(${r.left + r.width / 2 - window.innerWidth / 2}px, ${r.top + r.height / 2 - window.innerHeight / 2}px) scale(${r.width / size}) rotate(-360deg)`;
        }
        if (layer.current) { layer.current.style.transition = 'opacity .5s ease .9s'; layer.current.style.opacity = '0'; }
        setTimeout(() => {
          root.style.overflow = '';
          if (p) { p.style.transition = ''; }
          if (layer.current) layer.current.style.transition = '';
          jumping = false;
          set(0);
        }, 1450);
      }));
    };
    const tick = () => {
      const s = sec.current;
      if (s && !jumping) {
        const r = s.getBoundingClientRect(), vh = window.innerHeight;
        const q = cl((vh - r.top) / r.height);
        set(q);
        // only turn when the visitor has scrolled the whole extra screen and come to rest there
        if (!reduce && q > 0.995) { still += 1; if (still > 8) { still = 0; jump(); } } else still = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.documentElement.style.overflow = ''; };
  }, []);

  return (
    <>
      <section className="ta" ref={sec} aria-label="Turn around">
        <div className="ta-strip" ref={strip} aria-hidden="true" />
        <p className="ta-hint">Keep scrolling<b className="cap">Turn around</b></p>
        <a className="ta-back" href="#top">Back to the start</a>
      </section>
      <div className="ta-layer" ref={layer} aria-hidden="true">
        <div className="ta-planet" ref={planet} style={{ backgroundImage: `url(${heroPlanetSrc})` }} />
        <p className="ta-read"><span ref={deg}>270°</span><i /><span ref={lab}>Turning around</span></p>
      </div>
    </>
  );
}
