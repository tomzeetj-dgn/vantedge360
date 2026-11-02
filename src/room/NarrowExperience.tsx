'use client';
/*
 * Phones, tablets in portrait and small windows: the current site, plus what the room version adds.
 * The map opens Dubai by itself the first time it comes into view, as it does on wide screens.
 * The hero is the room itself (tilt or drag to look), services is a Google Maps sheet, and the
 * benefit cards stack in the middle of a pinned screen as on desktop.
 */
import HomeExperience from '@/components/HomeExperience';
import TiltHero from './TiltHero';
import MapsSheet from './MapsSheet';
import PhoneDeck from './PhoneDeck';

export default class NarrowExperience extends HomeExperience {
  autoOpened = false;
  heroEl() { return <TiltHero />; }
  servicesEl() { return <MapsSheet />; }
  benefitsEl() { return <PhoneDeck />; }

  componentDidUpdate() {
    if (this.autoOpened || !this.state.mapIn || this.state.mp !== 'map') return;
    this.autoOpened = true;
    this.mlater(() => {
      if (this.state.mp !== 'map') return;
      this.setState({ dest: 0, tour: 1, gvOn: false, gvReady: false, mp: 'zoom' });
      this.mlater(() => this.setState({ mp: 'open' }), 2100);
    }, 500);
  }
}
