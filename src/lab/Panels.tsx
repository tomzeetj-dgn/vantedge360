/* Shared content for the 360° scroll prototypes. Each panel is one "heading" in the turn. */
import { images, mapPins, destinations, steps } from '@/content/site';
import { u } from '@/content/base';

export const PANELS = ['Step inside', 'Google Trusted', 'Our tours', 'How it works', 'What changes', 'Book a shoot'];

const benefits = [
  ['Easier to find', 'A listing with a 360° tour gets more attention in Search and Maps.'],
  ['You look established', 'A full tour tells people this is a serious place, worth the trip.'],
  ['No surprises at check-in', 'Guests see the actual room before they pay.'],
  ['More of them book', 'Someone who has already walked around online is much closer to booking.'],
];

export default function Panels({ refs }: { refs?: (i: number) => (el: HTMLElement | null) => void }) {
  const r = (i: number) => (refs ? refs(i) : undefined);
  return (
    <>
      <section className="lp lp-hero" ref={r(0)} data-i={0}>
        <div className="lp-in">
          <h1 className="lp-cap lp-h1">Step inside<br />before you arrive</h1>
          <img className="lp-planet" src={images.heroPlanet} alt="" draggable={false} />
          <p className="lp-sub"><b>360° virtual tours</b> for Google Maps &amp; your Business Profile</p>
          <p className="lp-cue">Scroll to turn around <span aria-hidden="true">→</span></p>
        </div>
      </section>
      <section className="lp lp-trust" ref={r(1)} data-i={1}>
        <div className="lp-in">
          <img src={images.googleBadge} alt="Google Street View Trusted Agency" width={120} height={120} />
          <p className="lp-cap lp-quote">Every tour is captured by one of our <b>Google Trusted Photographers</b></p>
        </div>
      </section>
      <section className="lp lp-tours" ref={r(2)} data-i={2}>
        <div className="lp-in">
          <h2 className="lp-cap lp-h2">Our tours,<br />live on Google Maps</h2>
          <div className="lp-map">
            <img src={images.mapLinework} alt="" />
            {mapPins.map((m, i) => (
              <span key={i} className="lp-pin" style={{ left: `${m.x}%`, top: `${m.y}%` }}><i /><em>{destinations[i].destination}</em></span>
            ))}
          </div>
          <a className="lp-link" href={u('/#work')}>Walk through the real tours</a>
        </div>
      </section>
      <section className="lp lp-how" ref={r(3)} data-i={3}>
        <div className="lp-in">
          <h2 className="lp-cap lp-h2">One shoot,<br />then you’re everywhere</h2>
          <ol className="lp-steps">
            {steps.map((s) => <li key={s[1]}><b className="lp-cap">{s[1]}</b><span>{s[2]}</span></li>)}
          </ol>
        </div>
      </section>
      <section className="lp lp-why" ref={r(4)} data-i={4}>
        <div className="lp-in">
          <h2 className="lp-cap lp-h2">What changes<br />for you</h2>
          <div className="lp-ben">
            {benefits.map((b) => <div key={b[0]}><b>{b[0]}</b><span>{b[1]}</span></div>)}
          </div>
        </div>
      </section>
      <section className="lp lp-book" ref={r(5)} data-i={5}>
        <div className="lp-in">
          <h2 className="lp-cap lp-h1">Book<br />a shoot</h2>
          <p className="lp-sub">Tell us a bit about your place. We’ll get back to you and set up a short call.</p>
          <a className="lp-btn" href={u('/#contact')}>Book a shoot</a>
        </div>
      </section>
    </>
  );
}
