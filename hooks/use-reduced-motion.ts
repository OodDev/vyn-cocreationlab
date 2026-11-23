"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe `prefers-reduced-motion: reduce` flag. The server snapshot
 * is always `false` (matching the server-rendered animated markup); the
 * client snapshot reads the real media query, and changes are subscribed —
 * so no setState-in-effect is needed and the value stays live if the user
 * flips the OS preference while the page is open.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query: MediaQueryList = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return function unsubscribe(): void {
    query.removeEventListener("change", onChange);
  };
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}