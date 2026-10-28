/**
 * Re-renders on every route change and replays a subtle CSS entrance, which
 * gives client-side navigations the "SPA feel" while keeping routes
 * server-rendered and crawlable. Animates transform + opacity only, and is
 * neutralised by the reduced-motion override in globals.css.
 */
import type { JSX, ReactNode } from "react";

export default function Template(props: { children: ReactNode }): JSX.Element {
  const { children } = props;
  return (
    <div className="animate-[enter-page_0.5s_var(--ease-out-expo)_both] motion-reduce:animate-none">
      {children}
    </div>
  );
}
