/**
 * Shared OG card renderer (1200×630) generated at build time by the
 * route-level `opengraph-image.tsx` files. Composed from solid divs, borders,
 * linear gradients and rotate transforms — all well-supported by the Satori
 * renderer — so no custom font loading is needed (text uses the embedded
 * default sans).
 */
import { ImageResponse } from "next/og";
import type { JSX } from "react";

export interface OgInput {
  title: string;
  kicker?: string;
  subtitle?: string;
}

interface BarProps {
  color: string;
  size: number;
  rotate: number;
  x: number;
  y: number;
}

function Bar({ color, size, rotate, x, y }: BarProps): JSX.Element {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: "14px",
        borderRadius: "8px",
        background: color,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "left center",
      }}
    />
  );
}

const CYAN = "#4be1ec";
const GREEN = "#45e083";

/**
 * Renders the OG image. Keep decorations deterministic.
 */
export function renderOgImage(input: OgInput): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(120deg, #050d10 0%, #0a1a20 68%, #07231f 100%)",
        color: "#e9f4f4",
        padding: "72px 84px",
        position: "relative",
      }}
    >
      {/* Brand: geometric VYN echo built from rotated bars */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          height: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "210px",
            height: "64px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "8px",
              width: "4px",
              height: "46px",
              borderRadius: "4px",
              background: CYAN,
              transform: "rotate(26deg)",
              transformOrigin: "center top",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "40px",
              top: "8px",
              width: "4px",
              height: "46px",
              borderRadius: "4px",
              background: GREEN,
              transform: "rotate(-26deg)",
              transformOrigin: "center top",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "96px",
              top: "8px",
              width: "3px",
              height: "46px",
              borderRadius: "4px",
              background: CYAN,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "118px",
              top: "8px",
              width: "3px",
              height: "46px",
              borderRadius: "4px",
              background: GREEN,
              transform: "rotate(24deg)",
              transformOrigin: "center top",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "160px",
              top: "8px",
              width: "3px",
              height: "46px",
              borderRadius: "4px",
              background: GREEN,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            letterSpacing: "10px",
            color: "#9db3b8",
            fontWeight: 600,
          }}
        >
          VYN
        </div>
      </div>

      {/* Main block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "820px",
          position: "relative",
        }}
      >
        {input.kicker !== undefined && input.kicker.length > 0 ? (
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              letterSpacing: "8px",
              textTransform: "uppercase",
              color: CYAN,
              marginBottom: "26px",
              fontWeight: 700,
            }}
          >
            {input.kicker}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: input.title.length > 32 ? 64 : 84,
            fontWeight: 700,
            lineHeight: 1.08,
            justifyContent: "flex-start",
          }}
        >
          {input.title}
        </div>
        {input.subtitle !== undefined && input.subtitle.length > 0 ? (
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: "#9db3b8",
              marginTop: "28px",
            }}
          >
            {input.subtitle}
          </div>
        ) : null}
      </div>

      {/* Footer identity line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#9db3b8",
          }}
        >
          vyn-cocreation.com — Web Developing
        </div>
        <div style={{ display: "flex", position: "relative", width: 120, height: 60 }}>
          <Bar color={CYAN} size={54} rotate={26} x={0} y={0} />
          <Bar color={GREEN} size={54} rotate={-26} x={54} y={0} />
        </div>
      </div>

      {/* Decorative geometry (right edge) */}
      <div
        style={{
          position: "absolute",
          right: "-60px",
          top: "120px",
          width: "320px",
          height: "320px",
          border: "2px solid rgba(75,225,236,0.25)",
          borderRadius: "40px",
          transform: "rotate(24deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "30px",
          bottom: "130px",
          width: "110px",
          height: "110px",
          border: "2px solid rgba(69,224,131,0.35)",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "190px",
          top: "70px",
          width: "4px",
          height: "90px",
          borderRadius: "4px",
          background: "linear-gradient(180deg, #4be1ec, rgba(75,225,236,0))",
        }}
      />
    </div>,
    { width: 1200, height: 630 },
  );
}
