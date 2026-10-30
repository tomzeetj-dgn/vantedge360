/* eslint-disable @typescript-eslint/no-explicit-any */
import { memoByData } from '../memo';
import { images } from '@/content/site';

function WorkAndIntro({ v }: { v: any }) {
  const cur = v.cur;
  return (
    <div className="hz" ref={v.hzRef}>
      <div className="hz-pin">
        <div className="hz-row" style={{ transform: `translateX(-${v.hzX}%)` }}>
          <section className="work hz-panel" id="work">
            <div className="wrap">
              <div className="wh">
                <div><h2 className="cap" style={{ marginTop: 0 }}>Our tours,<br />live on Google Maps</h2></div>
                <p>Pick a place and walk around the real tour.</p>
              </div>

              <div className={`mapbox ${v.mapPhase} ${v.inCls}`} ref={v.mapRef}>
                <div className="map" style={{ transformOrigin: `${cur.x}% ${cur.y}%` }}>
                  <img src={images.mapLinework} alt="Map of Europe and the Middle East showing VantEdge360 locations" />
                  <div className="marks">
                    {v.dests.map((d: any) => (
                      <div key={d.name} className={`mk ${d.cls}`} style={{ left: `${d.x}%`, top: `${d.y}%` }}>
                        <button className="mkb" onClick={d.pick} aria-label={`Open ${d.name} tours`}>
                          <span className="halo" style={{ animationDelay: `${d.hd}s` }} />
                          <span className="dia" style={{ transitionDelay: `${d.delay}s` }} />
                        </button>
                        <div className="ml" style={{ transitionDelay: `${d.ldelay}s` }}>{d.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ap" style={{ clipPath: `circle(${v.apR} at ${cur.x}% ${cur.y}%)` }}>
                  <div className={`still ${cur.cls}`} />
                  <div className="facade" onMouseLeave={v.gvLeave}>
                    {v.open && (
                      <>
                        <iframe
                          key={v.tour.embedUrl}
                          className={`gv${v.gvReady ? ' ready' : ''}`}
                          src={v.tour.embedUrl}
                          title={`${cur.name}, 360° tour ${v.tourN} on Google Maps`}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          onLoad={v.gvLoad}
                          tabIndex={v.gvOn ? 0 : -1}
                        />
                        {!v.gvOn && (
                          <button className="gvs" onClick={v.gvActivate} aria-label={`Look around ${cur.name}, tour ${v.tourN}`}>
                            <span>Click to look around</span>
                          </button>
                        )}
                        <a className="gvo" href={v.tour.googleMapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
                      </>
                    )}
                  </div>
                </div>
                <div className="otop">
                  <div><h3 className="cap">{cur.name}</h3><div className="meta">{cur.kind}</div></div>
                  <div className="ctr">
                    <button className={`sm ${v.t1Cls}`} onClick={v.tour1} aria-pressed={v.t1Cls === 'on'}>Tour 01</button>
                    <button className={`sm ${v.t2Cls}`} onClick={v.tour2} aria-pressed={v.t2Cls === 'on'}>Tour 02</button>
                    <button className="sm" onClick={v.toMap}>Back to map</button>
                  </div>
                </div>
              </div>

              <div className="dlist">
                {v.dests.map((d: any) => (
                  <button key={d.name} className={`dl ${d.cls}`} onClick={d.pick}><span className="t">{d.name}</span><span className="k">{d.kind}</span></button>
                ))}
              </div>
            </div>
          </section>
          <section className="hz-panel hz-b" aria-label="Services introduction">
            <div className="wrap hz-bin">
              <div className="hz-tt" style={{ opacity: v.hzTitleOp, transform: `translateY(${v.hzTitleY}px)` }}>
                <h2 className="cap">One shoot,<br />then you’re everywhere</h2>
                <p>Here’s what happens, in order. It starts with one visit to your place and ends with your tour wherever guests look you up.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default memoByData(WorkAndIntro);
