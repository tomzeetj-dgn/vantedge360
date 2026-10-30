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
        <div className="lens-info"><h4>Sky Dining</h4><div>Restaurant · Dubai Marina</div><div className="lens-ch"><span>Google Maps</span><span>Business Profile</span><span>Your website</span></div></div>
        <div className="lens-grid">
          <div className="lens-g"><u className="b1" /><span>Dubai</span></div>
          <div className="lens-g"><u className="b2" /><span>Greece</span></div>
          <div className="lens-g"><u className="b3" /><span>Faroe Islands</span></div>
          <div className="lens-g"><u className="b4" /><span>Iceland</span></div>
        </div>
      </div>
      <div className="lens-bar">
        <h2 className="lens-ttl cap">One shoot,<br />then you’re everywhere</h2>
        <div className="lens-steps">
          <ol>
            {steps.map((st, i) => (
              <li key={st[1]} className={i === phase ? 'on' : i < phase ? 'done' : ''} aria-current={i === phase ? 'step' : undefined}>
                <b>{st[1]}</b>
                <i aria-hidden="true">{i === phase && <s style={{ width: `${Math.round(fill * 100)}%` }} />}</i>
              </li>
            ))}
          </ol>
          <p aria-live="polite">{cur[2]}</p>
        </div>
      </div>
    </section>
  );
}

export default memo(ServicesLens);
