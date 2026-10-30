/* eslint-disable @typescript-eslint/no-explicit-any */
import { memoByData } from '../memo';
import MapBlock from './MapBlock';

function WorkAndIntro({ v }: { v: any }) {
  return (
    <div className="hz" ref={v.hzRef}>
      <div className="hz-pin">
        <div className="hz-row" style={{ transform: `translateX(-${v.hzX}%)` }}>
          <section className="work hz-panel" id="work">
            <div className="wrap">
              <MapBlock v={v} />
            </div>
          </section>
          <section className="hz-panel hz-b" aria-label="Services introduction">
            <div className="wrap hz-bin">
              <div className="hz-tt" style={{ opacity: v.hzTitleOp, transform: `translateY(${v.hzTitleY}px)` }}>
                <h2 className="cap">One shoot,<br />then you’re everywhere</h2>
                <p>Here’s what happens, in order. It starts with one visit to your place and ends with your tour wherever guests look you up.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default memoByData(WorkAndIntro);
