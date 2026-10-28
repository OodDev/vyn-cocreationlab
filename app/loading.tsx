import type { JSX } from "react";

/**
 * Minimal loading state between client navigations (no layout shift: the
 * spinner is a fixed-size composited element).
 */
export default function Loading(): JSX.Element {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="bg-bg/60 fixed inset-0 z-[80] grid place-items-center backdrop-blur-sm"
    >
      <span
        className="border-line-strong border-t-accent block h-12 w-12 animate-spin rounded-full border-2"
        aria-hidden="true"
      />
    </div>
  );
}
