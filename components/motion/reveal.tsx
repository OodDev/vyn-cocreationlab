import type { CSSProperties, JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Generic scroll-reveal wrapper — CSS-native, zero-JS.
 *
 * Progressive enhancement contract: the wrapped content is fully visible in
 * static HTML (the `.reveal` base class), and the entrance animation is
 * applied via CSS scroll-driven timelines (`@supports animation-timeline`).
 * Browsers without scroll-driven animation support (older Safari) simply
 * render the static state. Transform + opacity only (60fps budget), and the
 * composition is flattened for reduced-motion users. The `data-motion`
 * boot-flag is deliberately NOT needed here: scroll timelines are inert and
 * safe for crawlers/no-JS visitors, unlike the JS-driven variant this
 * replaces, so the CSS can always run.
 */
export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Extra stagger delay in seconds. */
  delay?: number;
  /** Vertical offset of the hidden state, px. */
  offset?: number;
}

export function Reveal(props: RevealProps): JSX.Element {
  const { children, className, delay = 0, offset = 22 } = props;
  return (
    <div
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-offset": `${offset}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
