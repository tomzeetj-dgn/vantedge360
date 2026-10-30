/* "One shoot, then you're everywhere" for the room version: one frame of the room seen four ways. */
import { memo, useEffect, useRef } from 'react';
import { steps } from '@/content/site';

const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];

/*
 * Sample listings for the illustration. Swap names, ratings and counts for
 * real client properties once confirmed.
 */
const LISTINGS = [
  { name: 'Sky Dining', rating: '4.8', count: '1,240', cat: 'Restaurant', area: 'Dubai Marina', ph: 'b1' },
  { name: 'Seaside Villa', rating: '4.9', count: '312', cat: 'Villa', area: 'Greece', ph: 'b2' },
  { name: 'Fjord Guesthouse', rating: '4.7', count: '186', cat: 'Guesthouse', area: 'Faroe Islands', ph: 'b3' },
  { name: 'Aurora Hotel', rating: '4.8', count: '904', cat: 'Hotel', area: 'Iceland', ph: 'b4' },
];
type Listing = (typeof LISTINGS)[number];

function GCard({ l }: { l: Listing }) {
  return (
<div className="lens-info gcard">
      <div className="gsearch"><span>{l.name}</span><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></div>
      <span className="g360"><svg viewBox="0 0 24 24"><path d="M4 12a8 3.5 0 1 0 8-3.5" /><path d="M10 6.5l2 2-2 2" /></svg>Street View &amp; 360°</span>
      <h4>{l.name}</h4>
      {/* Sample listing for the illustration. Swap name, rating and count for a real client property once confirmed. */}
      <div className="grate">{l.rating} <span className="gstars" aria-hidden="true"><i style={{ width: `${(parseFloat(l.rating) / 5) * 100}%` }}>★★★★★</i>★★★★★</span> ({l.count}) · {l.cat}</div>
      <div className="gcat">{l.area} · <svg viewBox="0 0 24 24" aria-label="Wheelchair accessible"><circle cx="12" cy="4.5" r="1.8" /><path d="M11 8v6h5l2 5M11 11h4M9 11.5a5 5 0 1 0 6.5 6" /></svg></div>
      <div className="gtabs"><b>Overview</b><span>Menu</span><span>Reviews</span><span>About</span></div>
      <div className="gacts">
        <span className="on"><i><svg viewBox="0 0 24 24"><path d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z" className="gdia" /><path d="M9.5 15v-2.6c0-.8.6-1.4 1.4-1.4h3.6M13 9l2 2-2 2" /></svg></i>Directions</span>
        <span><i><svg viewBox="0 0 24 24"><path d="M7.5 4.5h9v15l-4.5-3.2-4.5 3.2z" /></svg></i>Save</span>
        <span><i><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" strokeDasharray="3 2.2" /><path d="M12 8.2a3 3 0 0 1 3 3c0 2.2-3 4.8-3 4.8s-3-2.6-3-4.8a3 3 0 0 1 3-3z" /></svg></i>Nearby</span>
        <span><i><svg viewBox="0 0 24 24"><rect x="7" y="3.5" width="10" height="17" rx="1.6" /><path d="M10.5 10l2 2-2 2" /></svg></i>Send to phone</span>
        <span><i><svg viewBox="0 0 24 24"><circle cx="17" cy="6" r="2.2" /><circle cx="7" cy="12" r="2.2" /><circle cx="17" cy="18" r="2.2" /><path d="M9 11l6-3.8M9 13l6 3.8" /></svg></i>Share</span>
      </div>
    </div>
  );
}

function ServicesLens({ phase, intro }: { phase: number; intro: number }) {
  const cur = steps[phase];
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
        <div className="lens-unit">
        <div className="lens-win">
          {SLICES.map((i) => {
            const k = i - 3.5, apart = phase === 0;
            return <div key={i} className="lens-sl" style={{ left: i * 12.5 + '%', backgroundPosition: `${(i / 7) * 100}% 0`, transform: apart ? `translate(${k * 22}px, ${i % 2 ? 26 : -26}px) rotate(${k * 1.6}deg)` : 'none' }} />;
          })}
          <div className="lens-frame" />
        </div>
          <GCard l={LISTINGS[0]} />
        </div>
        {LISTINGS.slice(1).map((l, i) => (
          <div key={l.name} className={`lens-rep r${i + 1}`}>
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
