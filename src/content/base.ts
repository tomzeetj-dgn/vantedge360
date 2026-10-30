/*
 * The site can live at a domain root (Vercel, a custom domain) or in a
 * sub-folder (GitHub Pages serves it at /vantedge360/). NEXT_PUBLIC_BASE_PATH
 * is set by the Pages workflow; everything that links to a file or page uses u().
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const u = (path: string) => `${BASE}${path}`;
