"use client";

import type { TourProgressDotsProps } from "../types.js";

export function TourProgressDots({ total, current }: TourProgressDotsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? "20px" : "6px",
            height: "6px",
            borderRadius: "3px",
            backgroundColor:
              i === current
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.35)",
            transition: "width 250ms ease, background-color 250ms ease",
          }}
        />
      ))}
    </div>
  );
}
