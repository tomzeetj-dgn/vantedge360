import { memo } from 'react';
import { images } from '@/content/site';

function CredentialBand() {
  return (
    <div className="band cr">
      <div className="wrap cr-in">
        <img className="cr-gbadge" src={images.googleBadge} alt="Google Street View Trusted Agency" width={96} height={96} />
        <p className="cr-txt">Every tour is captured by one of our <b>Google Trusted Photographers</b>.</p>
      </div>
    </div>
  );
}

export default memo(CredentialBand);
