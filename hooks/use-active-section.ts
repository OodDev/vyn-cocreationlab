"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Tracks which top-level home-page section is currently in view so the
 * sticky nav can highlight it. Uses IntersectionObserver with a band around
 * the vertical centre of the viewport; returns `null` when home isn't the
 * current page (route pages then highlight by pathname instead).
 *
 * @param sectionIds - ids of <section data-section> elements to observe
 */
export function useActiveSection(sectionIds: Array<string>): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Stable across renders (Next router state) and falsy outside home.
  const enabled: boolean = usePathname() === "/";
  const idsKey: string = sectionIds.join(",");

  useEffect(
    function observeSections(): (() => void) | undefined {
      // Outside the home page scroll-spy is disabled; stale state cannot
      // mis-highlight because the header ANDs it with `isHome`.
      if (!enabled) {
        return undefined;
      }

      const elements: Array<Element> = idsKey
        .split(",")
        .map(function (id: string): Element | null {
          return document.getElementById(id);
        })
        .filter(function (element): element is NonNullable<Element> {
          return element !== null;
        });

      if (elements.length === 0) return undefined;

      const observer = new IntersectionObserver(
        function handleIntersections(entries: Array<IntersectionObserverEntry>): void {
          const visible: Array<IntersectionObserverEntry> = entries.filter(
            (entry) => entry.isIntersecting,
          );
          if (visible.length > 0) {
            // Pick the entry closest to viewport centre.
            const best: IntersectionObserverEntry = visible.reduce(function (
              a: IntersectionObserverEntry,
              b: IntersectionObserverEntry,
            ): IntersectionObserverEntry {
              const scoreA: number = Math.abs(a.intersectionRatio - 0.6);
              const scoreB: number = Math.abs(b.intersectionRatio - 0.6);
              return scoreB < scoreA ? b : a;
            });
            const id: string | null = (best.target as HTMLElement).dataset.section ?? null;
            setActiveId(id);
          }
        },
        {
          rootMargin: "-38% 0px -52% 0px",
          threshold: [0, 0.15, 0.4, 0.75, 1],
        },
      );

      elements.forEach(function (element): void {
        observer.observe(element);
      });
      return function disconnect(): void {
        observer.disconnect();
      };
    },
    [enabled, idsKey],
  );

  return activeId;
}
