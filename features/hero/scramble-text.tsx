"use client";

import { useEffect, useState, type JSX } from "react";

/**
 * Scramble-in effect for the hero name on first page load, in the spirit of
 * hamishw.com: the text starts as Chinese-character placeholders and the real
 * characters resolve left-to-right over roughly a second.
 *
 * The first render (server and client) shows the SAME deterministic
 * placeholder sequence derived from the target text, so there is no hydration
 * mismatch and the page starts scrambled exactly like the reference site.
 * A visually hidden copy of the real text is always present for screen
 * readers and crawlers. Reduced-motion users get the final text immediately.
 */

/** Deterministic first-paint placeholder pool (pure CJK glyphs like the ref). */
const PLACEHOLDER = "火水金土木日月生龍夢光流雲風影生火土水";

/** Random pool for the earlier scramble ticks (mostly CJK + a few glyphs). */
const POOL = "一丁丄乂氷木火土金水日月生龍夢光流雲風影AELOSX#+*<>/";

const TICK_MS = 50;
/** Ticks of pure scramble before real characters start resolving. */
const HOLD_TICKS = 6;
/** Ticks until each successive character (left-to-right) resolves. */
const RESOLVE_TICKS = 2;

/** Total timeline duration of the scramble for a text of N chars (ms). */
export function scrambleDurationMs(length: number, speed: number = 1): number {
  return Math.round(
    (HOLD_TICKS + Math.ceil(length / RESOLVE_TICKS) * RESOLVE_TICKS) * (TICK_MS / speed),
  );
}

function placeholderFor(text: string): string {
  return text
    .split("")
    .map(function placeholder(ch: string, i: number): string {
      // Spaces stay spaces so line length / word rhythm is preserved.
      return ch === " " ? " " : (PLACEHOLDER[i % PLACEHOLDER.length] ?? "?");
    })
    .join("");
}

interface ScrambleTextProps {
  text: string;
  /** Start beat so the two title lines don't scramble in lockstep. */
  startDelayMs?: number;
  /** Timeline speed multiplier: >1 faster, 1 = nominal. */
  speed?: number;
}

export function ScrambleText(props: ScrambleTextProps): JSX.Element {
  const { text, startDelayMs = 0, speed = 1 } = props;
  // Deterministic placeholder → identical markup on server and hydration.
  const [display, setDisplay] = useState<string>(() => placeholderFor(text));

  useEffect(function scrambleIn(): (() => void) | undefined {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return undefined;
    }

    let tick = 0;
    let intervalId = 0;
    const timeoutId = window.setTimeout(function startScramble(): void {
      intervalId = window.setInterval(function tickScramble(): void {
        tick += 1;
        const total = HOLD_TICKS + Math.ceil(text.length / RESOLVE_TICKS) * RESOLVE_TICKS;
        if (tick >= total) {
          window.clearInterval(intervalId);
          setDisplay(text);
          return;
        }
        const resolved = Math.floor((tick - HOLD_TICKS) / RESOLVE_TICKS);
        setDisplay(
          text
            .split("")
            .map(function pick(ch: string, i: number): string {
              if (i < resolved || ch === " ") return ch;
              return POOL[Math.floor(Math.random() * POOL.length)] ?? "?";
            })
            .join(""),
        );
      }, Math.round(TICK_MS / speed));
    }, startDelayMs);

    return function stopScramble(): void {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, startDelayMs, speed]);

  return (
    <>
      <span aria-hidden="true">{display}</span>
      {/* Stable copy of the real text for screen readers + crawlers. */}
      <span className="sr-only">{text}</span>
    </>
  );
}
