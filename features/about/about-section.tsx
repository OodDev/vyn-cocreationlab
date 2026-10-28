/**
 * About block (home section + teachable /about/ route share this component
 * via the standalone About page composition). Minimalistic style: an
 * answer-first lede, then experience and education lists.
 */
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { about } from "@/content/about";

export function AboutSection(): JSX.Element {
  return (
    <section
      id="about"
      data-section="about"
      aria-labelledby="about-heading"
      className="bg-surface relative py-24 sm:py-32"
    >
      <div className="neon-hairline absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="shell grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
        <Reveal className="lg:pt-2">
          <p className="kicker">About</p>
          <h2
            id="about-heading"
            className="font-display text-ink mt-4 text-4xl font-bold sm:text-5xl"
          >
            Who is VYN?
          </h2>
          <nav aria-label="About shortcuts" className="mt-8 hidden lg:block">
            <ul className="text-faint space-y-2 text-sm">
              <li>
                <a href="#about-bio" className="hover:text-accent transition-colors">
                  Bio
                </a>
              </li>
              <li>
                <a href="#about-experience" className="hover:text-accent transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="#about-education" className="hover:text-accent transition-colors">
                  Education
                </a>
              </li>
            </ul>
          </nav>
        </Reveal>

        <div className="max-w-3xl space-y-14">
          {/* Bio — answer-first */}
          <div id="about-bio" className="scroll-mt-24">
            <Reveal>
              <p className="text-ink/90 text-lg leading-relaxed sm:text-xl">{about.answer}</p>
              <p className="text-faint mt-5 text-sm leading-relaxed">{about.bio}</p>
              <p className="mt-6">
                <Link
                  href="/about/"
                  className="text-accent hover:text-ink inline-flex items-center gap-2 font-semibold transition-colors"
                >
                  Read the full about page
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </p>
            </Reveal>
          </div>

          {/* Experience */}
          <div id="about-experience" className="scroll-mt-24">
            <Reveal>
              <h3 className="font-display text-ink text-xl font-semibold">Experience</h3>
              <p className="text-muted mt-2 text-sm">{about.experienceAnswer}</p>
              <ol className="border-line mt-6 space-y-5 border-l pl-6">
                {about.experience.map(function (entry, index): JSX.Element {
                  return (
                    <li key={`${entry.role}-${index}`} className="relative">
                      <span
                        aria-hidden="true"
                        className="border-accent bg-bg absolute top-2 -left-[1.9rem] h-2.5 w-2.5 rounded-full border"
                      />
                      <p className="text-accent text-sm font-bold tracking-wide">
                        {entry.period}
                      </p>
                      <p className="font-display text-ink mt-1 text-lg font-medium">
                        {entry.role} · {entry.company}
                      </p>
                      <p className="text-muted mt-1 text-sm">{entry.summary}</p>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </div>

          {/* Education */}
          <div id="about-education" className="scroll-mt-24">
            <Reveal>
              <h3 className="font-display text-ink text-xl font-semibold">Education</h3>
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
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
