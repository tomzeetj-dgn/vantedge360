'use client';
/*
 * Room version, wide landscape screens: the page scrolls sideways through panels while a real
 * 360° panorama turns behind them, one full turn over the whole page. Everything moves only when
 * the visitor scrolls. Built on HomeExperience so the map, tours, FAQ and form behave the same.
 */
import HomeExperience from '@/components/HomeExperience';
import Hero from '@/components/sections/Hero';
import MapBlock from '@/components/sections/MapBlock';
import { DeckCards } from '@/components/sections/Benefits';
import Faq from '@/components/sections/Faq';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import ServicesLens from './ServicesLens';
import { images, destinations } from '@/content/site';
import { u } from '@/content/base';

/* Timeline in screen heights. "move" slides to the next panel; "stay" holds a panel while it plays. */
type Seg = { kind: 'move'; to: number } | { kind: 'stay'; at: number; len: number; id?: string; play?: 'sv' | 'dk' };
const SEGS: Seg[] = [
  { kind: 'stay', at: 0, len: 0.2, id: 'top' },
  { kind: 'move', to: 1 }, { kind: 'stay', at: 1, len: 0.25 },
  { kind: 'move', to: 2 }, { kind: 'stay', at: 2, len: 0.8, id: 'work' },
  { kind: 'move', to: 3 }, { kind: 'stay', at: 3, len: 3.2, id: 'services', play: 'sv' },
  { kind: 'move', to: 4 }, { kind: 'stay', at: 4, len: 2.4, id: 'benefits', play: 'dk' },
  { kind: 'move', to: 5 }, { kind: 'stay', at: 5, len: 0.5, id: 'faq' },
  { kind: 'move', to: 6 }, { kind: 'stay', at: 6, len: 0.5, id: 'contact' },
  { kind: 'move', to: 7 }, { kind: 'stay', at: 7, len: 0.2 },
];
const MOVE = 1;
const TOTAL = SEGS.reduce((a, s) => a + (s.kind === 'move' ? MOVE : s.len), 0);
const START: Record<string, number> = {};
{ let acc = 0; for (const s of SEGS) { if (s.kind === 'stay' && s.id) START[s.id] = acc; acc += s.kind === 'move' ? MOVE : s.len; } }
const RATIO = 5200 / 1155; // panorama strip width / height
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export default class RoomExperience extends HomeExperience {
  track: HTMLElement | null = null;
  row: HTMLElement | null = null;
  strip: HTMLElement | null = null;
  nav: HTMLElement | null = null;
  lastPos = -1;

  componentDidMount() {
    super.componentDidMount();
    document.addEventListener('click', this.onLink);
    this.setState({ mapIn: true });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('click', this.onLink);
  }

  /* Where a section starts, in page pixels */
  topOf(id: string) {
    const t = this.track; if (!t) return 0;
    return t.getBoundingClientRect().top + window.scrollY + (START[id] ?? 0) * window.innerHeight;
  }

  /* In-page links (#services, #faq, #contact…) jump along the turn instead of down the page */
  onLink = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest?.('a') as HTMLAnchorElement | null;
    if (!a) return;
    const h = a.getAttribute('href') || '';
    const id = h.includes('#') ? h.slice(h.indexOf('#') + 1) : '';
    if (!(id in START)) return;
    if (!h.startsWith('#') && !a.pathname.endsWith(window.location.pathname)) return;
    e.preventDefault();
    window.scrollTo({ top: this.topOf(id), behavior: 'smooth' });
  };

  onHash = () => {
    const k = destinations.findIndex((d) => d.id === (window.location.hash || '').slice(1));
    if (k < 0) return;
    window.scrollTo({ top: this.topOf('work'), behavior: 'smooth' });
    this.later(() => this.fly(k), 900);
  };

  onHz = () => {
    if (this.hzRaf) return;
    this.hzRaf = requestAnimationFrame(() => {
      this.hzRaf = null;
      const t = this.track; if (!t) return;
      const vh = window.innerHeight, W = window.innerWidth;
      const uu = Math.max(0, Math.min(TOTAL, -t.getBoundingClientRect().top / vh));
      let acc = 0, pos = 0, sv = this.state.svP || 0, dk = this.state.dkP || 0, from = 0;
      for (const s of SEGS) {
        const len = s.kind === 'move' ? MOVE : s.len;
        if (uu <= acc + len || s === SEGS[SEGS.length - 1]) {
          const k = Math.max(0, Math.min(1, (uu - acc) / len));
          if (s.kind === 'move') { pos = from + (s.to - from) * ease(k); if (s.to === 3) sv = 0; if (s.to === 4) { sv = 1; dk = 0; } if (s.to === 5) dk = 1; }
          else { pos = s.at; if (s.play === 'sv') sv = k; if (s.play === 'dk') dk = k; if (s.at > 3) sv = 1; if (s.at > 4) dk = 1; if (s.at < 3) sv = 0; if (s.at < 4) dk = 0; }
          break;
        }
        acc += len; if (s.kind === 'move') from = s.to;
      }
      if (this.row && pos !== this.lastPos) this.row.style.transform = `translate3d(${-pos * W}px,0,0)`;
      this.lastPos = pos;
      // the room turns once over the whole page, only as the visitor scrolls
      const stripW = vh * 1.12 * RATIO;
      if (this.strip) { this.strip.style.width = `${stripW * 2 + W}px`; this.strip.style.transform = `translate3d(${-((uu / TOTAL) * stripW) % stripW}px,0,0)`; }
      if (this.nav) this.nav.classList.toggle('on', pos > 0.55);
      const upd: Record<string, unknown> = {};
      if (Math.abs(sv - (this.state.svP || 0)) > 0.002) upd.svP = sv;
      if (Math.abs(dk - (this.state.dkP || 0)) > 0.002) upd.dkP = dk;
      if (this.state.gvOn) upd.gvOn = false;
      if (Object.keys(upd).length) this.setState(upd);
    });
  };

  render() {
    const s = this.state;
    const svP = s.svP || 0, phase = Math.min(3, Math.floor(svP * 4)), fill = Math.min(1, svP * 4 - phase);
    const dvh = Math.min(typeof window !== 'undefined' ? window.innerHeight : 900, 1600);
    const { dkT, dkC } = this.deckVals(s.dkP || 0, dvh);
    return (
      <div className="hm rx">
        <div className="rx-bg" aria-hidden="true"><div className="rx-strip" ref={(el) => { this.strip = el; }} /></div>
        <header className="rx-nav" ref={(el) => { this.nav = el; }}>
          <a className="rx-logo" href="#top"><img src={images.logoGold} alt="VantEdge360" width={40} height={24} /><span>VANTEDGE</span></a>
          <nav aria-label="Primary"><a href="#services">Services</a><a href="#faq">FAQ</a><a className="rx-cta" href="#contact">Book a shoot</a></nav>
        </header>
        <div className="rx-track" ref={(el) => { this.track = el; }} style={{ height: `${(TOTAL + 1) * 100}vh` }}>
          <div className="rx-pin">
            <div className="rx-row" ref={(el) => { this.row = el; }}>
              <div className="rx-p rx-hero"><Hero /></div>
              <div className="rx-p">
                <div className="rx-card rx-trust">
                  <img src={images.googleBadge} alt="Google Street View Trusted Agency" width={120} height={120} />
                  <p className="cap">Every tour is captured by one of our <b>Google Trusted Photographers</b></p>
                </div>
              </div>
              <div className="rx-p"><section className="work hz-panel rx-work" id="work"><div className="wrap"><MapBlock v={this.mapVals()} /></div></section></div>
              <div className="rx-p"><ServicesLens phase={phase} fill={fill} /></div>
              <div className="rx-p rx-deck" id="benefits">
                <header className="dk-head"><div className="dk-hi" style={{ opacity: +(1 - 0.9 * dkT[0]).toFixed(3), transform: `scale(${(1 - 0.06 * dkT[0]).toFixed(4)})` }}><h2>What changes<br />for you</h2><p>Once your tour is live on Google, you’ll notice four things.</p></div></header>
                <div className="dk-stage"><DeckCards c={dkC} /></div>
              </div>
              <div className="rx-p"><div className="rx-card rx-scroll"><Faq open={s.fqA} onToggle={this.toggleFaq} /></div></div>
              <div className="rx-p"><div className="rx-card rx-scroll"><Contact sent={s.ctSent} busy={s.ctBusy} err={s.ctErr} onSubmit={this.onSubmit} /></div></div>
              <div className="rx-p rx-end"><Footer /><a className="rx-again" href="#top">Turn back to the start <span aria-hidden="true">↺</span></a></div>
            </div>
          </div>
        </div>
        <noscript><p><a href={u('/')}>Current site</a></p></noscript>
      </div>
    );
  }
}
