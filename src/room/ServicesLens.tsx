/* "One shoot, then you're everywhere" for the room version: one frame of the room seen four ways. */
import { memo, useEffect, useRef } from 'react';
import { steps } from '@/content/site';
import { GCard, LISTINGS } from './gcard';

const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];

const cl = (x: number) => Math.max(0, Math.min(1, x));
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const f3 = (x: number) => +x.toFixed(4);

/*
 * Everything here follows the scroll. t = [slices come together, photo becomes the Google card,
 * card joins the row of four], each 0 to 1.
 */
function ServicesLens({ phase, intro, t }: { phase: number; intro: number; t: number[] }) {
  const cur = steps[phase];
  const [t1, t2, t3] = t;
  const e1 = io(t1), e2 = io(t2), e3 = io(t3);
  const frame = cl((t1 - 0.75) / 0.25) * (1 - cl(t2 / 0.25));
  const clip = t2 > 0
    ? `inset(${f3(-30 * (1 - e2))}px round ${f3(72 * e2)}px ${f3(72 * e2)}px 0px 0px)`
    : `inset(${t1 >= 1 ? -30 : -300}px round 0px 0px 0px 0px)`;
  const winT = `translate(-50%, calc(-50% - ${f3(118 * e2)}px)) scale(${f3(1 - 0.5 * e2)})`;
  const gIn = io(cl((t2 - 0.45) / 0.55));
  const unitT = t3 > 0 ? `translate(calc(var(--x0) * ${f3(e3)}), calc(var(--y) * ${f3(e3)})) scale(calc(1 + (var(--f) - 1) * ${f3(e3)}))` : 'none';
  const rep = (i: number) => io(cl((t3 - 0.3 - i * 0.14) / 0.42));
  const box = useRef<HTMLDivElement>(null);
  /* Fit the four cards in a row: one scale and four x offsets, written as CSS variables. */
  useEffect(() => {
    const fit = () => {
      const b = box.current; if (!b) return;
      const win = b.querySelector<HTMLElement>('.lens-win'), info = b.querySelector<HTMLElement>('.lens-unit .gcard');
      if (!win || !info) return;
      const cw = win.offsetWidth / 2, ih = info.offsetHeight, ph = win.offsetWidth / 4;
      const gap = 20, gw = Math.min(1320, window.innerWidth * 0.9), sw = (gw - gap * 3) / 4;
      const f = Math.min(1, sw / cw, (b.offsetHeight - 10) / (ph + ih));
      const mid = -118 + ih / 2;
      b.style.setProperty('--f', String(f));
      b.style.setProperty('--y', -f * mid + 'px');
      [0, 1, 2, 3].forEach((i) => b.style.setProperty('--x' + i, (i - 1.5) * (sw + gap) + 'px'));
    };
    fit();
    const t = setTimeout(fit, 600);
    window.addEventListener('resize', fit);
    return () => { clearTimeout(t); window.removeEventListener('resize', fit); };
  }, []);
  return (
    <section className="lens" id="services" aria-label="How it works">
      <div className={`lens-box ph${phase}`} aria-hidden="true" ref={box} style={{ opacity: intro, transform: `translateY(${((1 - intro) * 50).toFixed(1)}px)` }}>
        <div className="lens-unit" style={{ transform: unitT }}>
        <div className="lens-win" style={{ transform: winT, clipPath: clip }}>
          {SLICES.map((i) => {
            const k = i - 3.5, a = 1 - e1;
            return <div key={i} className="lens-sl" style={{ left: i * 12.5 + '%', backgroundPosition: `${(i / 7) * 100}% 0`, transform: a > 0 ? `translate(${f3(k * 22 * a)}px, ${f3((i % 2 ? 26 : -26) * a)}px) rotate(${f3(k * 1.6 * a)}deg)` : 'none' }} />;
          })}
          <div className="lens-fill" style={{ opacity: t1 >= 0.98 ? 1 : 0 }} />
          <div className="lens-frame" style={{ opacity: f3(frame) }} />
        </div>
          <GCard l={LISTINGS[0]} style={{ opacity: f3(gIn), transform: `translate(-50%, ${f3(14 * (1 - gIn))}px)` }} />
        </div>
        {LISTINGS.slice(1).map((l, i) => (
          <div key={l.name} className={`lens-rep r${i + 1}`} style={{ opacity: f3(rep(i)), transform: `translate(var(--x${i + 1}), calc(var(--y) + ${f3(60 * (1 - rep(i)))}px)) scale(var(--f))` }}>
            <div className={`grep-ph ${l.ph}`} />
            <GCard l={l} />
          </div>
        ))}
      </div>
      <h2 className="lens-ttl cap" style={{ opacity: +(1 - intro).toFixed(3), transform: `scale(${(1 - 0.06 * intro).toFixed(4)})` }}>One shoot,<br />then you’re<br />everywhere</h2>
      <div className="lens-bar" style={{ opacity: intro, transform: `translate(-50%, ${((1 - intro) * 30).toFixed(1)}px)` }}>
        <div className="lens-step" key={phase} aria-live="polite">
          <h3 className="cap">{cur[1]}</h3>
          <p>{cur[2]}</p>
        </div>
      </div>
    </section>
  );
}

export default memo(ServicesLens);
