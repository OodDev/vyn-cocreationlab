import type { Metadata } from "next";
import type { JSX } from "react";
import { BrandGithubIcon, BrandLinkedinIcon } from "@/components/brand/brand-icons";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graphToJsonLd, profilePageNode } from "@/lib/structured-data";

/**
 * Standalone About page (the home section's deep-linkable twin).
 * JSON-LD: ProfilePage (mainEntity → the Person author).
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/about",
    title: "About VYN – CoCreation Lab",
    description:
      "Who is VYN – CoCreation Lab? A web developing practice spanning AI-assisted builds, CMS projects and hand-coded apps — bio, experience and education in one place.",
  });
}

export default function AboutPage(): JSX.Element {
  const jsonLd: string = graphToJsonLd([
    profilePageNode("/about/"),
    breadcrumbNode("/about/", [
      { name: "Home", path: "/" },
      { name: "About", path: "/about/" },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <link
        rel="alternate"
        type="text/markdown"
        title="About — markdown version"
        href="/about.md"
      />
      <article className="shell pt-36 pb-28">
        <nav aria-label="Breadcrumb" className="text-faint mb-10 text-sm">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-muted">
              About
            </li>
          </ol>
        </nav>

        <Reveal>
          <p className="kicker">About</p>
          <h1
            tabIndex={-1}
            className="font-display text-ink mt-4 text-5xl font-bold sm:text-6xl"
          >
            {about.title}
          </h1>
          <p className="text-ink/90 mt-8 max-w-3xl text-lg leading-relaxed sm:text-xl">
            {about.answer}
          </p>
          <p className="text-faint mt-6 max-w-3xl text-sm">{about.bio}</p>
        </Reveal>

        <Reveal className="mt-14 grid max-w-3xl gap-4 sm:flex sm:items-center">
          <span className="text-faint text-sm font-semibold">
            Author, byline and profiles — one entity everywhere:
          </span>
          <span className="flex gap-3">
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold transition-colors"
            >
              <BrandGithubIcon size={16} aria-hidden="true" />
              GitHub
            </a>
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold transition-colors"
            >
              <BrandLinkedinIcon size={16} aria-hidden="true" />
              LinkedIn
            </a>
          </span>
        </Reveal>

        <section aria-labelledby="about-exp" className="mt-16 max-w-3xl">
          <h2 id="about-exp" className="font-display text-ink text-2xl font-semibold">
            Experience
          </h2>
          <p className="text-muted mt-2 text-sm">{about.experienceAnswer}</p>
          <ol className="border-line mt-6 space-y-5 border-l pl-6">
            {about.experience.map(function (entry, index): JSX.Element {
              return (
                <li key={`${entry.role}-${index}`} className="relative">
                  <span
                    aria-hidden="true"
                    className="border-accent bg-bg absolute top-2 -left-[1.9rem] h-2.5 w-2.5 rounded-full border"
                  />
                  <p className="text-accent text-sm font-bold tracking-wide">{entry.period}</p>
                  <p className="font-display text-ink mt-1 text-lg font-medium">
                    {entry.role} · {entry.company}
                  </p>
                  <p className="text-muted mt-1 text-sm">{entry.summary}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="about-edu" className="mt-14 max-w-3xl">
          <h2 id="about-edu" className="font-display text-ink text-2xl font-semibold">
            Education
          </h2>
          <p className="text-muted mt-2 text-sm">{about.educationAnswer}</p>
          <ol className="border-line mt-6 space-y-5 border-l pl-6">
            {about.education.map(function (entry, index): JSX.Element {
              return (
                <li key={`${entry.degree}-${index}`} className="relative">
                  <span
                    aria-hidden="true"
                    className="border-accent-2 bg-bg absolute top-2 -left-[1.9rem] h-2.5 w-2.5 rounded-full border"
                  />
                  <p className="text-accent-2 text-sm font-bold tracking-wide">
                    {entry.period}
                  </p>
                  <p className="font-display text-ink mt-1 text-lg font-medium">
                    {entry.degree} · {entry.institution}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      </article>
    </>
  );
}
