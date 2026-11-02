/* eslint-disable @typescript-eslint/no-explicit-any */
import { memoByData } from '../memo';
import type { CSSProperties } from 'react';
import { GoogleCard, MapsList } from '@/room/gcard';

const css = (o: Record<string, string | number>) => o as CSSProperties;

function Minis() {
  return (
    <div className="minis">
      <div className="mini"><div className="b1" /><span>Dubai</span></div>
      <div className="mini"><div className="b2" /><span>Greece</span></div>
      <div className="mini"><div className="b3" /><span>Faroe Islands</span></div>
      <div className="mini"><div className="b4" /><span>Iceland</span></div>
    </div>
  );
}

export { Minis };

function Services({ v }: { v: any }) {
  return (
    <section className="sv" id="services">
      <div className="wrap">
        <div className="grid">
          <div className="steps">
            <div className="rail" aria-hidden="true"><div className="railfill" style={{ height: `${v.railH}%` }} /></div>
            {v.steps.map((s: any) => (
              <article key={s.i} className={`step ${s.cls}`} ref={s.ref} style={{ opacity: s.op }}>
                <button className="sbtn" onClick={s.pick} aria-pressed={s.on}><span className="dot" aria-hidden="true" /><h3 className="cap">{s.t}</h3></button>
                <p>{s.d}</p>
                <div className={`mv mv${s.i}`} ref={s.mref} style={css({ '--p': s.p })} aria-hidden="true">
                  <div className="mv-hub" />
                  {s.sl.map((m: any) => (
                    <i key={m.k} className="mv-s" style={css({ '--a': `${m.a}deg`, '--k': m.k, backgroundPosition: `${m.bp}% 50%` })} />
                  ))}
                  <div className="mv-seam" />
                  {s.i === 2 && <GoogleCard />}
                  {s.i === 3 && <MapsList anim />}
                </div>
              </article>
            ))}
          </div>

          <div className="stagecol">
            <div className={`stage st${v.step}`} aria-hidden="true">
              <div className="box">
                <div className="hub" />
                <div className="pcard"><GoogleCard /></div>
                {v.slices.map((sl: any, i: number) => (
                  <div key={i} className="slice" style={{ width: sl.w, height: sl.h, opacity: sl.o, backgroundPosition: `${sl.bp}% 50%`, transform: `translate(${sl.x}px, ${sl.y}px) translate(-50%, -50%) rotate(${sl.r}deg)` }} />
                ))}
                <div className="seam" />
                <div className="pin" />
                <div className="sglist"><MapsList /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memoByData(Services);
