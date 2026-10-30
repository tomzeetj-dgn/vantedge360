/* eslint-disable @typescript-eslint/no-explicit-any */
import { images } from '@/content/site';

/* The map with its four destinations, the live tour viewer and the destination list. Shared by both versions. */
export default function MapBlock({ v }: { v: any }) {
  const cur = v.cur;
  return (
    <>
              <div className="wh">
                <div><h2 className="cap" style={{ marginTop: 0 }}>Our tours,<br />live on Google Maps</h2></div>
                <p>Pick a place and walk around the real tour.</p>
              </div>

              <div className="mapcol">
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
                  <div className="still" aria-hidden="true">{v.open && !v.gvReady && <div className="gvl"><span className="gvl-ring" /><span className="gvl-t">Loading the tour</span></div>}</div>
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
                          <button className="gvs" onClick={v.gvActivate} aria-label={`Look around ${cur.name}, tour ${v.tourN}`} />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`vbar${v.open ? ' on' : ''}`} aria-hidden={!v.open}>
                <p className="vbar-hint">
                  {v.gvOn ? <>{cur.kind}</> : <><span className="vb-click">Click</span><span className="vb-tap">Tap</span> the tour to look around</>}
                </p>
                <div className="vbar-ctl">
                  <div className="vbar-tours" role="group" aria-label="Tours">
                    <span className="vbar-l">Tour</span>
                    <button className={v.t1Cls} onClick={v.tour1} aria-pressed={v.t1Cls === 'on'} tabIndex={v.open ? 0 : -1}>01</button>
                    <button className={v.t2Cls} onClick={v.tour2} aria-pressed={v.t2Cls === 'on'} tabIndex={v.open ? 0 : -1}>02</button>
                  </div>
                  <button className="vbar-back" onClick={v.toMap} tabIndex={v.open ? 0 : -1}>Back to map</button>
                </div>
              </div>
              </div>

              <div className="dlist">
                {v.dests.map((d: any) => (
                  <button key={d.name} className={`dl ${d.cls}`} onClick={d.pick}><span className="t">{d.name}</span><span className="k">{d.kind}</span></button>
                ))}
              </div>
    </>
  );
}
