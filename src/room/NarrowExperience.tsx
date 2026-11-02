'use client';
/*
 * Phones, tablets in portrait and small windows: the current site, plus what the room version adds.
 * The map opens Dubai by itself the first time it comes into view, as it does on wide screens.
 * The hero is the room itself (tilt or drag to look), services is a Google Maps sheet, and bands of
 * the room sit between sections.
 */
import HomeExperience from '@/components/HomeExperience';
import TiltHero from './TiltHero';
import MapsSheet from './MapsSheet';

export default class NarrowExperience extends HomeExperience {
  autoOpened = false;
  bands = true;
  heroEl() { return <TiltHero />; }
  servicesEl() { return <MapsSheet />; }

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
