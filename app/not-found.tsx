import Link from "next/link";
import type { JSX } from "react";
import { VynWordmark } from "@/components/brand/vyn-wordmark";

/**
 * Custom 404 — polished, on-brand, useful links.
 */
export default function NotFound(): JSX.Element {
  return (
    <section
      aria-labelledby="not-found-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(75,225,236,0.12), transparent)",
        }}
      />
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(6rem,22vw,13rem)] leading-none font-bold text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(75,225,236,0.35)",
          }}
        >
          404
        </p>
        <VynWordmark className="-mt-6 h-8 w-auto opacity-70" title={null} />
        <h1
          id="not-found-title"
          className="font-display text-ink mt-8 text-3xl font-bold sm:text-4xl"
        >
          This page drifted out of view
        </h1>
        <p className="text-muted mt-4 max-w-md">
          The URL you tried does not exist (yet). Jump back to the work or write an email
          directly.
        </p>
        <p className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-pill bg-accent text-bg hover:shadow-glow px-6 py-3 font-semibold transition-all hover:-translate-y-0.5"
          >
            Back to home
          </Link>
          <Link
            href="/projects/"
            className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent border px-6 py-3 font-semibold transition-colors"
          >
            Browse projects
          </Link>
        </p>
      </div>
    </section>
  );
}
