/* "One shoot, then you're everywhere" for the room version: one frame of the room seen four ways. */
import { memo } from 'react';
import { steps } from '@/content/site';

const SLICES = [0, 1, 2, 3, 4, 5, 6, 7];

function ServicesLens({ phase, fill }: { phase: number; fill: number }) {
  const cur = steps[phase];
  return (
    <section className="lens" id="services" aria-label="How it works">
      <div className={`lens-box ph${phase}`} aria-hidden="true">
        <div className="lens-win">
          {SLICES.map((i) => {
            const k = i - 3.5, apart = phase === 0;
            return <div key={i} className="lens-sl" style={{ left: i * 12.5 + '%', backgroundPosition: `${(i / 7) * 100}% 0`, transform: apart ? `translate(${k * 22}px, ${i % 2 ? 26 : -26}px) rotate(${k * 1.6}deg)` : 'none' }} />;
          })}
          <div className="lens-frame" />
        </div>
        <div className="lens-info gcard">
          <div className="gsearch"><span>Sky Dining</span><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></div>
          <span className="g360"><svg viewBox="0 0 24 24"><path d="M4 12a8 3.5 0 1 0 8-3.5" /><path d="M10 6.5l2 2-2 2" /></svg>Street View &amp; 360°</span>
          <h4>Sky Dining</h4>
          {/* Sample listing for the illustration. Swap name, rating and count for a real client property once confirmed. */}
          <div className="grate">4.8 <span className="gstars" aria-hidden="true"><i style={{ width: '96%' }}>★★★★★</i>★★★★★</span> (1,240) · Restaurant</div>
          <div className="gcat">Dubai Marina · <svg viewBox="0 0 24 24" aria-label="Wheelchair accessible"><circle cx="12" cy="4.5" r="1.8" /><path d="M11 8v6h5l2 5M11 11h4M9 11.5a5 5 0 1 0 6.5 6" /></svg></div>
          <div className="gtabs"><b>Overview</b><span>Menu</span><span>Reviews</span><span>About</span></div>
          <div className="gacts">
            <span className="on"><i><svg viewBox="0 0 24 24"><path d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z" className="gdia" /><path d="M9.5 15v-2.6c0-.8.6-1.4 1.4-1.4h3.6M13 9l2 2-2 2" /></svg></i>Directions</span>
            <span><i><svg viewBox="0 0 24 24"><path d="M7.5 4.5h9v15l-4.5-3.2-4.5 3.2z" /></svg></i>Save</span>
            <span><i><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" strokeDasharray="3 2.2" /><path d="M12 8.2a3 3 0 0 1 3 3c0 2.2-3 4.8-3 4.8s-3-2.6-3-4.8a3 3 0 0 1 3-3z" /></svg></i>Nearby</span>
            <span><i><svg viewBox="0 0 24 24"><rect x="7" y="3.5" width="10" height="17" rx="1.6" /><path d="M10.5 10l2 2-2 2" /></svg></i>Send to phone</span>
            <span><i><svg viewBox="0 0 24 24"><circle cx="17" cy="6" r="2.2" /><circle cx="7" cy="12" r="2.2" /><circle cx="17" cy="18" r="2.2" /><path d="M9 11l6-3.8M9 13l6 3.8" /></svg></i>Share</span>
          </div>
        </div>
        <div className="lens-grid">
          <div className="lens-g"><u className="b1" /><span>Dubai</span></div>
          <div className="lens-g"><u className="b2" /><span>Greece</span></div>
          <div className="lens-g"><u className="b3" /><span>Faroe Islands</span></div>
          <div className="lens-g"><u className="b4" /><span>Iceland</span></div>
        </div>
      </div>
      <h2 className="lens-ttl cap">One shoot, then you’re everywhere</h2>
      <div className="lens-bar">
        <div className="lens-prog" aria-hidden="true">
          {steps.map((st, i) => (
            <i key={st[1]} className={i < phase ? 'done' : ''}>{i === phase && <s style={{ width: `${Math.round(fill * 100)}%` }} />}</i>
          ))}
        </div>
        <div className="lens-step" key={phase} aria-live="polite">
          <h3 className="cap">{cur[1]}</h3>
          <p>{cur[2]}</p>
        </div>
      </div>
    </section>
  );
}

export default memo(ServicesLens);
