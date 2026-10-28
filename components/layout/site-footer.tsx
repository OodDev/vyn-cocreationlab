import { Mail } from "lucide-react";
import { BrandGithubIcon, BrandLinkedinIcon } from "@/components/brand/brand-icons";
import Link from "next/link";
import type { JSX } from "react";
import { VynWordmark } from "@/components/brand/vyn-wordmark";
import { mailtoHref, site } from "@/content/site";

/**
 * Site footer: brand with the "Vision Your Name" tagline (its only intended
 * placement), page links, contact/socials, and ownership/last-updated line.
 */
export function SiteFooter(): JSX.Element {
  const year: number = new Date().getFullYear();

  return (
    <footer className="border-line bg-surface relative mt-4 border-t">
      <div className="neon-hairline absolute inset-x-0 -top-px" aria-hidden="true" />
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8">
        <div>
          <VynWordmark className="h-9 w-auto" title="VYN wordmark" />
          <p className="text-muted mt-4 max-w-xs text-sm">
            {site.name}
            <span className="font-display text-faint mt-1 block text-xs tracking-[0.3em] uppercase">
              {site.tagline}
            </span>
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="kicker text-accent-2">Pages</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted hover:text-accent transition-colors">
                Home — portfolio overview
              </Link>
            </li>
            <li>
              <Link
                href="/projects/"
                className="text-muted hover:text-accent transition-colors"
              >
                Projects index
              </Link>
            </li>
            <li>
              <Link href="/about/" className="text-muted hover:text-accent transition-colors">
                About the lab
              </Link>
            </li>
            <li>
              <Link href="/#faqs" className="text-muted hover:text-accent transition-colors">
                Frequently asked questions
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="kicker text-accent-2">Connect</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={mailtoHref()}
                className="text-muted hover:text-accent inline-flex items-center gap-2 transition-colors"
              >
                <Mail size={16} aria-hidden="true" /> Write an email
              </a>
            </li>
            <li>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent inline-flex items-center gap-2 transition-colors"
              >
                <BrandGithubIcon size={16} aria-hidden="true" /> GitHub
              </a>
            </li>
            <li>
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent inline-flex items-center gap-2 transition-colors"
              >
                <BrandLinkedinIcon size={16} aria-hidden="true" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell border-line text-faint flex flex-col gap-2 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
        <p>Last updated {site.lastUpdated}</p>
      </div>
    </footer>
  );
}
