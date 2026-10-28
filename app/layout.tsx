import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SplashScreen } from "@/components/layout/splash-screen";
import { bootFlagsScript } from "@/lib/client-flags";
import { RouteA11y } from "@/components/layout/route-a11y";
import {
  buildMetadata,
  defaultDescription,
  defaultTitle,
  metadataBase,
  siteName,
} from "@/lib/seo";
import { coreGraph, graphToJsonLd } from "@/lib/structured-data";
import { HERO_SIZES, heroImage } from "@/lib/media";
import "./globals.css";

/*
 * Self-hosted via next/font (downloaded + subset at build, `swap`, preloaded).
 * Two families maximum per the performance brief.
 */
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const base: Metadata = buildMetadata();
  return {
    ...base,
    metadataBase: metadataBase(),
    title: {
      default: defaultTitle,
      template: `%s — ${siteName}`,
    },
    description: defaultDescription,
    icons: {
      icon: [
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon/icon-96.png", sizes: "96x96", type: "image/png" },
      ],
      shortcut: "/favicon/favicon.svg",
      apple: "/favicon/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    alternates: {
      ...base.alternates,
    },
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: "#050d10",
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
  };
}

export default function RootLayout(props: { children: ReactNode }): JSX.Element {
  const { children } = props;
  // Core graph: Person + WebSite, shared by every page. Page-specific nodes
  // (ProfilePage, Breadcrumbs, CreativeWork, FAQPage…) are added per page.
  const coreJsonLd: string = graphToJsonLd(coreGraph());

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint: arms motion + splash only where allowed. */}
        <script dangerouslySetInnerHTML={{ __html: bootFlagsScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: coreJsonLd }} />
        {/* LCP image oracle: the hero artwork is the largest element on the
         * homepage. Preloading the primary (AVIF) candidate set with the
         * exact srcset/sizes consumed by the <picture> guarantees browser
         * discovery before render, mirrors SmartImage's heroImage constants. */}
        <link
          rel="preload"
          as="image"
          imageSrcSet={heroImage.sources[0]!.srcSet}
          imageSizes={HERO_SIZES}
          fetchPriority="high"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="focus:bg-accent focus:text-bg sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <SplashScreen />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <RouteA11y />
      </body>
    </html>
  );
}
