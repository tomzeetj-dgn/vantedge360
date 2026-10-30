/* eslint-disable @typescript-eslint/no-explicit-any */
import { memoByData } from '../memo';
import type { CSSProperties } from 'react';

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
                <ul className="tags">{s.tags.map((tg: string) => <li key={tg}>{tg}</li>)}</ul>
                <div className={`mv mv${s.i}`} ref={s.mref} style={css({ '--p': s.p })} aria-hidden="true">
                  <div className="mv-hub" />
                  {s.sl.map((m: any) => (
                    <i key={m.k} className="mv-s" style={css({ '--a': `${m.a}deg`, '--k': m.k, backgroundPosition: `${m.bp}% 50%` })} />
                  ))}
                  <div className="mv-seam" />
                  <div className="mv-card"><div className="mv-ph" /><div className="mv-tx"><b>Sky Dining</b><em>Restaurant · Dubai Marina</em><span style={css({ '--k': 0 })}>Google Maps</span><span style={css({ '--k': 1 })}>Business Profile</span><span style={css({ '--k': 2 })}>Your website</span></div></div>
                  <div className="mv-grid"><div style={css({ '--k': 0 })}><u className="b1" /><span>Dubai</span></div><div style={css({ '--k': 1 })}><u className="b2" /><span>Greece</span></div><div style={css({ '--k': 2 })}><u className="b3" /><span>Faroe Islands</span></div><div style={css({ '--k': 3 })}><u className="b4" /><span>Iceland</span></div></div>
                </div>
              </article>
            ))}
          </div>

          <div className="stagecol">
            <div className={`stage st${v.step}`} aria-hidden="true">
              <div className="box">
                <div className="hub" />
                <div className="pcard"><div className="ptxt"><h4>Sky Dining</h4><div className="m">Restaurant · Dubai Marina</div><div className="pch"><span>Google Maps</span><span>Business Profile</span><span>Your website</span></div></div></div>
                {v.slices.map((sl: any, i: number) => (
                  <div key={i} className="slice" style={{ width: sl.w, height: sl.h, opacity: sl.o, backgroundPosition: `${sl.bp}% 50%`, transform: `translate(${sl.x}px, ${sl.y}px) translate(-50%, -50%) rotate(${sl.r}deg)` }} />
                ))}
                <div className="seam" />
                <div className="pin" />
                <Minis />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memoByData(Services);
