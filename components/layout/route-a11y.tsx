/**
 * Route focus + live page-title announcement for screen readers
 * (WCAG 2.2 AA focus management on route changes).
 *
 * Runs on every pathname change: moves focus to <main> (which is focusable
 * via tabindex="-1") and announces the new document title through a polite
 * live region. Some routers skip player announcements on client navigation;
 * Next.js App Router also updates the title normally, so this complements it.
 */
"use client";

import { usePathname } from "next/navigation";
import { useEffect, type JSX } from "react";

export function RouteA11y(): JSX.Element {
  const pathname: string = usePathname();

  useEffect(
    function manageRouteAccessibility(): void {
      const main: HTMLElement | null = document.getElementById("main-content");
      if (main !== null) {
        main.focus({ preventScroll: true });
      }
      const announcer: HTMLElement | null = document.getElementById("route-announcer");
      if (announcer !== null) {
        announcer.textContent = document.title;
      }
    },
    [pathname],
  );

  return <p id="route-announcer" className="sr-only" role="status" aria-live="polite" />;
}
