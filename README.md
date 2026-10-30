# VantEdge360 website

The new vantedge360.com: a one-page site for Google 360° virtual tours, plus Privacy and Terms pages.

Built with Next.js (static export), React and hand-written CSS. No database or server code: `npm run build` produces a plain static site in `out/` that can be hosted anywhere.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

## Deploy

On Vercel: import this repo and keep the defaults. Netlify, Cloudflare Pages or any static host also work, using build command `npm run build` and output folder `out`.

## Where things live

| What | Where |
|---|---|
| Copy, FAQ, the services steps, the contact email and the form endpoint | `src/content/site.ts` |
| The eight Google tours (two per destination) | `src/content/tours.json` |
| Images | `public/images/` (used by `src/content/site.ts` and `app/home.css`) |
| Page sections | `src/components/sections/` |
| Scroll engine and shared state | `src/components/HomeExperience.tsx` |
| Styles | `app/home.css` (ported 1:1 from the approved design) and `app/legal.css` |
| Approved design and build spec | `design/`. Run `python3 design/reference/serve.py` to view it |

## Still to do before launch

- [ ] **Contact form.** Choose a service (Formspree, Web3Forms, …) and paste its endpoint into `formEndpoint` in `src/content/site.ts`. Until then, the form shows the thank-you message but sends nothing.
- [ ] **Google Trusted status.** Confirm it with the client. If it can't be confirmed, remove the badge.
- [ ] **Panorama files.** When the client sends the 360° panoramas, replace the stand-in photos in `public/images/` (see `design/HANDOFF.md`, section 7).
- [ ] **Property names.** Add the real names in `src/content/tours.json` (`propertyName`) and replace the placeholder labels.
- [ ] **Legal pages.** Once the client approves the text, remove the "Draft · for client review" line and the `robots: { index: false }` setting from `app/privacy/page.tsx` and `app/terms/page.tsx`, and add the real date.
- [ ] **Turnaround time.** Put the real time in the "How long does it take?" FAQ answer.
