import { memo } from 'react';
import { contactEmail, images } from '@/content/site';

function Footer({ home = true }: { home?: boolean }) {
  const h = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <img src={images.logoGold} alt="VantEdge360" width={49} height={30} />
            <span className="ft-word">VANTEDGE</span>
            <p>Google 360° virtual tours for hotels, villas, restaurants and retail.</p>
            <span className="ft-badge">Google Trusted Photographers</span>
          </div>
          <nav className="ft-col" aria-label="Explore">
            <h3>Explore</h3>
            <a href={h('work')}>The work</a><a href={h('services')}>Services</a><a href={h('faq')}>FAQ</a><a href={h('contact')}>Book a shoot</a>
          </nav>
          <div className="ft-col">
            <h3>Contact</h3>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a className="ft-cta" href={h('contact')}>Book a shoot</a>
          </div>
        </div>
        <div className="ft-bot">
          <span>© {new Date().getFullYear()} VantEdge360</span>
          <span className="ft-legal"><a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms &amp; Conditions</a></span>
          <a className="ft-up" href={home ? '#top' : '/'}>{home ? <>Back to top <span aria-hidden="true">↑</span></> : 'Back to home'}</a>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
