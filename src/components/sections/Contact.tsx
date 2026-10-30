import { memo, type FormEvent } from 'react';
import { contactEmail, images } from '@/content/site';

type Props = { sent: boolean; busy: boolean; err: string; onSubmit: (e: FormEvent<HTMLFormElement>) => void };

function Contact({ sent, busy, err, onSubmit }: Props) {
  return (
    <section className="ct" id="contact">
      <div className="wrap ct-grid">
        <div className="ct-hd">
          <h2 className="cap">Book<br />a shoot</h2>
          <p>Tell us a bit about your place. We’ll get back to you and set up a short call.</p>
          <a className="fq-mail" href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
        <div className="dk-card ct-card">
          <div className="dk-in ct-in">
            {!sent ? (
              <form className="ct-form" onSubmit={onSubmit}>
                <div className="ct-row">
                  <label className="ct-f"><span>Name</span><input type="text" name="name" required autoComplete="name" /><i /></label>
                  <label className="ct-f"><span>Email</span><input type="email" name="email" required autoComplete="email" /><i /></label>
                </div>
                <label className="ct-f"><span>Phone <em>(optional)</em></span><input type="tel" name="phone" autoComplete="tel" /><i /></label>
                <label className="ct-f"><span>About your space</span><textarea name="message" rows={4} required placeholder="Property type, location, and what you’d like guests to see" /><i /></label>
                <input className="ct-hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div className="ct-ft">
                  <button className="dk-btn ct-btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send'}</button>
                  <span className="ct-pp">By sending, you agree to our <a href="/privacy/">Privacy Policy</a>.</span>
                </div>
                {err && <p className="ct-err" role="alert">{err}</p>}
              </form>
            ) : (
              <div className="ct-done" role="status">
                <img src={images.logoGold} alt="" />
                <h3 className="cap">Thank you</h3>
                <p>Your request is with us. We’ll be in touch shortly to arrange a short call.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
