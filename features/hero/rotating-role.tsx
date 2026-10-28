"use client";

import { useEffect, useState, type JSX } from "react";
import { ScrambleText, scrambleDurationMs } from "@/features/hero/scramble-text";

/**
 * Rotating hero role label: "Web Developing" → "Photography" → "Drone".
 * Each slot: the word appears as Chinese-character placeholders (hamishw.com
 * style), resolves left-to-right (~0.5–1.0s depending on length), then the
 * fully-resolved word STAYS for 2 more seconds before the next slot begins.
 *
 * Speeds are per-role: "Web Developing" scraplbes 2× faster than the rest,
 * EXCEPT its very first appearance, which runs at 0.75× (slower reveal).
 * The cycle begins the moment the splash overlay actually leaves (observed
 * via removal of the `data-splash` flag from <html>, see SplashScreen), so
 * the FIRST thing revealed is plain "Web Developing" and the first
 * substitution happens on-camera — retuning the splash duration later
 * cannot desynchronize this start beat. Reduced-motion users see one static
 * role, no animation. Screen readers get the full list once; the moving
 * word is hidden from them.
 */

type Role = { label: string; speed: number };

const ROLES: Array<Role> = [
  { label: "Web Developing", speed: 2 },
  { label: "Photography", speed: 1 },
  { label: "Drone", speed: 1 },
];
/** How long the resolved word holds before the next slot starts. */
const STAY_MS = 1500;
/** Fallback start beat in case the splash flag never gets removed while
 * this component is mounted (~ splash GONE_AT_MS = 5370 + small buffer). */
const SPLASH_GONE_FALLBACK_MS = 5450;
/** The VERY first "Web Developing" appearance runs slower than the rest. */
const FIRST_RUN_SPEED = 0.75;

export function RotatingRole(): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const [reduced, setReduced] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  // The very first slot (initial "Web Developing") runs at FIRST_RUN_SPEED;
  // every later appearance of the same role uses its normal per-role speed.
  const [hasCycled, setHasCycled] = useState<boolean>(false);

  const slot: Role = ROLES[index] ?? ROLES[0] ?? { label: "", speed: 1 };
  const slotSpeed: number =
    index === 0 && !hasCycled ? FIRST_RUN_SPEED : slot.speed;

  // Begin the cycle the moment the splash overlay actually leaves: the
  // splash removes `data-splash` from <html> on unmount (the authoritative
  // teardown signal), so whichever way the splash timing is tuned the first
  // "Web Developing" slot is spent ON CAMERA. A timeout guards the edge
  // case where the flag is never set (e.g. reduced motion already handled
  // above, but a flag-less load can also occur after a skip-less teardown).
  useEffect(function beginWhenSplashLeaves(): (() => void) | undefined {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    if (query.matches) {
      return undefined;
    }

    let began = false;
    const begin = (): void => {
      if (began) return;
      began = true;
      setStarted(true);
    };

    const root: HTMLElement = document.documentElement;
    const splashArmed: boolean =
      root.getAttribute("data-splash") === "on";

    const fallbackId = window.setTimeout(
      begin,
      splashArmed ? SPLASH_GONE_FALLBACK_MS : 0,
    );

    if (!splashArmed) {
      return function cancelFallbackOnly(): void {
        window.clearTimeout(fallbackId);
      };
    }

    const observer = new MutationObserver(function onSplashFlagRemoved(): void {
      if (root.getAttribute("data-splash") !== "on") {
        begin();
      }
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-splash"],
      attributeOldValue: true,
    });

    return function cancelBegin(): void {
      window.clearTimeout(fallbackId);
      observer.disconnect();
    };
  }, []);

  // Schedule the next slot AFTER the current word fully resolves, so the
  // resolved word is on screen for STAY_MS (slot = scramble + stay).
  useEffect(function scheduleNextRole(): (() => void) | undefined {
    if (!started || reduced) {
      return undefined;
    }
    const timeoutId = window.setTimeout(
      function nextRole(): void {
        setHasCycled(true);
        setIndex(function advance(current: number): number {
          return (current + 1) % ROLES.length;
        });
      },
      scrambleDurationMs(slot.label.length, slotSpeed) + STAY_MS,
    );
    return function cancelNextRole(): void {
      window.clearTimeout(timeoutId);
    };
  }, [index, started, reduced, slot, slotSpeed]);

  // Reduced motion, or still waiting out the splash: one static word.
  if (reduced || !started) {
    return <span>{slot.label}</span>;
  }

  return (
    <>
      <span aria-hidden="true">
        {/* Remount per slot (and once at cycle start) → ScrambleText
         * restarts from its placeholders with no artificial delay. */}
        <ScrambleText
          key={`${index}:${started}`}
          text={slot.label}
          speed={slotSpeed}
          startDelayMs={0}
        />
      </span>
      <span className="sr-only">{ROLES.map(function labels(r: Role): string {
        return r.label;
      }).join(", ")}</span>
    </>
  );
}
