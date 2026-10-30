import { u } from '@/content/base';
import { images } from '@/content/site';

const V = [
  ['cylinder', 'Inside the cylinder', 'Every section sits on the inside wall of a ring. Scrolling turns your head, and the edges bend toward you.'],
  ['curve', 'Flat at rest, curved in motion', 'A sideways strip that bends into a curve while it moves and settles flat when you stop.'],
  ['compass', 'Compass heading bar', 'A straight sideways scroll with a Street View–style heading ruler that names where you are.'],
  ['room', 'A room behind everything', 'A real 360° panorama turns slowly behind the content, once around over the whole scroll.'],
];

export default function Lab() {
  return (
    <main className="lab-index">
      <img src={images.logoInk} alt="VantEdge360" width={48} height={29} />
      <h1 className="lp-cap">360° scroll lab</h1>
      <p>Four ways to turn the site into a sideways, 360° scroll. Scroll down normally on each page; the content moves left to right.</p>
      <ol>
        {V.map(([k, t, d], i) => (
          <li key={k}><a href={u(`/lab/${k}/`)}><span className="n">{i + 1}</span><b className="lp-cap">{t}</b><span className="d">{d}</span></a></li>
        ))}
      </ol>
      <a className="lab-back" href={u('/')}>Back to the current site</a>
    </main>
  );
}
