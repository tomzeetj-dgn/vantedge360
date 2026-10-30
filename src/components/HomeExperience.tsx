'use client';

/*
 * The home page's state and scroll engine, ported from the approved design
 * (reference/Home.dc.html). The logic is kept as one class component on
 * purpose: it is the proven version from the design, and every section reads
 * from the same scroll position. Markup lives in one component per section.
 */
import { Component } from 'react';
import { destinations, formEndpoint, mapPins, steps as stepData } from '@/content/site';
import Hero from './sections/Hero';
import CredentialBand from './sections/CredentialBand';
import WorkAndIntro from './sections/WorkAndIntro';
import Services from './sections/Services';
import Benefits from './sections/Benefits';
import Faq from './sections/Faq';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

/* eslint-disable @typescript-eslint/no-explicit-any */
type S = Record<string, any>;

const SL = destinations.map((d) => d.id);

export default class HomeExperience extends Component<object, S> {
  timers: ReturnType<typeof setTimeout>[] = [];
  mt: ReturnType<typeof setTimeout>[] = [];
  els: (HTMLElement | null)[] = [];
  mvEls: (HTMLElement | null)[] = [];
  hzEl: HTMLElement | null = null;
  dkEl: HTMLElement | null = null;
  hzRaf: number | null = null;
  io: IntersectionObserver | null = null;
  t4?: ReturnType<typeof setInterval>;
  reduce = false;
  svNear = false;

  constructor(p: object) {
    super(p);
    this.state = {
      ctSent: false, ctBusy: false, ctErr: '', dkP: 0, hzP: 0, fqA: 0, step: 0, rot: 0, mapIn: false, mp: 'map', dest: -1, tour: 1,
      gvOn: false, gvReady: false,
    };
  }

  componentDidMount() {
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver === 'undefined') this.setState({ mapIn: true });
    window.addEventListener('hashchange', this.onHash);
    this.later(this.onHash, 500);
    window.addEventListener('scroll', this.onHz, { passive: true });
    window.addEventListener('resize', this.onHz);
    this.onHz();
    this.t4 = setInterval(() => {
      if (this.state.step === 0 && !this.reduce && this.svNear) this.setState({ rot: (this.state.rot + 1.2) % 360 });
    }, 250);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHash);
    window.removeEventListener('scroll', this.onHz);
    window.removeEventListener('resize', this.onHz);
    clearInterval(this.t4);
    this.timers.forEach(clearTimeout); this.mt.forEach(clearTimeout);
    if (this.io) this.io.disconnect();
    if (this.hzRaf) cancelAnimationFrame(this.hzRaf);
  }

  later(fn: () => void, ms: number) { this.timers.push(setTimeout(fn, ms)); }
  mlater(fn: () => void, ms: number) { this.mt.push(setTimeout(fn, ms)); }

  /* One rAF-throttled scroll handler drives every scroll-linked piece. */
  onHz = () => {
    if (this.hzRaf) return;
    this.hzRaf = requestAnimationFrame(() => {
      this.hzRaf = null;
      const el = this.hzEl; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = Math.min(window.innerHeight, 1600);
      const total = r.height - vh;
      let p = total > 0 ? -r.top / total : 0;
      p = Math.max(0, Math.min(1, p));
      const vh2 = window.innerHeight;
      const vc = vh2 / 2;
      const upd: S = {};
      if (window.innerWidth <= 900) {
        const mp = this.mvEls.map((m) => {
          if (!m) return 0;
          const mr = m.getBoundingClientRect();
          const t = Math.max(0, Math.min(1, (vh2 - (mr.top + mr.height / 2)) / (vh2 * 0.5)));
          return +(1 - Math.pow(1 - t, 2.2)).toFixed(3);
        });
        if ((this.state.mvP || []).join() !== mp.join()) upd.mvP = mp;
      }
      const s0 = this.els[0];
      if (s0) { const b0 = s0.getBoundingClientRect(); this.svNear = b0.top < vh2 * 1.5 && b0.bottom > -vh2; }
      let best = this.state.step, bd = 1e9;
      const ops: string[] = [];
      this.els.forEach((s, i) => {
        if (!s) return;
        const b = s.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - vc);
        if (d < bd) { bd = d; best = i; }
        ops[i] = (1 - Math.min(1, d / (vh2 * 0.3)) * 0.72).toFixed(3);
      });
      if (Math.abs(p - this.state.hzP) > 0.0005) upd.hzP = p;
      if (best !== this.state.step) upd.step = best;
      if ((this.state.stepOps || []).join() !== ops.join()) upd.stepOps = ops;
      const dk = this.dkEl;
      if (dk) {
        const r2 = dk.getBoundingClientRect();
        const tot2 = r2.height - Math.min(vh2, 1600);
        let q = tot2 > 0 ? -r2.top / tot2 : 0;
        q = Math.max(0, Math.min(1, q));
        if (Math.abs(q - (this.state.dkP || 0)) > 0.0005) upd.dkP = q;
        const pinned = r2.top <= 0.5;
        if (pinned !== !!this.state.dkPin) upd.dkPin = pinned;
      }
      // the page moved, so the visitor is no longer inside the tour: put the scroll shield back
      if (this.state.gvOn) upd.gvOn = false;
      if (Object.keys(upd).length) this.setState(upd);
    });
  };

  onHash = () => {
    const k = SL.indexOf((window.location.hash || '').slice(1));
    if (k < 0) return;
    this.setState({ mapIn: true });
    const hz = this.hzEl;
    if (hz) window.scrollTo({ top: hz.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    this.later(() => this.fly(k), 700);
  };

  watch(el: HTMLElement | null) {
    if (!el || this.io || typeof IntersectionObserver === 'undefined') return;
    this.io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { this.setState({ mapIn: true }); this.io?.disconnect(); }
    }, { threshold: 0.35 });
    this.io.observe(el);
  }

  fly(i: number) {
    try { history.replaceState(null, '', '#' + SL[i]); } catch { /* ignore */ }
    this.mt.forEach(clearTimeout); this.mt = [];
    const s = this.state;
    if (s.mp === 'map') {
      this.setState({ dest: i, tour: 1, gvOn: false, gvReady: false, mp: 'zoom' });
      this.mlater(() => this.setState({ mp: 'open' }), 2100);
      return;
    }
    this.setState({ mp: 'map', gvOn: false, gvReady: false });
    this.mlater(() => this.setState({ dest: i, tour: 1, mp: 'zoom' }), 1550);
    this.mlater(() => this.setState({ mp: 'open' }), 3650);
  }

  toggleFaq = (i: number) => this.setState({ fqA: this.state.fqA === i ? -1 : i });
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => { void this.submit(e); };

  reg(i: number, el: HTMLElement | null) { if (el) this.els[i] = el; }

  async submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    if (data.get('company')) return; // honeypot
    if (!formEndpoint) { this.setState({ ctSent: true }); return; }
    this.setState({ ctBusy: true, ctErr: '' });
    try {
      const res = await fetch(formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      this.setState({ ctSent: true, ctBusy: false });
    } catch {
      this.setState({ ctBusy: false, ctErr: 'That didn’t send. Please try again, or email us directly.' });
    }
  }

  render() {
    const s = this.state;
    const raw = destinations.map((d, i) => ({ name: d.destination, kind: d.label, ...mapPins[i] }));
    const dests = raw.map((d, i) => ({
      ...d, cls: s.dest === i ? 'on' : '', delay: (0.15 + i * 0.18).toFixed(2), ldelay: (0.5 + i * 0.18).toFixed(2), hd: (i * 0.6).toFixed(1),
      pick: () => this.fly(i),
    }));
    const opened = s.mp === 'zoom' || s.mp === 'open';
    const cur = s.dest >= 0 ? raw[s.dest] : raw[0];
    const tour = (destinations[s.dest] || destinations[0]).tours[s.tour - 1] || destinations[0].tours[0];

    const st = s.step, sr = s.rot;
    const mvP: number[] = s.mvP || [];
    const mvSl = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => ({ a: k * 45, k, bp: (k / 7 * 100).toFixed(3) }));
    const steps = stepData.map((d, i) => ({
      i, p: mvP[i] == null ? 0 : mvP[i], sl: i < 2 ? mvSl : [],
      mref: (el: HTMLElement | null) => { this.mvEls[i] = el; },
      t: d[1], d: d[2], tags: d[3], on: st === i, cls: st === i ? 'on' : '',
      op: (s.stepOps || [])[i] || (st === i ? 1 : 0.3),
      pick: () => { const el = this.els[i]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); else this.setState({ step: i }); },
      ref: (el: HTMLElement | null) => this.reg(i, el),
    }));
    const slices = [];
    for (let i = 0; i < 8; i++) {
      let w: number, h: number, x: number, y: number, r = 0, o = 1;
      if (st === 0) { const a = i * 45 + sr; const rad = a * Math.PI / 180; w = 60; h = 140; x = 190 * Math.sin(rad); y = -190 * Math.cos(rad); r = a; }
      else if (st === 1) { w = 60; h = 200; x = -210 + i * 60; y = 0; }
      else { w = 45; h = 170; x = -157.5 + i * 45; y = -70; o = st === 3 ? 0 : 1; }
      slices.push({ w, h, o, bp: (i / 7 * 100).toFixed(3), x: x.toFixed(1), y: y.toFixed(1), r: r.toFixed(1) });
    }
    const hzT = Math.max(0, Math.min(1, (s.hzP - 0.04) / 0.38));
    const hzF = Math.max(0, Math.min(1, (s.hzP - 0.5) / 0.15));
    const hzE = hzT < 0.5 ? 4 * hzT * hzT * hzT : 1 - Math.pow(-2 * hzT + 2, 3) / 2;
    const dkP = s.dkP || 0, dvh = Math.min(typeof window !== 'undefined' ? window.innerHeight : 900, 1600);
    const dkT = [0, 1, 2, 3, 4].map((i) => { const t = Math.max(0, Math.min(1, (dkP - (0.34 + i * 0.125)) / 0.11)); return 1 - Math.pow(1 - t, 3); });
    const dkRot = [-1.6, 1.2, -0.9, 1.5, 0];
    const dkC = dkT.map((e, i) => {
      let depth = 0; for (let j = i + 1; j < 5; j++) depth += dkT[j]; depth = Math.min(depth, 3);
      return { cls: e > 0.85 ? 'in' : '', y: ((1 - e) * dvh * 0.95 - depth * 18).toFixed(1), r: (dkRot[i] * (1 - depth * 0.15) + (1 - e) * 7).toFixed(2), s: (1 - depth * 0.035).toFixed(3), b: (1 - depth * 0.05).toFixed(3) };
    });
    const dkPan = Math.max(0, Math.min(1, (dkP - 0.05) / 0.22));
    const dkPanE = dkPan < 0.5 ? 4 * dkPan * dkPan * dkPan : 1 - Math.pow(-2 * dkPan + 2, 3) / 2;

    const work = {
      hzRef: (el: HTMLElement | null) => { this.hzEl = el; },
      hzX: (hzE * 50).toFixed(3), hzTitleOp: (1 - hzF).toFixed(3), hzTitleY: (-28 * hzF).toFixed(1),
      mapRef: (el: HTMLElement | null) => this.watch(el), inCls: s.mapIn ? 'in' : '',
      mapPhase: 'mp-' + s.mp, dests, cur, apR: opened ? '150%' : '0%',
      tourN: '0' + s.tour, t1Cls: s.tour === 1 ? 'on' : '', t2Cls: s.tour === 2 ? 'on' : '',
      open: s.mp === 'open', tour, gvOn: s.gvOn, gvReady: s.gvReady,
      gvActivate: () => this.setState({ gvOn: true }),
      gvLeave: () => { if (this.state.gvOn) this.setState({ gvOn: false }); },
      gvLoad: () => { this.mlater(() => this.setState({ gvReady: true }), 3500); },
      tour1: () => { if (this.state.tour !== 1) this.setState({ tour: 1, gvOn: false, gvReady: false }); },
      tour2: () => { if (this.state.tour !== 2) this.setState({ tour: 2, gvOn: false, gvReady: false }); },
      toMap: () => { this.mt.forEach(clearTimeout); this.mt = []; this.setState({ mp: 'map', gvOn: false, gvReady: false }); },
    };

    const services = { steps, slices, step: st, railH: ((st + 1) / 4 * 100).toFixed(0) };

    const benefits = {
      dkRef: (el: HTMLElement | null) => { this.dkEl = el; },
      dkHo: (1 - 0.9 * dkT[0]).toFixed(3), dkHs: (1 - 0.06 * dkT[0]).toFixed(4), dkX: (dkPanE * 50).toFixed(3),
      dkPinCls: s.dkPin ? 'pinned' : '', cards: dkC,
    };

    return (
      <div className="hm">
        <Hero />
        <CredentialBand />
        <WorkAndIntro v={work} />
        <Services v={services} />
        <Benefits v={benefits} />
        <Faq open={s.fqA} onToggle={this.toggleFaq} />
        <Contact sent={s.ctSent} busy={s.ctBusy} err={s.ctErr} onSubmit={this.onSubmit} />
        <Footer />
      </div>
    );
  }
}
