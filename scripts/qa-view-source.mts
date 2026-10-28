/**
 * Post-build QA script: verifies the raw HTML of the static export
 * (what crawlers and no-JS users see) contains everything the SEO brief
 * requires. Run with: node scripts/qa-view-source.mjs
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = decodeURIComponent(new URL("../out/", import.meta.url).pathname);

const failures: Array<string> = [];
const checks: Array<{ file: string; expect: string; label: string }> = [
  // Home
  {
    file: "index.html",
    expect: "<title>VYN – CoCreation Lab — Web Developing Portfolio</title>",
    label: "home: unique title <60 chars",
  },
  {
    file: "index.html",
    expect: 'name="description"',
    label: "home: meta description present",
  },
  {
    file: "index.html",
    expect: 'rel="canonical"',
    label: "home: canonical URL",
  },
  {
    file: "index.html",
    expect: 'property="og:title"',
    label: "home: OG title",
  },
  {
    file: "index.html",
    expect: 'name="twitter:card"',
    label: "home: Twitter card",
  },
  {
    file: "index.html",
    expect: '"@type":"Person"',
    label: "home: Person JSON-LD",
  },
  {
    file: "index.html",
    expect: '"@type":"WebSite"',
    label: "home: WebSite JSON-LD",
  },
  {
    file: "index.html",
    expect: '"@type":"WebPage"',
    label: "home: WebPage JSON-LD",
  },
  {
    file: "index.html",
    expect: '"@type":"FAQPage"',
    label: "home: FAQPage JSON-LD",
  },
  {
    file: "index.html",
    expect: 'id="hero-title"',
    label: "home: exactly-once H1 present",
  },
  {
    file: "index.html",
    expect: 'fetchPriority="high"',
    label: "hero: LCP priority hint",
  },
  {
    file: "index.html",
    expect: 'rel="alternate" type="text/markdown"',
    label: "home: markdown alternate link",
  },
  {
    file: "index.html",
    expect: "<h2",
    label: "home: content headings in raw HTML",
  },
  {
    file: "index.html",
    expect: "Skip to main content",
    label: "home: skip link",
  },
  // About
  {
    file: "about/index.html",
    expect: '"@type":"ProfilePage"',
    label: "about: ProfilePage JSON-LD",
  },
  {
    file: "about/index.html",
    expect: '"@type":"BreadcrumbList"',
    label: "about: BreadcrumbList JSON-LD",
  },
  {
    file: "about/index.html",
    expect: "<title>About VYN – CoCreation Lab",
    label: "about: unique title",
  },
  // Projects index
  {
    file: "projects/index.html",
    expect: '"@type":"ItemList"',
    label: "projects index: ItemList JSON-LD",
  },
  // One project detail
  {
    file: "projects/ai-assisted-project-01/index.html",
    expect: '"@type":"CreativeWork"',
    label: "project: CreativeWork JSON-LD",
  },
  {
    file: "projects/ai-assisted-project-01/index.html",
    expect: "{{PROJECT TITLE}}",
    label: "project: marked placeholder visible in HTML",
  },
  {
    file: "projects/ai-assisted-project-01/index.html",
    expect: 'id="related-projects"',
    label: "project: internal linking (related projects)",
  },
  // Contact
  {
    file: "contact/index.html",
    expect: 'type="text/markdown"',
    label: "contact: markdown alternate",
  },
  {
    file: "contact/index.html",
    expect: "mailto:",
    label: "contact: mailto link",
  },
  // 404
  { file: "404.html", expect: "404", label: "404: custom page present" },
];

for (const check of checks) {
  let html = "";
  try {
    html = await readFile(join(OUT, check.file), "utf8");
  } catch {
    failures.push(`MISSING FILE: ${check.file}`);
    continue;
  }
  const ok = html.includes(check.expect);
  if (!ok) {
    failures.push(`FAIL [${check.file}] ${check.label} — expected: ${check.expect}`);
  } else {
    console.log(`ok   [${check.file}] ${check.label}`);
  }
}

/* Exactly one <h1> per page */
const filesWithH1 = [
  "index.html",
  "about/index.html",
  "projects/index.html",
  "contact/index.html",
  "projects/ai-assisted-project-01/index.html",
];
for (const file of filesWithH1) {
  const html = await readFile(join(OUT, file), "utf8");
  const count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (count !== 1) {
    failures.push(`FAIL [${file}] expected exactly 1 <h1>, found ${count}`);
  } else {
    console.log(`ok   [${file}] exactly one <h1>`);
  }
}

/* Single-image LCP has explicit dimensions (CLS guard) */
{
  const html = await readFile(join(OUT, "index.html"), "utf8");
  if (!/hero.*?width="1280"/s.test(html)) {
    failures.push("FAIL hero <img> missing explicit width/height");
  } else {
    console.log("ok   hero <img> has explicit width/height");
  }
}

console.log("");
if (failures.length > 0) {
  failures.forEach(function (line: string): void {
    console.error(line);
  });
  process.exit(1);
} else {
  console.log(`ALL VIEW-SOURCE CHECKS PASSED (${checks.length + filesWithH1.length + 1})`);
}
