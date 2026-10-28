"use client";

import type { JSX } from "react";
import Link from "next/link";

/**
 * Route-level error boundary (client component by requirement).
 * Content stays static here; recovery happens via reset or the home link.
 */
export default function ErrorPage(props: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  const { reset } = props;

  return (
    <section
      aria-labelledby="error-title"
      className="shell flex min-h-[70svh] flex-col items-center justify-center text-center"
    >
      <p className="kicker">Something broke</p>
      <h1 id="error-title" className="font-display text-ink mt-4 text-4xl font-bold">
        An error interrupted this view
      </h1>
      <p className="text-muted mt-4 max-w-md">
        The rest of the site is fine. Try again, or reload from the home page.
      </p>
      <p className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-pill bg-accent text-bg hover:shadow-glow px-6 py-3 font-semibold transition-all hover:-translate-y-0.5"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent border px-6 py-3 font-semibold transition-colors"
        >
          Go to the home page
        </Link>
      </p>
    </section>
  );
}
