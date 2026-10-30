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
  { kind: 'stay', at: 0, len: 0.3 },
  { kind: 'move', to: 1 }, { kind: 'stay', at: 1, len: 0.9, id: 'work' },
  { kind: 'move', to: 2 }, { kind: 'stay', at: 2, len: 3.6, id: 'services', play: 'sv' },
  { kind: 'move', to: 3 }, { kind: 'stay', at: 3, len: 2.4, id: 'benefits', play: 'dk' },
  { kind: 'move', to: 4 }, { kind: 'stay', at: 4, len: 0.5, id: 'faq' },
  { kind: 'move', to: 5 }, { kind: 'stay', at: 5, len: 0.4, id: 'contact' },
];
const MOVE = 1;
const TOTAL = SEGS.reduce((a, s) => a + (s.kind === 'move' ? MOVE : s.len), 0);
const START: Record<string, number> = { top: 0 };
{ let acc = 0; for (const s of SEGS) { if (s.kind === 'stay' && s.id) START[s.id] = acc; acc += s.kind === 'move' ? MOVE : s.len; } }
const RATIO = 5200 / 1155; // panorama strip width / height
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export default class RoomExperience extends HomeExperience {
  track: HTMLElement | null = null;
  row: HTMLElement | null = null;
  strip: HTMLElement | null = null;
  nav: HTMLElement | null = null;
  lastPos = -1;
  autoOpened = false;

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
    const t = this.track; if (!t || id === 'top') return 0;
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

  bg: HTMLDivElement | null = null;
  darkRoot: boolean | undefined;
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
          if (s.kind === 'move') { pos = from + (s.to - from) * ease(k); if (s.to === 2) sv = 0; if (s.to === 3) { sv = 1; dk = 0; } if (s.to === 4) dk = 1; }
          else { pos = s.at; if (s.play === 'sv') sv = k; if (s.play === 'dk') dk = k; if (s.at > 2) sv = 1; if (s.at > 3) dk = 1; if (s.at < 2) sv = 0; if (s.at < 3) dk = 0; }
          break;
        }
        acc += len; if (s.kind === 'move') from = s.to;
      }
      if (this.row && pos !== this.lastPos) this.row.style.transform = `translate3d(${-pos * W}px,0,0)`;
      this.lastPos = pos;
      // the room turns once over the whole page, only as the visitor scrolls
      const stripW = vh * 1.12 * RATIO;
      if (this.strip) { this.strip.style.width = `${stripW * 2 + W}px`; this.strip.style.transform = `translate3d(${-((uu / TOTAL) * stripW) % stripW}px,0,0)`; }
      // the slim nav takes over once the hero has scrolled away
      const tr = t.getBoundingClientRect();
      if (this.nav) this.nav.classList.toggle('on', tr.top < vh * 0.35);
      // the room only shows behind the sideways part, never above the hero or below the footer
      if (this.bg) {
        const br = this.bg.getBoundingClientRect();
        const top = Math.max(0, tr.top - br.top), bot = Math.max(0, br.bottom - tr.bottom);
        this.bg.style.clipPath = `inset(${top}px 0 ${bot}px 0)`;
      }
      // whatever an overscroll bounce shows matches the hero (top) or the footer (bottom)
      const dark = tr.top < 0;
      if (dark !== this.darkRoot) { this.darkRoot = dark; document.documentElement.style.backgroundColor = dark ? '#1B1916' : '#FAF8F4'; }
      // open the first destination (Dubai) by itself as the map card arrives
      if (!this.autoOpened && pos >= 0.6 && this.state.mp === 'map') {
        this.autoOpened = true;
        this.setState({ dest: 0, tour: 1, gvOn: false, gvReady: false, mp: 'zoom' });
        this.mlater(() => this.setState({ mp: 'open' }), 2100);
      }
      const upd: Record<string, unknown> = {};
      if (Math.abs(sv - (this.state.svP || 0)) > 0.002) upd.svP = sv;
      if (Math.abs(dk - (this.state.dkP || 0)) > 0.002) upd.dkP = dk;
      if (this.state.gvOn) upd.gvOn = false;
      if (Object.keys(upd).length) this.setState(upd);
    });
  };

  render() {
    const s = this.state;
    const svP = s.svP || 0, svIn = Math.min(1, svP / 0.1), phase = Math.max(0, Math.min(3, Math.floor(((svP - 0.1) / 0.9) * 4)));
    const dvh = Math.min(typeof window !== 'undefined' ? window.innerHeight : 900, 1600);
    const { dkT, dkC } = this.deckVals(s.dkP || 0, dvh);
    return (
      <div className="hm rx">
        <div className="rx-bg" aria-hidden="true" ref={(el) => { this.bg = el; }}><div className="rx-strip" ref={(el) => { this.strip = el; }} /></div>
        <header className="rx-nav" ref={(el) => { this.nav = el; }}>
          <a className="rx-logo" href="#top"><img src={images.logoGold} alt="VantEdge360" width={40} height={24} /><span>VANTEDGE</span></a>
          <nav aria-label="Primary"><a href="#services">Services</a><a href="#faq">FAQ</a><a className="rx-cta" href="#contact">Book a shoot</a></nav>
        </header>
        <div className="rx-hero"><Hero /></div>
        <div className="rx-track" ref={(el) => { this.track = el; }} style={{ height: `${(TOTAL + 1) * 100}vh` }}>
          <div className="rx-pin">
            <div className="rx-row" ref={(el) => { this.row = el; }}>
              <div className="rx-p">
                <div className="rx-card rx-trust">
                  <img src={images.googleBadge} alt="Google Street View Trusted Agency" width={120} height={120} />
                  <p className="cap">Every tour is captured by one of our <b>Google Trusted Photographers</b></p>
                </div>
              </div>
              <div className="rx-p"><section className="work hz-panel rx-work" id="work"><div className="wrap"><MapBlock v={this.mapVals()} /></div></section></div>
              <div className="rx-p"><ServicesLens phase={phase} intro={+svIn.toFixed(3)} /></div>
              <div className="rx-p rx-deck" id="benefits">
                <header className="dk-head"><div className="dk-hi" style={{ opacity: +(1 - 0.9 * dkT[0]).toFixed(3), transform: `scale(${(1 - 0.06 * dkT[0]).toFixed(4)})` }}><h2>What changes<br />for you</h2><p>Once your tour is live on Google, you’ll notice four things.</p></div></header>
                <div className="dk-stage"><DeckCards c={dkC} /></div>
              </div>
              <div className="rx-p"><div className="rx-card rx-faq"><Faq open={s.fqA} onToggle={this.toggleFaq} /></div></div>
              <div className="rx-p"><div className="rx-card"><Contact sent={s.ctSent} busy={s.ctBusy} err={s.ctErr} onSubmit={this.onSubmit} /></div></div>
            </div>
          </div>
        </div>
        <div className="rx-foot"><Footer /></div>
        <noscript><p><a href={u('/')}>Current site</a></p></noscript>
      </div>
    );
  }
}
