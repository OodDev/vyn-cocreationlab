/**
 * Shared geometric VYN wordmark.
 *
 * Built from pure line primitives (single polyline per letter) so it can be
 * stroke-animated (splashscreen draw-in) or rendered statically (nav, footer,
 * favicon, OG image). The neon look comes from a cyan→green gradient stroke
 * plus CSS drop-shadow glow applied by the parent.
 *
 * Geometry (viewBox 0 0 480 140):
 *   V  x 96–192   single down-up stroke
 *   Y  x 216–296  V-jaws + stem
 *   N  x 316–392  bar + diagonal + bar (one continuous polyline)
 */
import type { CSSProperties, JSX } from "react";

const V = "M96 24 L144 114 L192 24";
const Y = "M216 24 L256 76 L296 24";
const Y_STEM = "M256 76 L256 114";
const N = "M316 114 L316 24 L392 114 L392 24";

const PATHS: Array<{ d: string; delay: string }> = [
  { d: V, delay: "0.15s" },
  { d: `${Y} ${Y_STEM}`, delay: "0.27s" },
  { d: N, delay: "0.39s" },
];

export interface VynWordmarkProps {
  /** CSS class for the svg root (gdp glow etc. handled by parent). */
  className?: string;
  /** Accessible name; omit ({@literal null}) for decorative usage. */
  title?: string | null;
  /** Base multi-path draw delay (splashscreen mode). */
  drawDelayBase?: string;
  /** Extra class list per path (e.g. splash-fade-late on the dot). */
  dotClassName?: string;
  /** Stroke width override. */
  strokeWidth?: number;
}

export function VynWordmark(props: VynWordmarkProps): JSX.Element {
  const { className, title = null, dotClassName = "", strokeWidth = 7 } = props;
  const ariaProps: {
    role?: string;
    "aria-labelledby"?: string;
    "aria-hidden": boolean;
  } = title
    ? { role: "img", "aria-labelledby": "vyn-wordmark-title", "aria-hidden": false }
    : { "aria-hidden": true };

  return (
    <svg
      viewBox="0 0 480 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...ariaProps}
    >
      {title ? <title id="vyn-wordmark-title">{title}</title> : null}
      <defs>
        <linearGradient
          id="vyn-stroke-gradient"
          x1="0"
          y1="0"
          x2="480"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#4be1ec" />
          <stop offset="1" stopColor="#45e083" />
        </linearGradient>
      </defs>
      {PATHS.map(function (p): JSX.Element {
        const style: CSSProperties & Record<string, string> = {
          "--draw-delay": p.delay,
        };
        return (
          <path
            key={p.d}
            d={p.d}
            pathLength={1}
            stroke="url(#vyn-stroke-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
          />
        );
      })}
      <circle
        className={dotClassName}
        cx="256"
        cy="126"
        r="4.5"
        fill="#45e083"
        style={{ "--draw-delay": "0.55s" } as CSSProperties & Record<string, string>}
      />
    </svg>
  );
}
