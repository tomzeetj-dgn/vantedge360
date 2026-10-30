'use client';
/*
 * Picks the version by screen: wide landscape screens get the sideways room turn, phones and
 * portrait tablets get the current site plus the end-of-page turn. Both are in the static HTML
 * (CSS shows the right one, so nothing flashes); after load only the matching one stays mounted.
 */
import { useEffect, useState } from 'react';

export const WIDE = '(min-width: 1024px) and (orientation: landscape)';

export default function Gate({ wide, narrow }: { wide: React.ReactNode; narrow: React.ReactNode }) {
  const [m, setM] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return (
    <>
      {m !== false && <div key="w" className="g-wide">{wide}</div>}
      {m !== true && <div key="n" className="g-narrow">{narrow}</div>}
    </>
  );
}
