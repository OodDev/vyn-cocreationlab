/**
 * Build-time LLM-facing text artifacts, generated from /content
 * (single source of truth — never hand-duplicated):
 *
 * - /public/llms.txt            (concise, per the llms.txt convention)
 * - /public/llms-full.txt       (full Markdown mirror)
 * - /public/index.md            (home summary)
 * - /public/about.md
 * - /public/contact.md
 * - /public/projects.md         (projects index)
 * - /public/projects/<slug>.md  (one per project)
 *
 * Run via `node scripts/generate-llms.ts` (Node ≥ 23.6 type-strips .ts).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, SITE_URL, mailtoHref } from "../content/site.ts";
import { about } from "../content/about.ts";
import { faq } from "../content/faq.ts";
import { projects, projectCategories, type Project } from "../content/projects.ts";

const ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR: string = join(ROOT, "public");

async function write(filePath: string, data: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, data, "utf8");
  console.log("wrote", filePath.replace(PUBLIC_DIR, "public") as string);
}

function projectMdn(project: Project): string {
  return `# ${project.title}

Category: ${project.category} · updated ${project.updatedOn ?? site.lastUpdated}

${project.description}

Stack: ${project.stack.join(", ")}

Links: [live](${project.liveUrl ?? "pending"}) · [repo](${project.repoUrl ?? "pending"}) · [HTML page](${SITE_URL}/projects/${project.slug}/)
`;
}

async function main(): Promise<void> {
  const heading: string = `# ${site.name}`;
  const summaryQuote: string = `> ${site.description} Tagline: *${site.tagline}*.`;

  const pagesSection: string = [
    `## Pages`,
    "",
    `- [Home](${SITE_URL}/): one-page portfolio with projects, about, FAQ and contact. Markdown: [index.md](${SITE_URL}/index.md)`,
    `- [Projects index](${SITE_URL}/projects/): all ${projects.length} case studies grouped in three parts. Markdown: [projects.md](${SITE_URL}/projects.md)`,
    ...projects.map(function (project: Project): string {
      return `  - \`${project.slug}\` (${project.category}): [case-study page](${SITE_URL}/projects/${project.slug}/) · markdown: [${project.slug}.md](${SITE_URL}/projects/${project.slug}.md)`;
    }),
    `- [About](${SITE_URL}/about/): bio, experience, education, profiles. Markdown: [about.md](${SITE_URL}/about.md)`,
    `- [Contact](${SITE_URL}/contact/): email-first, no forms. Markdown: [contact.md](${SITE_URL}/contact.md)`,
    "",
  ].join("\n");

  const entitySection: string = [
    `## Entity`,
    "",
    `- Name: ${site.name} (short: ${site.shortName})`,
    `- Role: ${site.role}`,
    `- Contact: ${site.email} (mailto: ${mailtoHref()})`,
    `- GitHub: ${site.githubUrl}`,
    `- LinkedIn: ${site.linkedinUrl}`,
    `- Location: ${site.location.length > 0 ? site.location : "not published"}`,
    `- Last updated: ${site.lastUpdated}`,
    `- Expertise: ${site.expertise.join(", ")}`,
    "",
  ].join("\n");

  const llmsTxt: string = `${heading}\n\n${summaryQuote}\n\n${pagesSection}\n${entitySection}`;

  /* ── llms-full.txt — everything, quotable, dated. ── */
  const faqBlock: string = [
    `## Frequently asked questions`,
    "",
    ...faq.flatMap(function (item): Array<string> {
      return [`### ${item.question}`, "", item.answer, ""];
    }),
  ].join("\n");

  const projectsBlock: string = projects
    .map(function (project: Project): string {
      return projectMdn(project);
    })
    .join("\n---\n\n");

  const llmsFull: string = `${heading}\n\n${summaryQuote}\n\n${pagesSection}\n${entitySection}\n## About\n\n${about.answer}\n\n${about.bio}\n\n### Experience\n\n${about.experience
    .map(function (entry): string {
      return `- ${entry.period}: ${entry.role} — ${entry.company}. ${entry.summary}`;
    })
    .join("\n")}\n\n### Education\n\n${about.education
    .map(function (entry): string {
      return `- ${entry.period}: ${entry.degree} — ${entry.institution}`;
    })
    .join("\n")}\n\n${projectsBlock}\n${faqBlock}`;

  /* ── Individual page mirrors ── */
  const indexMd: string = `${heading}\n\n${summaryQuote}\n\nThis page links: hero identity, ${projects.length} project case studies (three parts: AI-assisted, CMS, hand-coded), about, FAQ, contact.\n\n- ${SITE_URL}/about/\n- ${SITE_URL}/projects/\n- ${SITE_URL}/contact/\n`;

  const aboutMd: string = `# About ${site.name}\n\n${about.answer}\n\n${about.bio}\n\n## Experience\n\n${about.experience
    .map(function (entry): string {
      return `- **${entry.role}** · ${entry.company} (${entry.period}) — ${entry.summary}`;
    })
    .join("\n")}\n\n## Education\n\n${about.education
    .map(function (entry): string {
      return `- **${entry.degree}** · ${entry.institution} (${entry.period})`;
    })
    .join("\n")}\n`;

  const contactMd: string = `# Contact ${site.name}\n\nOne email, no forms: ${site.email}\n\n- GitHub: ${site.githubUrl}\n- LinkedIn: ${site.linkedinUrl}\n`;

  const projectsMd: string = `# Projects — ${site.name}\n\n${projectCategories
    .map(function (category): string {
      const inCategory: Array<Project> = projects.filter(function (project) {
        return project.category === category.id;
      });
      const lines: Array<string> = [`## ${category.label}`, "", category.blurb, ""];
      inCategory.forEach(function (project: Project): void {
        lines.push(
          `- **${project.title}** — ${project.description} [page](${SITE_URL}/projects/${project.slug}/)`,
        );
      });
      return lines.join("\n");
    })
    .join("\n\n")}\n`;

  await write(join(PUBLIC_DIR, "llms.txt"), llmsTxt);
  await write(join(PUBLIC_DIR, "llms-full.txt"), llmsFull);
  await write(join(PUBLIC_DIR, "index.md"), indexMd);
  await write(join(PUBLIC_DIR, "about.md"), aboutMd);
  await write(join(PUBLIC_DIR, "contact.md"), contactMd);
  await write(join(PUBLIC_DIR, "projects.md"), projectsMd);
  for (const project of projects) {
    await write(join(PUBLIC_DIR, "projects", `${project.slug}.md`), projectMdn(project));
  }
}

main().catch(function (error: unknown): void {
  console.error(error);
  process.exit(1);
});
