# VYN – CoCreation Lab — portfolio website

Production-ready static portfolio built for the "VYN – CoCreation Lab" brand.
Discoverability (SEO / AIO / AEO / GEO / LLMO) was the first-priority
requirement; the dark neon design and all animation are additive layers that
degrade gracefully.

## Stack

- Next.js **16.4.2**, `output: "export"` (pure static site in `out/`)
- React 19.3.1, TypeScript strict (pinned)
- Tailwind CSS v4, Radix `react-dialog` + `react-slot`, lucide-react (custom
  brand icons live in `components/brand/`)
- **No CSS/JS animation library**: everything scroll/entrance-driven is native
  CSS (`animation-timeline: view()/scroll()`), progressively enhanced behind
  `@supports` and `prefers-reduced-motion`
- Client-side JS on `/` is reduced to: splashscreen, site header (mobile
  dialog + scroll-spy), route announcer — plus the framework runtime

## Commands

| Command           | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `npm run dev`     | Dev server                                                              |
| `npm run build`   | Type-check, lint-free production static export into `out/`              |
| `npm run preview` | Serve `out/` locally (`npx serve out`)                                  |
| `npm run assets`  | Regenerate optimized imagery (`scripts/generate-assets.ts`)             |
| `npm run llms`    | Regenerate the llms.txt / markdown mirrors (`scripts/generate-llms.ts`) |

Quality scripts (all require a server on `localhost:3000` serving `out/`, except
the view-source gate):

- `node scripts/qa-view-source.mts` — 30 checks on the _server-rendered HTML_
  (identity, meta, JSON-LD, crawlability…). The primary discoverability gate.
- `node scripts/axe-audit.mjs / /about/ /projects/ /contact/` — axe-core over
  the QA pages (WCAG 2.x A/AA) in a headless Chrome.
- `node scripts/lcp-identity.mjs` / `lcp-identity-mobile.mjs` — LCP-element
  probes (desktop / mobile-emulated).
- `node scripts/shift-probe.mjs`, `geo-probe.mjs` — layout-shift / geometry
  diagnostics.
- Lighthouse, the two ways the brief asks for:
  `npx lighthouse http://localhost:3000/ --only-categories=performance --port=0
--output=json --chrome-flags="--headless=new --no-sandbox --disable-gpu"`
  (default = simulated) and the same with `--throttling-method=devtools`.
  Verified: **sim LCP ≈ 2.3 s · devtools LCP ≈ 1.6 s · perf 0.97 · CLS 0**.

## LCP architecture (why the hero looks the way it does)

Chromium strips LCP-eligibility from images that (a) sit in a `position:fixed`
layer, (b) have a rect **exactly equal to the viewport**, or (c) extend beyond
the viewport — all empirically verified with the `t*.html` matrix of test pages
(kept alongside the report, see scripts). Consequently:

- Both splashscreen and hero artwork render **24px short of the fold** inside
  their containers (the strip is covered by the matching background/the design's
  own bottom fade — visually identical),
- the splash overlay is `position:absolute` (top of page), never fixed,
- the splash hosts the _same_ hero artwork as the page underneath, so the LCP
  image is topmost and un-covered from first paint, and the unmount is a
  seamless handoff to the identical hero,
- legibility gradients over the hero are deliberately partial-coverage.

## Content model & placeholders (swap before going live)

All copy/identity lives in Zod-validated `content/*.ts` — never hardcode text
in components:

| Where                                  | Placeholder                                       | Replace with                                                   |
| -------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `content/site.ts`                      | `email = "hello@vyn.example"`                     | the real contact address (mailto + JSON-LD)                    |
| `content/site.ts`                      | `domain = "https://vyn-cocreation.com"`           | the real canonical domain (also used by sitemap/robots/jsonld) |
| `content/site.ts`                      | `location = "Your City, Country"`                 | real location (llms.txt only)                                  |
| `content/projects.ts`                  | placeholder project entries where `isPlaceholder` | real case studies, live URLs and details                       |
| `public/images/projects/preview-*.svg` | generated preview placeholders                    | real project screenshots                                       |

Identity requirements (do not change them): the brand is **"VYN – CoCreation
Lab"** everywhere in titles/bio; the tagline "Vision Your Name" appears in the
footer only; links are `github.com/OodDev` and the LinkedIn profile configured
in `content/site.ts`. Contact is **mailto only** — no forms, no analytics, no
blog; site copy is English.

## Deployment

The site is a fully static export: upload `out/` to any static host (Vercel,
Netlify, S3/CloudFront, GitHub Pages). After any content change run
`npm run build`, then `npm run assets`/`npm run llms` only when imagery or
structured copy changed. Serving must keep the `trailingSlash` URL shape the
export emits (e.g. `/about/`); `npx serve out` handles it out of the box.
