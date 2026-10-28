import { z } from "zod";

/**
 * FAQ — real questions in natural language, answered from the site's actual
 * structure. Answers never fabricate specifics (availability dates, prices,
 * locations) that the owner has not provided; unknown facts stay placeholders
 * or point to contact. This same data feeds the visible FAQ section and the
 * FAQPage JSON-LD (structured data always reflects visible content).
 */

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  placeholder: z.boolean().default(false),
});

const faqSchema = z.object({
  updatedAt: z.string().date(),
  items: z.array(faqItemSchema).min(1),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type { z };

export const faq: Array<FaqItem> = faqSchema.parse({
  updatedAt: "2026-10-17",
  items: [
    {
      question: "Who is VYN – CoCreation Lab?",
      answer:
        "VYN – CoCreation Lab is the web developing practice behind this portfolio. It designs and builds websites end to end across three modes of delivery: AI-assisted projects, CMS projects and hand-coded applications.",
    },
    {
      question: "What services does VYN – CoCreation Lab offer?",
      answer:
        "Design-to-launch website development: marketing sites, web applications, headless CMS builds and AI-assisted tooling — always delivered with technical SEO, Core Web Vitals budgets and WCAG 2.2 AA accessibility practices built in.",
    },
    {
      question: "What technologies does VYN – CoCreation Lab work with?",
      answer:
        "The default stack is Next.js, React, TypeScript, Tailwind CSS and Framer Motion, with a Zod-validated content layer. CMS projects connect to headless or classic CMS platforms; hand-coded projects fall back to lighter, dependency-free setups when they serve the goal better.",
    },
    {
      question: "How can I hire VYN – CoCreation Lab?",
      answer:
        "Write an email — every contact link on this site opens a pre-filled message. Describe your project briefly and you will get a reply about scope, timeline and pricing.",
      // "pricing/timeline" intentionally not invented.
    },
    {
      question: "Where is VYN – CoCreation Lab located?",
      // PLACEHOLDER — replace once you have decided how public to be.
      answer: "{{LOCATION / REMOTE POLICY}}.",
      placeholder: true,
    },
    {
      question: "Why “Vision Your Name”?",
      answer:
        "It is the tagline behind the VYN name: the lab builds websites that put your name, product or idea in front of people with clarity and speed.",
    },
  ],
}).items;
