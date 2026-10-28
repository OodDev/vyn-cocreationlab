"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import { VynConstellation } from "@/components/brand/vyn-constellation";
import { SPLASH_FLAG_ATTR, SPLASH_STORE_KEY } from "@/lib/client-flags";
import { cn } from "@/lib/utils";

/**
 * First-visit splashscreen — PolarisBreathe (the chosen logo).
 *
 * The overlay markup is part of the initial (server-rendered) HTML, but it
 * is only *displayed* when the tiny boot script (see lib/client-flags.ts)
 * sets `data-splash="on"` — i.e. JS enabled, no `prefers-reduced-motion`.
 * (The original first-visit-only sessionStorage gate is disabled: the
 * overlay is shown on EVERY full page load/reload.)
 *
 * Consequences:
 * - crawlers/no-JS users never see it (the page content underneath is fully
 *   server-rendered);
 * - zero layout shift (fixed overlay);
 * - skipped entirely for reduced-motion users.
 *
 * LCP architecture (important): the overlay's only content is the logo SVG
 * (no hero artwork copy inside the overlay). The logo is the topmost,
 * uncovered element from the very first paint and becomes the LCP candidate
 * immediately; the real hero image underneath is painted over until the
 * splash leaves, so it doesn't compete as an earlier "worse" candidate.
 * (Chromium excludes any element fully painted over by other content from
 * LCP-eligibility.)
 *
 * Phases (match the logo's own four-stage choreography, see globals.css):
 *   hold    0.0 → 4.92s   the whole Polaris run: compass + pulse →
 *                         magnetized double-bounce stars → fast pencils
 *                         meet on the keystone → dashed edges march; the run
 *                         settles at 4.12s and the brand frame HOLDS 0.8s
 *                         before leaving
 *   leaving 4.92 → 5.37s  logo fades out — against the still OPAQUE
 *                         background, so the hero is never visible while
 *                         the logo is on screen
 *   gone    5.37s         overlay unmounts (bg removed) — the hero's own
 *                         entrance starts here (its `hero-enter` animations
 *                         are paused, see globals.css) → no overlap
 *   (Timings follow the 20%-faster logo; tune later as needed.)
 *
 * Clicking anywhere, or pressing Escape / Enter / Space, skips straight to
 * the fade-out.
 */

type SplashPhase = "hold" | "leaving" | "gone";

const LEAVE_AT_MS = 4920;
const GONE_AT_MS = 5370;

export function SplashScreen(): JSX.Element | null {
  const [phase, setPhase] = useState<SplashPhase>("hold");
  // Registered by the effect below; lets the React skip handlers (click)
  // reuse the exact same teardown logic even if a gesture lands before or
  // during mounting of the effect listeners.
  const skipRef = useRef<(() => void) | undefined>(undefined);

  useEffect(function startSplashTimers(): (() => void) | undefined {
    const root: HTMLElement = document.documentElement;
    if (root.getAttribute(SPLASH_FLAG_ATTR) !== "on") {
      // Repeat visit / reduced motion / no flag → never shown. The markup
      // stays rendered but the CSS keeps it `display: none`.
      return undefined;
    }

    let leaveTimer = 0;
    let cleanupTimer = 0;
    let done = false;

    const clearAllTimers = (): void => {
      if (leaveTimer !== 0) window.clearTimeout(leaveTimer);
      if (cleanupTimer !== 0) window.clearTimeout(cleanupTimer);
    };

    const rememberVisit = (): void => {
      try {
        window.sessionStorage.setItem(SPLASH_STORE_KEY, "1");
      } catch {
        // Storage unavailable — splash may re-show next load; harmless.
      }
    };

    const skip = (): void => {
      skipRef.current = undefined;
      if (done) return;
      done = true;
      clearAllTimers();
      rememberVisit();
      setPhase("leaving");
      cleanupTimer = window.setTimeout(function removeOverlay(): void {
        root.removeAttribute(SPLASH_FLAG_ATTR);
        setPhase("gone");
      }, 500);
    };
    skipRef.current = skip;

    leaveTimer = window.setTimeout(function beginLeave(): void {
      setPhase("leaving");
    }, LEAVE_AT_MS);

    cleanupTimer = window.setTimeout(function removeOverlay(): void {
      done = true;
      root.removeAttribute(SPLASH_FLAG_ATTR);
      setPhase("gone");
    }, GONE_AT_MS);

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        skip();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    (document.querySelector<HTMLElement>(".splash") as HTMLElement | null)?.addEventListener(
      "click",
      skip,
    );

    return function clearSplash(): void {
      clearAllTimers();
      window.removeEventListener("keydown", onKeyDown);
      skipRef.current = undefined;
      rememberVisit();
    };
  }, []);

  const skipViaReact = (): void => {
    skipRef.current?.();
  };

  if (phase === "gone") {
    return null;
  }

  return (
    <div
      className={cn(
        "splash",
        phase === "leaving" && "is-leaving",
      )}
      aria-hidden="true"
      onClick={skipViaReact}
    >
      {/* There is no artwork layer here on purpose: the splash's biggest
       * visible element is the wordmark SVG itself, which paints uncovered
       * at first paint and is LCP-eligible like any large image/hero
       * (Chromium only strips LCP candidacy when another element paints
       * fully OVER the candidate within the viewport). Removing the
       * overlay's own hero copy also means no duplicate hero download —
       * the hero image below loads for the hero, uncorked when the splash
       * leaves. */}
      <div className="splash-fade-in relative flex flex-col items-center">
        <div
          className="pointer-events-none absolute rounded-full blur-3xl"
          aria-hidden="true"
          style={{
            width: "40vmin",
            height: "40vmin",
            background: "radial-gradient(closest-side, rgba(75,225,236,0.16), transparent)",
          }}
        />
        {/* PolarisBreathe — the chosen main logo (LOGO-CHOSEN.md, recipe of
         * record: vyn-polaris-breathe.html). CSS-driven via the .c-* rules
         * (PolarisBreathe block) in globals.css's splash section. */}
        <VynConstellation className="splash-logo relative h-auto w-[min(76vw,560px)]" />
      </div>
    </div>
  );
}
