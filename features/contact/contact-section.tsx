import { ArrowUpRight, Mail } from "lucide-react";
import { BrandGithubIcon, BrandLinkedinIcon } from "@/components/brand/brand-icons";
import Link from "next/link";
import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { mailtoHref, site } from "@/content/site";

/**
 * Contact — deliberately form-free per the brief: one easy email link
 * (mailto with pre-filled subject), plus the public profiles.
 * Used as a home <section> (h2 + data-section) and as the /contact page
 * (h1, for exactly-one-heading-per-page semantics).
 */
export interface ContactSectionProps {
  variant?: "section" | "page";
}

export function ContactSection(props: ContactSectionProps): JSX.Element {
  const { variant = "section" } = props;
  const isPage: boolean = variant === "page";
  const Heading: "h1" | "h2" = isPage ? "h1" : "h2";
  const headingId: string = isPage ? "contact-page-heading" : "contact-heading";
  const headingClass: string =
    "mt-4 max-w-2xl font-display font-bold leading-tight text-ink" +
    (isPage ? " text-5xl sm:text-6xl" : " text-4xl sm:text-5xl");
  const sectionId: string = isPage ? "contact-page" : "contact";
  const markedHeadingId: string = isPage ? headingId : "contact-heading";
  return (
    <section
      id={sectionId}
      data-section={isPage ? undefined : "contact"}
      aria-labelledby={markedHeadingId}
      className={
        isPage
          ? "bg-surface relative overflow-hidden pb-28 sm:pb-36"
          : "bg-surface relative overflow-hidden py-28 sm:py-36"
      }
    >
      <div className="neon-hairline absolute inset-x-0 top-0" aria-hidden="true" />
      {/* centred glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(75,225,236,0.14), transparent)",
        }}
      />
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="kicker">Contact</p>
          <Heading id={headingId} className={headingClass}>
            {isPage ? "Contact VYN – CoCreation Lab" : "Have a project in mind?"}
          </Heading>
          <p className="text-muted mx-auto mt-5 max-w-xl">
            {`How can you hire ${site.name}? Write an email — describe your idea briefly and you will get a reply about scope, timeline and pricing.`}
          </p>
          <p className="mt-10">
            <a
              href={mailtoHref()}
              className="rounded-pill bg-accent font-display text-bg hover:shadow-glow inline-flex items-center gap-3 px-9 py-4 text-lg font-semibold transition-all hover:-translate-y-0.5"
            >
              <Mail size={20} aria-hidden="true" />
              Write an email
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </p>
          <p className="text-muted mt-4 text-sm">
            <a
              href={`mailto:${site.email}`}
              className="text-accent decoration-line-strong hover:text-ink underline decoration-2 underline-offset-4 transition-colors"
            >
              {site.email}
            </a>
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-3">
            <li>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <BrandGithubIcon size={16} aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <BrandLinkedinIcon size={16} aria-hidden="true" />
                LinkedIn
              </a>
            </li>
            <li>
              <Link
                href="/projects/"
                className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Browse projects
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
