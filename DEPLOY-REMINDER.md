# ⚠️ BEFORE THE FINAL DEPLOY

**Stop and raise this with Pol before shipping.**

Open idea, not yet decided:

> Replace the conventional scroll page flow ("Projects → About → FAQ → Contact")
> with something discoverable — a **3D diorama animation** or an explorable
> **galaxy / universe scene** with stars, where the sections are found by
> moving through the scene instead of scrolling past them.

## Questions to settle with Pol

- Does the whole site become the scene, or only the landing → sections transition?
- Keep the sections reachable as normal anchors (SEO, accessibility, deep links,
  `llms.txt`, reduced-motion users) or go fully spatial?
- Diorama (tilted miniature stage, parallax layers) vs. galaxy (starfield,
  constellation navigation) — the constellation/parallax prototypes already lean
  galaxy-ward.
- Performance budget: static export, so no server; WebGL/three.js bundle cost,
  mobile GPU, `prefers-reduced-motion` fallback.

## Prior art already in the repo (scratch, untracked)

- `vyn-parallax-galaxy.html`
- `vyn-constellation-*.html` (10, anim, speeds, compass, clear, n-clear)
- `vyn-parallax-*.html` (editor, elements, props, variants, scissors, fire…)
- `parallax_example_but_generate_graphics.mp4`, `vyn-intro-desktop.mp4`

## Remove this file once the decision is made and shipped
