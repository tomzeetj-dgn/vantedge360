/*
 * Static imports give the exact, hashed URLs the CSS also uses for these
 * background images, so preloading and prefetching hit the same files.
 */
import restaurant from '../../public/images/restaurant.webp';
import villa from '../../public/images/villa.webp';
import lounge from '../../public/images/lounge.webp';
import suite from '../../public/images/suite.webp';
import planet from '../../public/images/planet-restaurant.webp';

export const heroRoomSrc = restaurant.src;
export const heroPlanetSrc = planet.src;
export const laterImages = [villa.src, lounge.src, suite.src];
