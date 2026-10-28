"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Menu, X, Mail } from "lucide-react";
import { BrandGithubIcon, BrandLinkedinIcon } from "@/components/brand/brand-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type JSX } from "react";
import { VynWordmark } from "@/components/brand/vyn-wordmark";
import { mailtoHref, site } from "@/content/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/**
 * Sticky site header: brand link, section/route navigation with
 * active-section highlighting, social links, mail CTA, a scroll-progress
 * bar driven by a CSS scroll() timeline (zero JS), and a Radix (shadcn-style)
 * Dialog menu on mobile.
 */

interface NavItem {
  label: string;
  href: string;
  /** Home-section id for scroll-spy, when the item points at a home anchor. */
  sectionId?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  { label: "Projects", href: "/#projects", sectionId: "projects" },
  { label: "About", href: "/about/", sectionId: "about" },
  { label: "FAQ", href: "/#faqs", sectionId: "faqs" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

export function SiteHeader(): JSX.Element {
  const pathname: string = usePathname();
  const isHome: boolean = pathname === "/" || pathname === "";
  const activeSection: string | null = useActiveSection(
    NAV_ITEMS.flatMap(function (item): Array<string> {
      return item.sectionId !== undefined ? [item.sectionId] : [];
    }),
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(function trackScrollDepthForHeaderStyle(): () => void {
    let frame = 0;
    function onScroll(): void {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(function apply(): void {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function cleanup(): void {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || !isHome
          ? "border-line bg-bg/80 border-b backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-2">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="text-ink flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <VynWordmark className="h-7 w-auto" title={null} />
          <span className="font-display text-ink hidden text-sm font-bold tracking-[0.18em] sm:inline">
            {site.name.toUpperCase()}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(function (item): JSX.Element {
            const hrefIsRoute: boolean = item.href.startsWith("/#") === false;
            const routeActive: boolean =
              hrefIsRoute && pathname.startsWith(item.href.replace(/\/$/, "/"));
            const anchorActive: boolean =
              isHome &&
              item.sectionId !== undefined &&
              activeSection === item.sectionId &&
              item.href.startsWith("/#");
            const active: boolean = routeActive || anchorActive;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "text-accent" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-auto mt-0.5 block h-[2px] w-4 origin-center rounded-full transition-opacity",
                    active ? "bg-accent opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="VYN on GitHub (opens in a new tab)"
            className="text-muted hover:text-accent hidden rounded-md p-2.5 transition-colors sm:block"
          >
            <BrandGithubIcon size={18} aria-hidden="true" />
          </a>
          <a
            href={site.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="VYN on LinkedIn (opens in a new tab)"
            className="text-muted hover:text-accent hidden rounded-md p-2.5 transition-colors sm:block"
          >
            <BrandLinkedinIcon size={18} aria-hidden="true" />
          </a>
          <a
            href={mailtoHref()}
            className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent hover:shadow-glow hidden items-center gap-2 border px-4 py-2 text-sm font-semibold transition-all sm:flex"
          >
            <Mail size={16} aria-hidden="true" />
            Get in touch
          </a>

          {/* Mobile menu (Radix/Dialog; content rendered on demand). */}
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger
              className="text-ink rounded-md p-2.5 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} aria-hidden="true" />
            </DialogTrigger>
            <DialogContent
              className="bg-bg/95 fixed inset-0 z-[60] flex flex-col px-8 pt-5 pb-10 backdrop-blur-xl"
              aria-describedby={undefined}
            >
              <div className="flex items-center justify-between">
                <DialogTitle>
                  <span className="sr-only">Menu</span>
                  <VynWordmark className="h-8 w-auto" title={null} />
                </DialogTitle>
                <DialogClose className="text-ink rounded-md p-2.5" aria-label="Close menu">
                  <X size={24} aria-hidden="true" />
                </DialogClose>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex flex-col gap-2">
                {NAV_ITEMS.map(function (item): JSX.Element {
                  return (
                    <DialogClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="font-display text-ink hover:text-accent rounded-lg px-1 py-3 text-2xl font-medium transition-colors"
                      >
                        {item.label}
                      </Link>
                    </DialogClose>
                  );
                })}
              </nav>
              <div className="border-line mt-auto flex items-end justify-between border-t pt-6">
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <BrandGithubIcon size={18} aria-hidden="true" /> GitHub
                </a>
                <a
                  href={mailtoHref()}
                  className="text-muted hover:text-accent flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <Mail size={18} aria-hidden="true" /> Email
                </a>
                <a
                  href={site.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <BrandLinkedinIcon size={18} aria-hidden="true" /> LinkedIn
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Scroll progress bar (CSS scroll() timeline; plain 2px line when
       * scroll-driven animations are unsupported) */}
      <div
        aria-hidden="true"
        className="px-progressbar from-accent to-accent-2 h-[2px] origin-left bg-gradient-to-r"
      />
    </header>
  );
}
