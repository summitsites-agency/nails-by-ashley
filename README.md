# Nails by Ashley

A one-page, premium editorial demo site for a fictional nail technician —
plain **HTML + CSS + JavaScript**, no build step and no npm.

- Full-bleed cinematic hero video (`public/home.mp4`)
- A **Three.js** centrepiece — glossy nail-polish bottles + mirror-chrome
  liquid blobs with real reflections (via Three's built-in `RoomEnvironment`)
- Smooth scrolling (Lenis), scroll-reveal animation, seamless marquees,
  spotlight-hover service cards, and a portfolio gallery using the showcase videos
- Bold editorial styling: oxblood + bone + acid-lime, Fraunces / Space Grotesk / Space Mono

## Run it

ES modules and the import map need to be **served over http** (opening the file
directly with `file://` will not work). Use any static server from this folder:

```bash
# Python 3
python -m http.server 5173

# or Node
npx serve .
```

Then open <http://localhost:5173>.

> Three.js and Lenis load from a pinned CDN (jsDelivr), so the first load needs
> an internet connection. Everything else is local.

## Structure

```
index.html        the whole page (all sections + import map + fonts)
css/styles.css    brand tokens, layout, animations, responsive + reduced-motion
js/main.js        Lenis, loader, scroll-reveals, sticky nav, lazy 3D loader
js/scene.js       the Three.js lacquer-bar scene
public/           home.mp4 (hero), showcase 1/2.mp4 (gallery), mark.svg
```

## Notes

- Respects `prefers-reduced-motion` (marquees/float paused, one static 3D frame).
- The 3D section is loaded lazily as it nears the viewport and pauses when off-screen.
- All copy (services, prices, bio, testimonials, hours) is demo placeholder content.
- To use local fonts or self-hosted Three.js instead of the CDN, swap the
  `<link>`/import map in `index.html`.
