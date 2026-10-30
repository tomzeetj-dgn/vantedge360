import { images } from '@/content/site';
import Footer from './sections/Footer';

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <div className="lg">
      <div className="wrap">
        <header className="lg-nav">
          <a className="lg-logo" href="/"><img src={images.logoGold} alt="VantEdge360" width={40} height={24} /><span>VANTEDGE</span></a>
          <nav className="lg-nr" aria-label="Primary"><a href="/">Home</a><a className="gh" href="/#contact">Book a shoot</a></nav>
        </header>
      </div>
      <main className="wrap">
        <header className="lg-hd">
          <h1 className="cap">{title}</h1>
          <p>{intro}</p>
          {/* Remove this line once the client approves the text and add the real date. */}
          <div className="lg-meta"><span>Last updated · [date]</span><span>Draft · for client review</span></div>
        </header>
        <div className="lg-grid">
          <nav className="lg-toc" aria-label="On this page">
            <h4>On this page</h4>
            {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
          </nav>
          <div>
            {sections.map((s, i) => (
              <section key={s.id} className="lg-s" id={s.id}>
                <h2><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer home={false} />
    </div>
  );
}
