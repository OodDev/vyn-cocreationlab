import type { Metadata } from "next";
import type { JSX } from "react";
import { ContactSection } from "@/features/contact/contact-section";
import { SITE_URL } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graphToJsonLd, personNode, websiteNode } from "@/lib/structured-data";

/**
 * Contact page — deep-linkable alternative to the home contact section.
 * No form (per brief): mailto only + public profiles.
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/contact",
    title: "Contact — write an email",
    description:
      "The fastest way to start is one email: describe the project and get a reply on scope, timeline and pricing. No forms, no tracking pixels.",
  });
}

export default function ContactPage(): JSX.Element {
  const jsonLd: string = graphToJsonLd([
    personNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/contact/#web-page`,
      url: `${SITE_URL}/contact/`,
      name: "Contact VYN – CoCreation Lab",
      description: "Write one email to start a conversation about scope, timeline and pricing.",
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#identity` },
      dateModified: "2026-10-17",
    },
    breadcrumbNode("/contact/", [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact/" },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <link
        rel="alternate"
        type="text/markdown"
        title="Contact — markdown version"
        href="/contact.md"
      />
      <ContactSection variant="page" />
    </>
  );
}
