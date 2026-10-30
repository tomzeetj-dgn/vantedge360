import { images } from '@/content/site';
import { u } from '@/content/base';

const V = [['cylinder', 'Cylinder'], ['curve', 'Curve'], ['compass', 'Compass'], ['room', 'Room']];

export default function LabNav({ cur, dark = false }: { cur: string; dark?: boolean }) {
  return (
    <header className={`lab-nav${dark ? ' dark' : ''}`}>
      <a className="lab-logo" href={u('/lab/')}><img src={images.logoInk} alt="VantEdge360" width={40} height={24} /><span>360° scroll lab</span></a>
      <nav aria-label="Versions">
        {V.map(([k, n], i) => <a key={k} className={k === cur ? 'on' : ''} href={u(`/lab/${k}/`)}>{i + 1}<span className="lab-vn"> · {n}</span></a>)}
      </nav>
    </header>
  );
}
