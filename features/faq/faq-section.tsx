import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { faq } from "@/content/faq";
import { FaqList } from "./faq-list";

/**
 * FAQ section (home). Visible Q&A + FAQPage JSON-LD emitted from the same
 * source data (see app/page.tsx).
 */
export function FaqSection(): JSX.Element {
  return (
    <section
      id="faqs"
      data-section="faqs"
      aria-labelledby="faqs-heading"
      className="bg-bg relative py-24 sm:py-32"
    >
      <div className="shell grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
        <Reveal className="lg:pt-2">
          <p className="kicker">FAQ</p>
          <h2
            id="faqs-heading"
            className="font-display text-ink mt-4 text-4xl font-bold sm:text-5xl"
          >
            Questions, answered
          </h2>
          <p className="text-muted mt-5 max-w-xs text-sm">
            The short, quotable answers — search and AI assistants can lift these directly.
          </p>
        </Reveal>
        <Reveal className="max-w-3xl">
          <FaqList items={faq} />
        </Reveal>
      </div>
    </section>
  );
}
