import toursData from './tours.json';

/*
 * Every image on the site comes from here, so the client's own panorama
 * files can replace the stand-ins in one place (see HANDOFF.md, section 7).
 * The CSS references the same files under /images for background images.
 */
export const images = {
  logoInk: '/images/ve-emblem-ink.svg',
  logoGold: '/images/ve-emblem-gold.svg',
  googleBadge: '/images/google-trusted-badge.png',
  mapLinework: '/images/map-linework.svg',
  heroPlanet: '/images/planet-restaurant.webp',
};

export type Tour = { title: string; googleMapsUrl: string; embedUrl: string };
export type Destination = {
  id: string;
  destination: string;
  label: string;
  propertyName: string | null;
  tours: Tour[];
};

export const destinations = (toursData as { destinations: Destination[] }).destinations;

/* Map pin positions on the linework (percent of the map box) and the still used as a poster. */
export const mapPins = [
  { x: 86.49, y: 86.98, cls: 'b1' },
  { x: 57.2, y: 66.05, cls: 'b2' },
  { x: 30.21, y: 27.37, cls: 'b3' },
  { x: 16.48, y: 23.98, cls: 'b4' },
];

export const steps: [string, string, string, string[]][] = [
  ['Capture', 'We shoot it in one visit', 'One of our Google Trusted Photographers comes to you and photographs the whole space in 360°. It takes one visit, and your guests will barely notice.', ['One visit', 'Five panoramas included']],
  ['Craft', 'We build the tour', 'We stitch the photos together and link the rooms, so people can walk from one to the next.', ['Rooms linked together']],
  ['Publish', 'It goes live on Google', 'We publish it to Google Maps and your Business Profile. Want it on your own website too? We’ll set that up.', ['Google Maps', 'Business Profile', 'Your website']],
  ['Scale', 'Got more than one place?', 'Hotels, villas, branches, stores. We shoot every one the same way, and you deal with one person throughout.', ['One contact for every location']],
];

export const faq = [
  { q: 'Is this a subscription?', a: 'No. You pay once for the standard 360° tour. There are no monthly fees.' },
  { q: 'Are your photographers certified by Google?', a: 'Yes. Every tour is shot by one of our Google Trusted Photographers. Google gives that status to photographers who keep publishing high-quality 360° imagery to Maps.' },
  { q: 'Where will my tour appear?', a: 'On Google Maps and your Google Business Profile, depending on how your profile is set up. If you’d like it on your own website, we’ll embed it there too.' },
  { q: 'How many images are included?', a: 'The standard package covers five panoramic positions. If you want to show more of the space, we can add more.' },
  { q: 'Can you photograph several rooms or areas?', a: 'Yes. Within the package, we can cover different rooms and areas of your place.' },
  { q: 'Do I need a 360° camera?', a: 'No. We bring the camera and the photographer.' },
  { q: 'How long does it take?', a: 'The shoot itself is quick. Editing and publishing take longer, depending on the size of the place and on Google.' },
  { q: 'Can you photograph multiple locations?', a: 'Yes. We can shoot several branches or properties and run them as one project.' },
];

export const contactEmail = 'info@vantedge360.com';

/*
 * Contact form endpoint. Left empty on purpose until the owner picks a service
 * (Formspree, Web3Forms, …). While empty, the form validates and shows the
 * thank-you state but sends nothing.
 */
export const formEndpoint = '';
