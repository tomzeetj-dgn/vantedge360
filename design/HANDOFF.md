# VantEdge360 website: build handoff

This folder is everything needed to build the new vantedge360.com from the approved design.

The design was made in Claude's design canvas. `reference/Home.dc.html` is the approved one-page site, and `reference/Privacy.dc.html` and `reference/Terms.dc.html` are the legal pages. They are the source of truth for layout, copy, spacing, colour, type, motion and breakpoints. Rebuild them as a real website. Do not ship the reference files.

## 1. How to read the reference files

Run `python3 reference/serve.py` and open http://127.0.0.1:8765/Home.dc.html to see the design working in a browser. It needs internet, because it loads React and Google Fonts.

Each `.dc.html` file has three parts:

- A `<helmet><style>` block. This is plain CSS and every value in it is final. Later rules deliberately override earlier ones. Sections marked `V2 ·` at the bottom are the latest pass and win.
- An `<x-dc>` template. This is HTML with `{{holes}}`, `<sc-for list=… as=…>` loops and `<sc-if value=…>` conditionals.
- A `<script type="text/x-dc">` holding `class Component extends DCLogic`. This is a React class component. `renderVals()` returns the values the template's holes read. State, `setState` and lifecycle methods work as in React.

`/_blob/<id>` image URLs map to the files in `assets/`. The mapping is in `reference/serve.py`.

## 2. Stack

Use Next.js (App Router) with `output: 'export'`, so it builds to static HTML that can be hosted anywhere. Vercel is the easy default.

- The page logic is already React class code, so port it to function components and hooks. Split it into one component per section.
- Use TypeScript and plain CSS or CSS Modules. Do not use Tailwind: the design is hand-tuned CSS and should stay that way.
- Load Marcellus and Manrope (300/400/500/600) through `next/font/google`, so the fonts are self-hosted.
- Run images through `next/image` with static export (`unoptimized: true`), or pre-generate AVIF and WebP sizes at build time.
- Do not add an animation library. All motion is CSS plus one requestAnimationFrame-throttled scroll handler, and it should stay that way.

## 3. Design tokens

| Token | Value |
|---|---|
| Ground | `#FAF8F4` |
| Ground, warm (map and FAQ bands) | `#F1ECE3`; stage panels `#F3EEE5` |
| Ink | `#1E1C19` |
| Body text | `#5A544B` |
| Muted | `#6E675D` |
| Gold | `#B8975F` |
| Gold, dark (text on light) | `#8A6B3A` |
| Gold, light (on dark) | `#D9BE8C` |
| Dark bands and footer | `#1E1C19` / `#1B1916` |
| Display face | Marcellus 400, uppercase with tracking, for big section titles only |
| Body face | Manrope, 300 for body copy, 600 for small uppercase labels |

Content width is `.wrap`: max 1320px, with side padding `clamp(1.25rem, 4vw, 3.5rem)`. It goes to 1540px at ≥1800px wide and 1800px at ≥2300px.

## 4. Page structure, top to bottom

1. **Header.** VE emblem and wordmark on the left. Services, FAQ and "Book a shoot" on the right. On phones it collapses to the emblem plus "Book a shoot".

2. **Hero.** It runs an intro sequence on load:
   - The photo shows framed, with the caption "Sky Dining, Dubai".
   - At 2.3s it opens full-bleed into the room, with the caption "Now look around". The room pans slowly, and the visitor can drag it.
   - At 6.2s it folds into the little-planet image inside a gold ring, between "Step inside" and "before you arrive".
   - Then the subline and the "Walk through a tour" and "See the work" buttons show. "Walk through a tour" opens the room view, and "Fold back to 360°" returns to the planet.
   - On portrait screens and below 1024px the headline sits above the planet.
   - Height is `clamp(640px, 100svh, 1400px)`.

3. **Credential band.** Dark band with the Google Trusted badge image and the line "Every tour is captured by one of our Google Trusted Photographers."

4. **Work map, pinned, with a horizontal hand-off.**
   - The `.hz` track is 3 viewport heights tall and holds a 200%-wide row. Scrolling slides the map panel left and the services title panel in. Then the title fades and step 1 of services takes over.
   - The map has four destination pins: Dubai, Greece, Faroe Islands and Iceland. Picking one, from a pin or the list, zooms into that pin and opens a tour viewer.
   - Deep links: `#dubai`, `#greece`, `#faroe-islands` and `#iceland` open that destination. Opening one updates the hash with `history.replaceState`.
   - **On the live site, the tour viewer embeds the real Google tours.** See section 6. The canvas could not show iframes, so the reference shows a draggable photo instead. Replace that with the embed.
   - Below 900px nothing pins, and the map and list stack.

5. **Services, sticky scrollytelling (desktop).**
   - Four steps on the left: We shoot it in one visit, We build the tour, It goes live on Google, Got more than one place?
   - A sticky stage on the right animates between states:
     - eight photo slices turning in a ring
     - the slices lining up into a panorama strip with a gold frame
     - a listing card with the channel chips and a pin
     - four destination cards
   - The active step is the one nearest the viewport centre.
   - The stage is vertically centred with `--sct: calc(var(--vh)/2 - 260px)`, where `--vh` is `min(100vh, 1600px)`.
   - The step rail fills in gold as the steps progress.

6. **Services on phones and tablets (≤900px).**
   - No sticky stage and no rail.
   - Each step opens with its own scene, above the heading and full-bleed on phones. The scene plays with scroll progress (`--p` from 0 to 1, finishing when its centre reaches mid-screen).
   - Tags are a quiet uppercase line with hairline separators.
   - See the `mv` CSS and the `mvP` logic in the reference.

7. **"What changes for you", a pinned stacking deck.**
   - The `.dk` section is 5.4 viewport heights tall and overlaps the end of services.
   - A replica of the last services step pans out while the title "What changes for you" scrolls in from the right.
   - Then five cards rise and stack, each slightly rotated: four benefit cards, each with an image plate, then the tour card.
   - The tour card carries Fee: one-time, Subscription: none, Photographer: our Google Trusted team, a "Book a shoot" button and "We price each property after a short call."
   - At ≤860px the cards simply stack in normal flow.

8. **FAQ.** "Questions owners ask us", with 8 accordion questions. The first one is open by default. The questions and answers are in `this.FQ` in the reference.

9. **Contact.** "Book a shoot", with a form card:
   - Fields: Name, Email, Phone (optional) and About your space.
   - A hidden honeypot field named `company`.
   - "Send", then a thank-you state.
   - **Wire it to a real endpoint.** Ask the owner which service to use (for example Formspree, Resend or Web3Forms). Validate the fields and show the honeypot to no one.

10. **Footer.** Dark. Brand blurb, the Explore and Contact columns, © year, Privacy Policy and Terms & Conditions, and a "Back to top" link.

11. **/privacy and /terms.** These are draft legal pages. Keep the "Draft · for client review" marker until the client approves the text.

## 5. Breakpoints to respect

The reference already handles all of these. Match it.

| Width | What changes |
|---|---|
| ≥2300px | Large-screen scaling of the stage and wrap |
| ≥1800px | Wider wrap |
| 1024–1800px | Main desktop layout |
| ≤1024px, or any portrait screen | Hero headline above the planet |
| ≤900px | No pinning; services become per-step scenes; map and list stack |
| ≤860px | Benefit deck becomes stacked cards |
| ≤600px | Services scenes go full-bleed |
| ≤520px / ≤380px | Small-phone tweaks |

Pin heights use `min(100vh, 1600px)`. Use `svh` where the reference does, so mobile browser bars don't cause jumps.

## 6. Live Google tours

`data/tours.json` has the eight real tours, two per destination. Each has the original Google Maps link and a derived `embedUrl` in the form:

```
https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1s<panoId>!2m2!1d<lat>!2d<lng>!3f<heading>!4f<pitch>!5f0.78
```

The tour viewer should:

- Load the iframe as soon as a destination opens, never before. Use `loading="lazy"`, and set the iframe only when that destination is open.
- Keep the destination's still image under the iframe as a poster until the iframe loads.
- Put a transparent click-to-interact layer over the iframe with a small "Click to look around" chip. Google's viewer grabs the scroll wheel and touch, which would trap page scrolling in the pinned section. Remove the layer on click, and restore it when the pointer leaves the viewer or the tour changes.
- Switch between the two tours with "Tour 01" and "Tour 02".
- Show "Open in Google Maps ↗" (the `googleMapsUrl`) in the corner.

If any `embedUrl` fails to render, replace it with the iframe `src` from Google Maps, via Share, then Embed a map, for that photo. Then tell the owner which one it was.

**Do not download, scrape or re-host images from Google Maps.** Google's terms don't allow it. Embedding the player is fine.

## 7. Images: where each one is used

Every image is a stand-in until the client sends the original 360° panorama files (equirectangular JPGs) from these shoots. Build each image slot so its source can be swapped from one config file, for example `src/content/images.ts`.

| Slot | Current file | Final source |
|---|---|---|
| Hero photo and room view | `restaurant.webp` | Panorama, flat crop and wide strip |
| Hero little planet | `planet-restaurant.webp` | Panorama turned into a little-planet projection |
| Map destination stills (Dubai / Greece / Faroe / Iceland) | `restaurant` / `villa` / `lounge` / `suite` | One panorama crop per destination |
| Services slices, panorama strip, listing card photo | `restaurant.webp` | One panorama |
| Services destination cards | the four photos | Panorama crops |
| Benefit card 1 | `map-linework.svg`, with a pin | Keep |
| Benefit card 2 | `planet-restaurant.webp`, on ink | Little planet |
| Benefit cards 3 and 4 | `suite.webp` / `lounge.webp` | Panorama crops |
| Map linework | `map-linework.svg` | Keep |
| Logo | `ve-emblem-ink.svg` / `ve-emblem-gold.svg` / `ve-emblem-line.svg` | Keep |
| Google Trusted badge | `google-trusted-badge.png` | Keep, but only if the status is confirmed. See section 10 |

When the panoramas arrive, a small build script (for example Node with `sharp`) can produce the crops, strips and little-planet renders from each equirectangular file. Add a real drag-to-look 360° viewer (equirectangular on a sphere, for example Photo Sphere Viewer or a light three.js setup) only where the owner asks.

## 8. Copy rules

The copy in the reference is approved. Don't rewrite it. If any new copy is needed, follow these rules:

- Write like a person talking to one person. Use short sentences and plain words.
- Don't use em dashes, "seamless", "elevate", "unlock", "not X but Y" constructions, or headline full stops.
- Be specific. Where a fact is missing, use a visible placeholder like `[PROPERTY NAME]`. Never invent one.
- Keep "Book a shoot" as the only name for the main action.

## 9. Quality bar and checks

- **Accessibility.** Use real buttons and links, labelled form fields, and visible focus states. Text contrast must be at least 4.5:1. `prefers-reduced-motion` must end every animation in its final state, which the reference already does.
- **Scroll handling.** Use one passive scroll listener, throttled with rAF. Don't read layout inside loops more than needed. Nothing should cause a scroll jump at pin start or end. The services-to-deck hand-off once had a snap, which is fixed in the reference. Keep it fixed.
- **SEO.** Title and description, Open Graph image, a `LocalBusiness`/`ProfessionalService` JSON-LD block, `sitemap.xml` and `robots.txt`, and canonical URLs.
- **Performance.** Aim for Lighthouse mobile scores of ≥ 90 for performance and ≥ 95 for accessibility, best practices and SEO. Preload the hero image and lazy-load everything else.
- **Viewports.** Before calling it done, check 390×844, 820×1180, 1024×768, 1180×820, 1280×720, 1440×900, 1920×1080 and 2560×1440.
  - There must be no horizontal overflow at any of them.
  - Take a screenshot of each section next to the reference at the same size and fix any differences.

## 10. Needs the client before launch

- [ ] **Google Trusted Agency or Photographer status.** Confirm it, and that the badge may be used. If it isn't confirmed, remove the badge.
- [ ] **Full 360° panorama files.** Send them for the eight tours in `data/tours.json`.
- [ ] **Property names.** Supply the real name for each tour, and confirm each venue is happy to be featured.
- [ ] **Turnaround time.** Give the real time from shoot to live, for the "How long does it take?" FAQ answer.
- [ ] **One true number.** For example total tours published, or Google view counts. Add it only if it is real.
- [ ] **Legal text.** Approve the Privacy Policy and Terms, and decide on SMS consent.
- [ ] **Form recipient.** Choose the address that receives requests, and the form service.
- [ ] **Domain and hosting access.**
