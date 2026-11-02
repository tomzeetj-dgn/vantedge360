/* Google Maps look-alike cards used to show where a tour appears. Sample listings only. */
import type { CSSProperties } from 'react';

/*
 * Sample listings for the illustration. Swap names, ratings and counts for
 * real client properties once confirmed.
 */
export const LISTINGS = [
  { name: 'Sky Dining', rating: '4.8', count: '1,240', cat: 'Restaurant', area: 'Dubai Marina', ph: 'b1' },
  { name: 'Seaside Villa', rating: '4.9', count: '312', cat: 'Villa', area: 'Greece', ph: 'b2' },
  { name: 'Fjord Guesthouse', rating: '4.7', count: '186', cat: 'Guesthouse', area: 'Faroe Islands', ph: 'b3' },
  { name: 'Aurora Hotel', rating: '4.8', count: '904', cat: 'Hotel', area: 'Iceland', ph: 'b4' },
];
export type Listing = (typeof LISTINGS)[number];

export function Stars({ l }: { l: Listing }) {
  return <>{l.rating} <span className="gstars" aria-hidden="true"><i style={{ width: `${(parseFloat(l.rating) / 5) * 100}%` }}>★★★★★</i>★★★★★</span> ({l.count})</>;
}

export function Chrome({ l }: { l: Listing }) {
  return (
    <>
      <div className="gsearch"><span>{l.name}</span><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></div>
      <span className="g360"><svg viewBox="0 0 24 24"><path d="M4 12a8 3.5 0 1 0 8-3.5" /><path d="M10 6.5l2 2-2 2" /></svg>Street View &amp; 360°</span>
    </>
  );
}

/* A Google Maps place panel. With chrome={false} the search bar and 360° tag are left for the photo to carry. */
export function GCard({ l, style, chrome = true }: { l: Listing; style?: CSSProperties; chrome?: boolean }) {
  return (
    <div className="lens-info gcard" style={style}>
      {chrome && <Chrome l={l} />}
      <h4>{l.name}</h4>
      <div className="grate"><Stars l={l} /> · {l.cat}</div>
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


/* Google Maps results list: the same four places as rows, for narrow screens */
export function MapsList({ anim }: { anim?: boolean }) {
  return (
    <div className="glist">
      <i className="ghandle" aria-hidden="true" />
      {LISTINGS.map((l, k) => (
        <div key={l.name} className="grow" style={anim ? ({ '--k': k } as CSSProperties) : undefined}>
          <div className="grow-tx">
            <b>{l.name}</b>
            <div className="grate"><Stars l={l} /></div>
            <div className="gcat">{l.cat} · {l.area}</div>
            <span className="g360s">Street View &amp; 360°</span>
          </div>
          <u className={`grow-ph ${l.ph}`} />
        </div>
      ))}
    </div>
  );
}

/* Photo with the Maps search bar and 360° tag, then the place panel: one static Google card */
export function GoogleCard({ l = LISTINGS[0], style }: { l?: Listing; style?: CSSProperties }) {
  return (
    <div className="gstatic" style={style}>
      <div className={`gs-ph ${l.ph}`}><Chrome l={l} /></div>
      <GCard l={l} chrome={false} />
    </div>
  );
}
