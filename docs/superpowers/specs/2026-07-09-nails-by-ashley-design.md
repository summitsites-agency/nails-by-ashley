# Nails by Ashley — Design Spec

**Date:** 2026-07-09
**Type:** Single-page premium demo marketing site for a nail technician
**Status:** Approved (creative direction + vanilla approach)

## Goal

Build a one-page, premium-quality showcase site for a fictional nail tech ("Nails by
Ashley") at the quality bar of getlayers.ai templates. It must include a full-bleed
high-quality hero video, a Three.js 3D centerpiece, and confident editorial motion —
built as the simplest possible stack: plain HTML + CSS + JS, no build step, no npm.

## Stack & Constraints

- **No framework, no build:** hand-written `index.html`, `css/styles.css`, `js/main.js`,
  `js/scene.js`. Viewable via any static server (ES modules + importmap require serving,
  not `file://`). README documents `python -m http.server` / `npx serve`.
- **3D:** vanilla Three.js r163 loaded via `<script type="importmap">` pinned to a CDN
  (jsDelivr). Reflections come from Three's built-in `RoomEnvironment` via
  `PMREMGenerator` — no external HDR asset required.
- **Smooth scroll:** Lenis via a single pinned CDN `<script>`.
- **Motion:** CSS keyframes (marquees, hero reveal) + `IntersectionObserver` scroll-reveal
  classes. No animation library beyond Lenis.
- **Fonts:** Google Fonts `<link>` — Fraunces (display serif), Space Grotesk (grotesk
  body/subheads), Space Mono (labels/prices). Swappable to local files later.
- **Assets:** already present in `nails by ashley/public/` — `home.mp4` (hero),
  `showcase 1.mp4`, `showcase 2.mp4` (gallery), `favicon.svg`, `icons.svg`.
- **Content:** realistic invented demo copy (services + prices, bio, testimonials, hours,
  location), centralized in a `CONTENT` object in `js/main.js` where practical, or written
  directly into the markup.

## Brand Direction — Bold Editorial

- **Palette (CSS custom properties):** `--bone #F2ECE0` (light bg), `--oxblood #4B0D1A`
  (deep-red color-block sections), `--ink #16110F` (near-black text), `--acid #D9FF3D`
  (electric-lime accent/pop), `--blush #E9C4C0` (soft highlight).
- **Type:** oversized high-contrast Fraunces headlines; tight Space Grotesk for
  subheads/body; Space Mono for labels and price tags. Asymmetric layouts, color-blocked
  sections, magazine energy.
- **Motion feel:** confident, deliberate reveals; seamless marquees; mouse-reactive 3D.

## Page Structure (single page, top to bottom)

1. **Loader** — brand wordmark curtain reveal (~1.8s), scroll frozen, then lifts.
2. **Nav** — fixed, transparent over hero, Lenis smooth-scroll anchor links, `Book Now` CTA.
3. **Hero** — full-bleed `home.mp4` (muted/loop/playsInline + poster), oversized
   line-masked headline reveal, booking CTA, spinning editorial badge, scroll cue.
4. **Marquee** — seamless scrolling band of service keywords, acid-on-oxblood.
5. **Services & pricing** — asymmetric bento of service cards with prices and a
   spotlight/hover-morph interaction.
6. **Polish3D** — Three.js section: floating glossy nail-polish bottles + chrome liquid
   blobs with real reflections, mouse-follow lean + sine float, oxblood stage, editorial
   overlay copy. Paused when off-screen.
7. **Portfolio gallery** — `showcase 1.mp4` & `showcase 2.mp4` as autoplaying muted video
   tiles interleaved with image/placeholder tiles; scroll/hover reveal.
8. **About Ashley** — editorial portrait block, bio, stat row (years, clients, etc.).
9. **Testimonials** — client quotes as an animated marquee/card set.
10. **Booking / Contact + Footer** — hours, location, booking CTA, giant outlined wordmark
    footer.

## Three.js Scene (js/scene.js)

- Scene + PerspectiveCamera + WebGLRenderer (antialias, capped devicePixelRatio).
- `RoomEnvironment` → `PMREMGenerator` for chrome/gloss reflections (offline, no HDR).
- **Polish bottles:** built from primitives (rounded body, neck, cap, brush) with glossy
  `MeshPhysicalMaterial` (clearcoat), in brand colors.
- **Chrome liquid blobs:** `IcosahedronGeometry` spheres, `metalness 1` / low roughness.
- Group lean toward pointer (lerp), per-object sine float on elapsed time.
- `requestAnimationFrame` loop, resize handling, `IntersectionObserver` to pause when the
  section is off-screen.

## Accessibility & Performance

- `prefers-reduced-motion`: pause marquees, calm/stop the 3D float, rely on video posters.
- Videos: `muted`, `loop`, `playsInline`, `autoplay`, `preload="metadata"`, poster frames.
- 3D: capped DPR, paused off-screen; keep geometry counts modest.
- Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), alt text, focus states,
  color-contrast-safe text on color blocks.

## Component-Library Interactions (hand-built, matching the linked sites)

- Animated section reveals + clip/blur text reveals (animmasterlib feel).
- Seamless marquee + spotlight-hover cards (skiper-ui / vengenceui feel).
- Asymmetric bento grid + draggable/scroll gallery (21st.dev feel).

## Verification

- Site is served locally and loads without console errors.
- Each section renders and animates; 3D scene displays reflective bottles/blobs.
- Videos autoplay muted and loop.
- Visual screenshot pass of each section.
- No unit-test harness (consistent with sibling demo sites).

## Out of Scope (YAGNI)

- Real booking backend / form submission (CTA is a styled link/placeholder).
- CMS, multi-page routing, i18n, analytics.
- npm packaging or bundler configuration.
