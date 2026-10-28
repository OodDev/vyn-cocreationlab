import { SITE_URL, site } from "@/content/site";
import { about } from "@/content/about";
import { faq } from "@/content/faq";
import {
  categoryLabels,
  type Project,
  type ProjectWithMeta,
  type ProjectCategory,
} from "@/content/projects";

/**
 * JSON-LD builder — every node is generated from /content files, never
 * hand-duplicated, and references the same stable @ids:
 *
 * - Person (studio identity, named "VYN – CoCreation Lab" per the owner's
 *   entity decision)           →  `${SITE_URL}/#identity`
 * - WebSite                    →  `${SITE_URL}/#website`
 * - Home WebPage               →  `${SITE_URL}/#homepage`
 * - ProfilePage (/about)       →  `${SITE_URL}/about/#profile-page`
 * - CreativeWork (/projects/s) →  `${SITE_URL}/projects/<slug>/#creative-work`
 * - FAQPage (home)             →  `${SITE_URL}/#faq`
 *
 * The visible content on every page matches the markup emitted here.
 */

/** Stable @id of the Person / studio identity node. */
export const personId = `${SITE_URL}/#identity`;

type JsonNode = Record<string, unknown>;
type Graph = Array<JsonNode>;

export function personNode(): JsonNode {
  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.shortName,
    jobTitle: "Web Developer",
    description: site.description,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og/vyn-og.png`,
    // PLACEHOLDER awareness: sameAs points at the public profiles supplied
    // by the owner (GitHub org + LinkedIn).
    sameAs: [site.githubUrl, site.linkedinUrl],
    knowsAbout: site.expertise,
  };
}

export function websiteNode(): JsonNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    datePublished: "2026-10-17",
    dateModified: site.lastUpdated,
    creator: { "@id": personId },
  };
}

/** Home page node (landing page of the one-page site). */
export function homePageNode(): JsonNode {
  return {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#homepage`,
    url: `${SITE_URL}/`,
    name: "VYN – CoCreation Lab — Web Developing Portfolio",
    description: site.description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": personId },
    dateModified: site.lastUpdated,
  };
}

/** ProfilePage for /about (person biography page). */
export function profilePageNode(path: string): JsonNode {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}${path}#profile-page`,
    url: `${SITE_URL}${path}`,
    name: about.title,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": personId },
    dateModified: about.updatedAt,
    about: { "@id": personId },
  };
}

/** BreadcrumbList for inner pages. */
export function breadcrumbNode(
  path: string,
  items: Array<{ name: string; path: string }>,
): JsonNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path}#breadcrumb`,
    itemListElement: items.map(function (item, index): JsonNode {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      };
    }),
  };
}

/** CreativeWork node for one project — matches the visible project page. */
export function projectNode(project: ProjectWithMeta): JsonNode {
  const node: JsonNode = {
    "@type": "CreativeWork",
    "@id": `${SITE_URL}${project.href}#creative-work`,
    name: project.title,
    description: project.description,
    url: `${SITE_URL}${project.href}`,
    inLanguage: "en",
    genre: project.categoryLabel,
    author: { "@id": personId },
    creator: { "@id": personId },
    keywords: project.stack?.join(", "),
    dateModified: project.updatedOn ?? site.lastUpdated,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
  if (project.startedOn !== undefined) {
    node["dateCreated"] = project.startedOn;
  }
  const sameAs: Array<string> = [];
  if (project.liveUrl !== undefined && project.liveUrl.length > 0) {
    sameAs.push(project.liveUrl);
    node["exampleOfWork"] = project.liveUrl;
  }
  if (project.repoUrl !== undefined && project.repoUrl.length > 0) {
    sameAs.push(project.repoUrl);
  }
  if (sameAs.length > 0) {
    node["sameAs"] = sameAs;
  }
  return node;
}

/** FAQPage node — one Question per visible FAQ item. */
export function faqNode(): JsonNode {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faq.map(function (item): JsonNode {
      return {
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      };
    }),
  };
}

/** ItemList of all projects, for the /projects index. */
export function itemListNode(entries: Array<ProjectWithMeta>): JsonNode {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/projects/#project-list`,
    name: "Projects of VYN – CoCreation Lab",
    itemListElement: entries.map(function (project, index): JsonNode {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `${SITE_URL}${project.href}`,
      };
    }),
  };
}

/** Turn a graph into a safe JSON-LD string (escapes `<` to prevent `</script`). */
export function graphToJsonLd(graph: Graph): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

export interface PersonAndSiteGraphInput {
  page?: JsonNode;
}

/** Core graph (Person + WebSite) with an optional page-specific node. */
export function coreGraph(input: PersonAndSiteGraphInput = {}): Graph {
  const graph: Graph = [personNode(), websiteNode()];
  if (input.page !== undefined) {
    graph.push(input.page);
  }
  return graph;
}

/**
 * Human-friendly label wrapper used by the projects index and detail pages.
 * (Kept here so FAQ/project category naming stays in one place.)
 */
export function categoryLabelFor(category: ProjectCategory): string {
  return categoryLabels[category];
}

export type { Project, ProjectWithMeta, ProjectCategory };
