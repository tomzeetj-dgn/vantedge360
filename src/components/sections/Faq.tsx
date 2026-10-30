import { memo } from 'react';
import { contactEmail, faq } from '@/content/site';

function Faq({ open, onToggle }: { open: number; onToggle: (i: number) => void }) {
  const items = faq.map((x, i) => ({ ...x, on: open === i, cls: open === i ? 'fq-on' : '', pick: () => onToggle(i) }));
  return (
    <section className="fq" id="faq">
      <div className="wrap fq-grid">
        <div className="fq-hd">
          <h2 className="cap">Questions<br />owners ask us</h2>
          <p>If yours isn’t here, just email us.</p>
          <a className="fq-mail" href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
        <div className="fq-list">
          {items.map((x, i) => (
            <button key={x.q} className={`fq-it ${x.cls}`} onClick={x.pick} aria-expanded={x.on} aria-controls={`fq-a${i}`}>
              <span className="fq-tp"><span className="fq-q">{x.q}</span><span className="fq-pm" aria-hidden="true" /></span>
              <span className="fq-an" id={`fq-a${i}`}><span><em>{x.a}</em></span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Faq);
