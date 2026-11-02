# Notes for Claude Code (room branch)

This branch is the **room version** of vantedge360.com, published at `/v2/`. `main` holds the earlier approved site and stays untouched until the owner decides to ship this one.

## How the room version is built

- `app/page.tsx` → `src/room/Gate.tsx` picks a version by screen and keeps only that one mounted:
  - **Wide landscape (≥1024px, landscape):** `src/room/RoomExperience.tsx`. The hero scrolls normally, then the page turns sideways through panels over a real 360° panorama (`pano-strip.webp`), then the form, then a normal footer. Timeline is `SEGS` (screen heights). Services (`ServicesLens.tsx`) and the deck are scroll-driven; beats get a soft settle and one-beat keyboard steps.
  - **Phones and portrait tablets:** `src/room/NarrowExperience.tsx` (extends `HomeExperience`) swaps in `TiltHero.tsx` (planet-unfolds intro, tilt/drag room), `MapsSheet.tsx` (services: capture, stitch and pan, photo shrinks into the Google card, results list; big caption at the bottom, at the side on phones held sideways) and `PhoneDeck.tsx` (pinned centred card stack). `TurnAround.tsx` closes the page.
- Google Maps look-alike cards and the four **sample listings** live in `src/room/gcard.tsx`. Names, ratings and counts are invented placeholders and must be replaced with real client properties before launch.
- Styles: `app/home.css` (ported design) and `app/room.css` (everything for the room version).

## Rules

- Approved by the owner, keep working as is: desktop room turn and its sections; phone tilt hero with planet intro; phone Maps services sequence; phone pinned deck; FAQ accordion; Google tour embed with its click-to-look-around layer.
- Copy: plain, human; no em dashes, no headline full stops, no "not X but Y"; "Book a shoot" is the only main action; never invent facts.
- Never download or re-host imagery from Google Maps. Embedding Google's player is fine.
- Before saying a change is done: check 390×844, 375×667, 844×390, 820×1180, 1024×1366, 1024×768, 1280×720, 1440×900 and 1920×1080; no horizontal overflow; `prefers-reduced-motion` still works; contrast ≥ 4.5:1 for small text; `npm run build` passes.
