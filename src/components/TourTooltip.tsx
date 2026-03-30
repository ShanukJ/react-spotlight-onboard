"use client";

import type { TourTooltipProps } from "../types.js";
import { TourProgressDots } from "./TourProgressDots.js";

const ARROW_SIZE = 8;

const tooltipStyle: React.CSSProperties = {
  position: "fixed",
  width: "320px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)",
  color: "#ffffff",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)",
  padding: "20px",
  boxSizing: "border-box",
  animation: "tour-tooltip-enter 220ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
};

const arrowBase: React.CSSProperties = {
  position: "absolute",
  width: 0,
  height: 0,
  pointerEvents: "none",
};

function getArrowStyle(
  side: "top" | "bottom" | "left" | "right",
  arrowOffset: number,
): React.CSSProperties {
  const half = ARROW_SIZE;
  switch (side) {
    case "bottom":
      return {
        ...arrowBase,
        top: -half,
        left: arrowOffset - half,
        borderLeft: `${half}px solid transparent`,
        borderRight: `${half}px solid transparent`,
        borderBottom: `${half}px solid #1e1e2e`,
      };
    case "top":
      return {
        ...arrowBase,
        bottom: -half,
        left: arrowOffset - half,
        borderLeft: `${half}px solid transparent`,
        borderRight: `${half}px solid transparent`,
        borderTop: `${half}px solid #2a2a3e`,
      };
    case "right":
      return {
        ...arrowBase,
        left: -half,
        top: arrowOffset - half,
        borderTop: `${half}px solid transparent`,
        borderBottom: `${half}px solid transparent`,
        borderRight: `${half}px solid #1e1e2e`,
      };
    case "left":
      return {
        ...arrowBase,
        right: -half,
        top: arrowOffset - half,
        borderTop: `${half}px solid transparent`,
        borderBottom: `${half}px solid transparent`,
        borderLeft: `${half}px solid #2a2a3e`,
      };
  }
}

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  placement,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
  zIndex,
}: TourTooltipProps) {
  return (
    <div
      key={step.id}
      style={{
        ...tooltipStyle,
        left: placement.x,
        top: placement.y,
        zIndex,
      }}
      role="dialog"
      aria-label={`Tour step ${stepIndex + 1} of ${totalSteps}: ${step.title}`}
    >
      {/* Arrow */}
      <div style={getArrowStyle(placement.side, placement.arrowOffset)} />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <TourProgressDots total={totalSteps} current={stepIndex} />
        <button
          onClick={onSkip}
          aria-label="Skip tour"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
            lineHeight: 1,
            padding: "0 0 0 8px",
            display: "flex",
            alignItems: "center",
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.5)";
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.55,
          }}
        >
          {step.description}
        </p>
        {step.customContent && (
          <div style={{ marginTop: "12px" }}>{step.customContent}</div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onSkip}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.45)",
            fontSize: "12px",
            padding: "0",
            transition: "color 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.75)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.45)";
          }}
        >
          Skip tour
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          {!isFirst && (
            <button
              onClick={onPrev}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                fontWeight: 500,
                padding: "7px 14px",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.1)";
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={isLast ? onSkip : onNext}
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#1e1e2e",
              fontSize: "13px",
              fontWeight: 600,
              padding: "7px 16px",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.95)";
            }}
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
