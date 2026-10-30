'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Hero intro: photo → room (drag to look) → little planet.
 * Kept as its own stateful component so its 25 fps pan never re-renders the rest of the page.
 */
import { Component } from 'react';
import { images } from '@/content/site';
import { heroPlanetSrc, heroRoomSrc, laterImages } from '@/content/assets';

const load = (src: string) => new Promise<void>((res) => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; });

type S = Record<string, any>;

export default class Hero extends Component<object, S> {
  timers: ReturnType<typeof setTimeout>[] = [];
  t1?: ReturnType<typeof setInterval>;
  reduce = false;
  state: S = { ready: false, phase: 'photo', pos: 50, dir: 1, drag: false, touched: false, spin: 0, pdrag: false, moved: false };

  componentDidMount() {
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Start the intro only once the photo and planet are in, so nothing animates empty. Never wait more than 4s.
    const go = () => { if (this.state.ready) return; this.setState({ ready: true }); this.intro(); setTimeout(() => laterImages.forEach(load), 1500); };
    Promise.all([load(heroRoomSrc), load(heroPlanetSrc)]).then(go);
    this.timers.push(setTimeout(go, 4000));
    this.t1 = setInterval(() => {
      const s = this.state;
      if (s.drag || s.touched || this.reduce) return;
      if (s.phase !== 'room' && s.phase !== 'inside') return;
      let pos = s.pos + s.dir * 0.09, dir = s.dir;
      if (pos > 95) { pos = 95; dir = -1; }
      if (pos < 5) { pos = 5; dir = 1; }
      this.setState({ pos, dir });
    }, 40);
  }

  componentWillUnmount() { clearInterval(this.t1); this.timers.forEach(clearTimeout); }

  intro() {
    this.timers.forEach(clearTimeout); this.timers = [];
    if (this.reduce) { this.setState({ phase: 'planet' }); return; }
    this.setState({ phase: 'photo', pos: 50, touched: false });
    this.timers.push(setTimeout(() => this.setState({ phase: 'room' }), 2300));
    this.timers.push(setTimeout(() => this.setState({ phase: 'planet' }), 6200));
  }

  render() {
    const s = this.state, ph = s.phase;
    const dark = ph === 'room' || ph === 'inside';
    const v = {
      roomCls: ph === 'photo' ? '' : ph === 'room' ? 'room-on' : ph === 'planet' ? 'folded' : 'inside',
      panX: s.pos.toFixed(2),
      frameCls: ph === 'photo' ? '' : 'gone', c1Cls: ph === 'photo' ? '' : 'gone', c2Cls: ph === 'room' ? 'show' : '',
      shadeCls: dark ? 'show' : '', navCls: dark ? 'dark' : '',
      planetCls: ph === 'planet' ? 'show' : ph === 'inside' ? 'dive' : '',
      insideCls: ph === 'inside' ? 'show' : '',
      spinDeg: s.spin.toFixed(1),
      onDown: (e: React.PointerEvent<HTMLDivElement>) => { if (ph !== 'inside' && ph !== 'room') return; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* */ } this.setState({ drag: true, touched: true, x0: e.clientX, p0: s.pos }); },
      onMove: (e: React.PointerEvent) => { const t = this.state; if (!t.drag) return; this.setState({ pos: Math.max(0, Math.min(100, t.p0 - (e.clientX - t.x0) / 6)) }); },
      onUp: () => { if (this.state.drag) this.setState({ drag: false }); },
      pDown: (e: React.PointerEvent<HTMLButtonElement>) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* */ } this.setState({ pdrag: true, moved: false, px0: e.clientX, s0: s.spin }); },
      pMove: (e: React.PointerEvent) => { const t = this.state; if (!t.pdrag) return; const dx = e.clientX - t.px0; this.setState({ spin: t.s0 + dx * 0.4, moved: t.moved || Math.abs(dx) > 5 }); },
      pUp: () => { if (this.state.pdrag) this.setState({ pdrag: false }); },
      pClick: () => { if (!this.state.moved) this.setState({ phase: 'inside', pos: 40, touched: false }); },
      enter: () => this.setState({ phase: 'inside', pos: 40, touched: false }),
      fold: () => this.setState({ phase: 'planet' }),
    };
  return (
    <section className={`hero${s.ready ? '' : ' hero-wait'}`} id="top" aria-label="Introduction">
      <div className={`room ${v.roomCls}`} style={{ backgroundPosition: `${v.panX}% 50%` }} onPointerDown={v.onDown} onPointerMove={v.onMove} onPointerUp={v.onUp} onPointerLeave={v.onUp} role="img" aria-label="360° preview of a sky-level dining room. Drag to look around." />
      <div className={`shade ${v.shadeCls}`} />
      <div className={`c2scrim ${v.c2Cls}`} />
      <div className={`frame ${v.frameCls}`} />
      <p className={`cap c1 ${v.c1Cls}`}>Sky Dining, Dubai</p>
      <p className={`cap c2 ${v.c2Cls}`}>Now look<br />around</p>
      <div className={`flank ${v.planetCls}`}>
        <div className="wrap flankin"><h1 className="cap fh fl">Step inside</h1><div /><div className="cap fh fr">before you arrive</div></div>
      </div>
      <div className={`planetwrap ${v.planetCls}`}>
        <div className="orbit" style={{ transform: `rotate(${v.spinDeg}deg)` }} />
        <button className="pbtn" style={{ transform: `rotate(${v.spinDeg}deg)` }} onPointerDown={v.pDown} onPointerMove={v.pMove} onPointerUp={v.pUp} onClick={v.pClick} aria-label="Step inside the 360° tour">
          <div className="spin"><img src={heroPlanetSrc} alt="" draggable={false} fetchPriority="high" /></div>
        </button>
      </div>
      <div className={`below ${v.planetCls}`}>
        <p><b>360° virtual tours</b> for Google Maps &amp; your Business Profile</p>
        <div className="row"><button className="btn" onClick={v.enter}>Walk through a tour</button><a className="btn ol" href="#work">See the work</a></div>
      </div>
      <div className={`insidebar ${v.insideCls}`}>
        <div className="wrap ibin"><span>Sky Dining, Dubai. Drag to look around.</span><button className="back" onClick={v.fold}>Fold back to 360°</button></div>
      </div>
      <header className={`nav ${v.navCls}`}>
        <div className="wrap navin">
          <a className="logo" href="#top"><img src={images.logoInk} alt="VantEdge360" width={40} height={24} /><span>VANTEDGE</span></a>
          <nav className="nr" aria-label="Primary"><a className="lk" href="#services">Services</a><a className="lk" href="#faq">FAQ</a><a className="ghost" href="#contact">Book a shoot</a></nav>
        </div>
      </header>
    </section>
  );
  }
}
