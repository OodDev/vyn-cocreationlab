# Benefuturo

Category: cms · updated 2026-10-17

Website for Benefuturo, a social-purpose startup designing orientation-education programmes that bridge schools, universities, companies and institutions — a Squarespace build where the team publishes projects, people and news on their own.

Stack: Squarespace, CSS, SEO

Specs:
- Platform: Squarespace 7.1 (Fluid Engine)
- Build: Section & block layouts + custom CSS
- Type: Poppins + Raleway
- Language: Italian, single locale
- Forms: Native form block + GDPR consent

Links: [live](https://www.benefuturo.it/) · [repo](pending) · [HTML page](https://vyn-cocreation.com/projects/benefuturo/)

## Who they are

Benefuturo is a social-purpose innovative startup (startup innovativa a vocazione sociale) built around a network of national and international education experts: psychologists, pedagogists, teachers, project designers, communicators and artists, working from Pesaro with a legal seat in Camerino.

Its subject is orientation, but treated as a lifelong educational process rather than a single decision at a transition point — career education that starts in primary school and continues through lower and upper secondary school, tertiary education, adulthood and European projects. The site has to make that continuum legible to schools, universities, companies, families and institutions at the same time.

## What they do

Benefuturo designs and runs the programmes itself, from scientific direction to delivery in classrooms and with partners. The website therefore doubles as a capability statement and as the public index of that work.

- Scientific design and direction of educational projects
- European project design and partnership building
- Work with students and teacher training
- Networks and participatory processes
- EdTech tool development
- Educational events

## The brief

Three jobs, in order of difficulty: explain an ambitious, fairly abstract mission without resorting to brochure language; give each stage of education its own home so a primary-school programme never reads like an afterthought to a secondary-school one; and leave the whole thing editable by a small, distributed team with no developer in the loop.

That last requirement is what pushed the build onto Squarespace rather than a hand-coded stack. The trade-off is deliberate: the client keeps publishing on their own, and the engineering budget goes into typography, layout and the handful of behaviours the platform does not give you for free.

## Build & technical notes

Layouts are assembled from Squarespace 7.1 sections and blocks, then refined with a small custom CSS layer (LESS-compiled by the platform). Kept short on purpose — each rule earns its place.

The interesting work sits where the CMS stops cooperating: making whole cards clickable without nesting links, capping tall photo heroes on phones, and keeping the brand's overlapping-shape artwork readable at every width.

- Stretched-link pattern: each programme tile is a list item whose button is absolutely positioned across the whole tile with a transparent background — the entire card is clickable and keyboard-reachable, with no nested interactive elements.
- Mobile hero caps via collection-scoped CSS (35vh under 1024px, 25vh under 400px) so portrait photography does not swallow the fold on small screens.
- Typography split: Poppins for display and body, Raleway bold for primary buttons, applied through the platform's font pack plus CSS.
- Imagery served from the Squarespace CDN with requested widths and native lazy-loading, so retina screens get sharp crops without oversized downloads.
- Contact handled by the native form block — name, email, message and a mandatory data-processing consent — with mailto and LinkedIn as fallbacks.
- SEO hygiene on a hosted platform: per-page titles and descriptions, Open Graph metadata, a single canonical host, semantic heading order, descriptive alt text, and privacy/cookie pages linked from the footer.

## What made it interesting

Working inside a hosted platform inverts the usual priorities. There is no component library to reach for, so the engineering becomes CSS specificity, block structure and content modelling — deciding which pieces are templates, which are one-off sections, and which are content the client will duplicate next month.

The visual identity does the heavy lifting: geometric letterforms, colour-blocked illustrations and translucent overlapping shapes. The job of the layout was to stay quiet around it — generous white space, one clear type hierarchy, and colour used to separate audience stages rather than to decorate.
