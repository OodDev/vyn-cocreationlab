/**
 * ★ DEV-ONLY HUD — live parallax pin-progress readout.
 *
 * Shows where you are in the scroll choreography as ONE shared number:
 * PIN %. PIN 0 = the sticky scene locks full-screen (the hero has
 * scrolled away); PIN 100 = the scene releases into the projects
 * section; NEGATIVE PIN = the roll-in before the lock (the sky
 * appearing): the
 * floor = −(100svh/pin travel) = the scene peek (PIN −38 on the 360svh
 * wrapper; see the timing sheet in globals.css). It exists so
 * scroll-timing instructions can be stated in one shared unit: scroll to
 * the frame you want an element to hit, read the badge, report "PIN
 * <n>%" (minuses count!). PIN ≥ 50 = the hold phase (the still frame,
 * thread drawing).
 *
 * Gated: it is only rendered in development (see the NODE_ENV guard
 * where it is mounted), never in the production bundle — the page
 * itself stays zero-JS.
 */
"use client";

import { type JSX, useEffect, useState } from "react";

export function ParallaxHud(): JSX.Element {
  const [pct, setPct] = useState<number | null>(null);
  const [phase, setPhase] = useState<"pin" | "hold" | "post">("pin");

  useEffect(function subscribe(): (() => void) {
    const update = (): void => {
      const scene = document.querySelector(".px-scene");
      if (!(scene instanceof HTMLElement)) return;
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh; // scroll distance of the pinned phase
      if (-rect.top >= travel) {
        setPhase("post");
        setPct(100);
        return;
      }
      // One formula for the whole roll: negative during the pre-pin
      // roll-in (rect.top > 0), 0 at the lock, up to 100 at release.
      // Floor = the scene peek, derived from geometry (−38 on the
      // 360svh wrapper); before that the hero covers everything anyway.
      const floor = -Math.round((vh / travel) * 100);
      const p = Math.max(floor, Math.round((-rect.top / travel) * 100));
      setPct(p);
      setPhase(p >= 50 ? "hold" : "pin");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return function unsubscribe(): void {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 left-4 z-[999] select-none rounded-full border border-line bg-bg/85 px-4 py-2 font-mono text-xs tracking-widest text-accent"
    >
      {phase === "post" ? "RELEASED" : phase === "hold" ? `PIN ${pct}% · HOLD` : `PIN ${pct}%`}
    </div>
  );
}
