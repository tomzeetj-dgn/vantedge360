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
  { kind: 'stay', at: 0, len: 0.6 },
  { kind: 'move', to: 1 }, { kind: 'stay', at: 1, len: 0.9, id: 'work' },
  { kind: 'move', to: 2 }, { kind: 'stay', at: 2, len: 4.2, id: 'services', play: 'sv' },
  { kind: 'move', to: 3 }, { kind: 'stay', at: 3, len: 3.6, id: 'benefits', play: 'dk' },
  { kind: 'move', to: 4 }, { kind: 'stay', at: 4, len: 0.5, id: 'faq' },
  { kind: 'move', to: 5 }, { kind: 'stay', at: 5, len: 0.4, id: 'contact' },
];
const MOVE = 1;
const TOTAL = SEGS.reduce((a, s) => a + (s.kind === 'move' ? MOVE : s.len), 0);
const START: Record<string, number> = { top: 0 };
{ let acc = 0; for (const s of SEGS) { if (s.kind === 'stay' && s.id) START[s.id] = acc; acc += s.kind === 'move' ? MOVE : s.len; } }
const RATIO = 5200 / 1155; // panorama strip width / height
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/*
 * Services: the big title takes the first 10%, then the four steps. The later steps carry more
 * motion (the Google card, then the row of four), so they get more scroll.
 */
const SV_W = [1, 1, 1.25, 1.6];
const SV_CUT = [0.1];
{ const sum = SV_W.reduce((a, b) => a + b, 0); let c = 0; for (const w of SV_W) { c += w; SV_CUT.push(0.1 + (0.9 * c) / sum); } }

/*
 * The deck shares its timing with the main site, where the title holds for the first 34% of the
 * scroll. Here the title only needs 15%, so the cards get more room each.
 */
const DK_TITLE = 0.15;
const deckIn = (k: number) => (k <= DK_TITLE ? (k / DK_TITLE) * 0.34 : 0.34 + ((k - DK_TITLE) / (1 - DK_TITLE)) * 0.66);
const deckOut = (d: number) => (d <= 0.34 ? (d / 0.34) * DK_TITLE : DK_TITLE + ((d - 0.34) / 0.66) * (1 - DK_TITLE));

/*
 * Beats: stretches of the timeline (in screen heights) where something is fully on screen and
 * settled. When scrolling stops between two beats the page eases to the nearer one, and the
 * keyboard moves one beat per press.
 */
const BEATS: [number, number][] = [];
{
  let acc = 0;
  for (const s of SEGS) {
    if (s.kind === 'move') { acc += MOVE; continue; }
    const L = s.len, at = (f: number) => acc + f * L;
    if (s.play === 'sv') {
      BEATS.push([at(0), at(0.1)]);
      for (let k = 0; k < 4; k++) BEATS.push([at(SV_CUT[k]), at(SV_CUT[k + 1])]);
    } else if (s.play === 'dk') {
      BEATS.push([at(0), at(DK_TITLE)]);
      for (let i = 0; i < 5; i++) {
        const st = 0.34 + i * 0.125;
        BEATS.push([at(deckOut(st + 0.11)), i < 4 ? at(deckOut(st + 0.14)) : at(1)]);
      }
    } else BEATS.push([acc, acc + L]);
    acc += L;
  }
}
const inset = ([a, z]: [number, number]) => { const m = Math.min(0.04, (z - a) / 4); return [a + m, z - m] as const; };

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
    window.addEventListener('scroll', this.onIdle, { passive: true });
    window.addEventListener('keydown', this.onKey);
    for (const ev of ['wheel', 'touchstart', 'mousedown']) window.addEventListener(ev, this.stopTween, { passive: true });
    this.setState({ mapIn: true });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('click', this.onLink);
    window.removeEventListener('scroll', this.onIdle);
    window.removeEventListener('keydown', this.onKey);
    for (const ev of ['wheel', 'touchstart', 'mousedown']) window.removeEventListener(ev, this.stopTween);
    clearTimeout(this.idleT);
    this.stopTween();
  }

  /* Position along the timeline, in screen heights (negative while the hero is on screen) */
  at() { const t = this.track; return t ? -t.getBoundingClientRect().top / window.innerHeight : -9; }

  tweenRaf = 0;
  tweenTo_: number | null = null;
  idleT: ReturnType<typeof setTimeout> | undefined;

  stopTween = () => { if (this.tweenRaf) cancelAnimationFrame(this.tweenRaf); this.tweenRaf = 0; this.tweenTo_ = null; };

  /* Glide to a point on the timeline. Any wheel, touch or click takes over straight away. */
  glide(target: number, ms: number, fn: (x: number) => number) {
    const t = this.track; if (!t) return;
    this.stopTween();
    const y0 = window.scrollY, y1 = t.getBoundingClientRect().top + y0 + target * window.innerHeight;
    if (Math.abs(y1 - y0) < 2) return;
    const go = (y: number) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { go(y1); return; }
    this.tweenTo_ = target;
    const t0 = performance.now();
    const step = (now: number) => {
      const x = Math.min(1, (now - t0) / ms);
      go(y0 + (y1 - y0) * fn(x));
      if (x < 1) this.tweenRaf = requestAnimationFrame(step); else { this.tweenRaf = 0; this.tweenTo_ = null; }
    };
    this.tweenRaf = requestAnimationFrame(step);
  }

  /*
   * When scrolling comes to rest between two beats, ease to one of them: the one ahead in the
   * direction of travel, unless the one behind is much closer.
   */
  lastY = 0;
  dir = 1;
  onIdle = () => {
    const y = window.scrollY;
    if (y !== this.lastY) { this.dir = y > this.lastY ? 1 : -1; this.lastY = y; }
    if (this.tweenRaf) return;
    clearTimeout(this.idleT);
    this.idleT = setTimeout(() => {
      const uu = this.at();
      if (uu < 0 || uu > TOTAL || BEATS.some(([a, z]) => uu >= a && uu <= z)) return;
      const nx = BEATS.find(([a]) => a > uu), pv = [...BEATS].reverse().find(([, z]) => z < uu);
      const ahead = this.dir > 0 ? nx : pv, behind = this.dir > 0 ? pv : nx;
      const dist = (b?: [number, number]) => (!b ? Infinity : b === nx ? inset(b)[0] - uu : uu - inset(b)[1]);
      let pick = ahead;
      if (!pick || dist(behind) * 3 < dist(ahead)) pick = behind;
      if (!pick) return;
      const [a, z] = inset(pick);
      this.glide(Math.max(a, Math.min(z, uu)), 450, easeOut);
    }, 320);
  };

  /* Space, Page Up/Down and the arrow keys move one beat at a time through the sideways part */
  onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key, el = e.target as HTMLElement | null;
    const down = k === 'PageDown' || k === 'ArrowDown' || (k === ' ' && !e.shiftKey);
    const up = k === 'PageUp' || k === 'ArrowUp' || (k === ' ' && e.shiftKey);
    if (!down && !up) return;
    if (el && el.closest('input, textarea, select, button, [contenteditable="true"], iframe')) return;
    const uu = this.tweenTo_ ?? this.at();
    if (uu < -1.01 || uu > TOTAL + 0.01) return;
    const marks = BEATS.map((b) => inset(b)[0]);
    const next = down ? marks.find((m) => m > uu + 0.01) : [...marks].reverse().find((m) => m < uu - 0.01);
    if (next === undefined) return;
    e.preventDefault();
    this.glide(next, 700, ease);
  };

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
    const svP = s.svP || 0, svIn = Math.min(1, svP / 0.1), phase = Math.max(0, SV_CUT.slice(0, 4).filter((c) => svP >= c).length - 1);
    const dvh = Math.min(typeof window !== 'undefined' ? window.innerHeight : 900, 1600);
    const { dkT, dkC } = this.deckVals(deckIn(s.dkP || 0), dvh);
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
                <header className="dk-head"><div className="dk-hi" style={{ opacity: +(1 - dkT[0]).toFixed(3), transform: `scale(${(1 - 0.06 * dkT[0]).toFixed(4)})` }}><h2>What changes<br />for you</h2></div></header>
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
