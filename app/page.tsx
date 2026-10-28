import type { Metadata } from "next";
import type { JSX } from "react";
import { HeroSection } from "@/features/hero/hero-section";
import { ParallaxScene } from "@/features/parallax/parallax-scene";
import { ParallaxHud } from "@/features/parallax/parallax-hud";
import { ProjectsShowcase } from "@/features/projects/projects-showcase";
import { AboutSection } from "@/features/about/about-section";
import { FaqSection } from "@/features/faq/faq-section";
import { ContactSection } from "@/features/contact/contact-section";
import { buildMetadata } from "@/lib/seo";
import { faqNode, graphToJsonLd, homePageNode } from "@/lib/structured-data";

/**
 * Home = one-page scroll through all sections, fully server-rendered.
 * JSON-LD: WebPage (home) + FAQPage, on top of the core Person/WebSite graph
 * from the layout.
 */
export function generateMetadata(): Metadata {
  return buildMetadata({ path: "/" });
}

export default function HomePage(): JSX.Element {
  const pageJsonLd: string = graphToJsonLd([homePageNode(), faqNode()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd }} />
      {/* Markdown alternate for LLM ingestion (see /index.md) */}
      <link
        rel="alternate"
        type="text/markdown"
        title="Home — markdown version"
        href="/index.md"
      />
      <HeroSection />
      <ParallaxScene />
      {/* DEV-ONLY: live PIN % readout for scroll-timing instructions —
       * dead-code eliminated from the production build by this guard. */}
      {process.env.NODE_ENV === "development" ? <ParallaxHud /> : null}
      <ProjectsShowcase />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
