"use client";

import type { TourSpotlightProps } from "../types.js";

export function TourSpotlight({
  rect,
  padding,
  backdropOpacity,
  zIndex,
}: TourSpotlightProps) {
  const { top, left, width, height, viewportWidth, viewportHeight } = rect;
  const x = left - padding;
  const y = top - padding;
  const w = width + padding * 2;
  const h = height + padding * 2;

  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <mask id="tour-spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="6"
            ry="6"
            fill="black"
            style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </mask>
      </defs>
      {/* Dark backdrop with hole */}
      <rect
        width="100%"
        height="100%"
        fill={`rgba(0,0,0,${backdropOpacity})`}
        mask="url(#tour-spotlight-mask)"
        style={{ pointerEvents: "all" }}
      />
      {/* Transparent click-blocker on the spotlight area itself */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="6"
        ry="6"
        fill="transparent"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        style={{
          pointerEvents: "none",
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </svg>
  );
}
