/* eslint-disable @typescript-eslint/no-explicit-any */
import { memoByData } from '../memo';
import { images } from '@/content/site';
import { Minis } from './Services';

const cards = [
  { h: 'Easier to find', p: 'A listing with a 360° tour gets more attention in Search and Maps.' },
  { h: 'You look established', p: 'A full tour tells people this is a serious place, worth the trip.' },
  { h: 'No surprises at check-in', p: 'Guests see the actual room before they pay, so they know exactly what they’re booking.' },
  { h: 'More of them book', p: 'Someone who has already walked around online is much closer to booking.' },
];

/* The five stacking cards. Shared by the current site and the room version. */
export function DeckCards({ c }: { c: any[] }) {
  const t = (i: number) => ({ zIndex: i + 1, transform: `translateY(${c[i].y}px) rotate(${c[i].r}deg) scale(${c[i].s})`, filter: `brightness(${c[i].b})` });
  return (
    <>
              {cards.map((k, i) => (
                <article key={k.h} className={`dk-card ${c[i].cls}`} style={t(i)}>
                  <div className="dk-in">
                    <div className="dk-tx"><h3>{k.h}</h3><p>{k.p}</p></div>
                    <div className="dk-dial" aria-hidden="true" />
                  </div>
                </article>
              ))}
              <aside className={`dk-card dk-tour ${c[4].cls}`} aria-label="VantEdge 360 Tour terms" style={t(4)}>
                <div className="dk-in dk-tin">
                  <div className="dk-th"><img src={images.logoGold} alt="" width={46} height={28} /><div><h3>VantEdge 360 Tour</h3><div className="dk-sub">For hotels, villas, restaurants and shops</div></div></div>
                  <div className="dk-tg"><div><span>Fee</span><b>One-time</b></div><div><span>Subscription</span><b>None</b></div><div><span>Photographer</span><b>Our Google Trusted team</b></div></div>
                  <div className="dk-tf"><a className="dk-btn" href="#contact">Book a shoot</a><span className="dk-note">We price each property after a short call.</span></div>
                </div>
              </aside>
    </>
  );
}

function Benefits({ v }: { v: any }) {
  const c = v.cards;
  return (
    <section className="dk" id="benefits" ref={v.dkRef}>
      <div className="dk-pin">
        <div className="dk-row" style={{ transform: `translateX(-${v.dkX}%)` }}>
          <div className={`dk-pa ${v.dkPinCls}`} aria-hidden="true">
            <div className="wrap"><div className="grid">
              <div className="steps dk-steps">
                <div className="rail dk-rail2"><div className="railfill" style={{ height: '100%' }} /></div>
                <article className="step on dk-last"><div className="sbtn"><span className="dot" /><h3 className="cap">Got more than one place?</h3></div><p>Hotels, villas, branches, stores. We shoot every one the same way, and you deal with one person throughout.</p><ul className="tags"><li>One contact for every location</li></ul></article>
              </div>
              <div className="stagecol dk-sc"><div className="stage st3"><div className="box"><Minis /></div></div></div>
            </div></div>
          </div>
          <div className="dk-pb">
            <header className="dk-head">
              <div className="dk-hi" style={{ opacity: v.dkHo, transform: `translateY(0px) scale(${v.dkHs})` }}>
                <h2>What changes<br />for you</h2>
                <p>Once your tour is live on Google, you’ll notice four things.</p>
              </div>
            </header>
            <div className="dk-stage"><DeckCards c={c} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memoByData(Benefits);
