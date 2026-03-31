"use client";

import { type ReactPortal, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSpotlightRect } from "../hooks/useSpotlightRect.js";
import { useTooltipPosition } from "../hooks/useTooltipPosition.js";
import type { TourOverlayInternalProps } from "../types.js";
import { TourSpotlight } from "./TourSpotlight.js";
import { TourTooltip } from "./TourTooltip.js";

export function TourOverlay({
  state,
  nextStep,
  prevStep,
  skipTour,
  zIndex,
  backdropOpacity,
}: TourOverlayInternalProps): ReactPortal | null {
  const { status, steps, currentStepIndex } = state;
  const currentStep = steps[currentStepIndex] ?? null;

  const targetRect = useSpotlightRect(
    status === "running" && currentStep ? currentStep.target : "",
  );
  const placement = useTooltipPosition(targetRect, currentStep);

  // Keyboard navigation
  useEffect(() => {
    if (status !== "running") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, nextStep, prevStep, skipTour]);

  // Scroll lock
  useEffect(() => {
    if (status !== "running") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [status]);

  if (status !== "running" || !currentStep) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const spotlightPadding = currentStep.spotlightPadding ?? 8;

  const overlay = (
    <>
      {targetRect ? (
        <TourSpotlight
          rect={targetRect}
          padding={spotlightPadding}
          backdropOpacity={backdropOpacity}
          zIndex={zIndex}
        />
      ) : (
        // Fallback: plain dark backdrop when element not found
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `rgba(0,0,0,${backdropOpacity})`,
            zIndex,
          }}
        />
      )}

      {placement && (
        <TourTooltip
          key={currentStep.id}
          step={currentStep}
          stepIndex={currentStepIndex}
          totalSteps={steps.length}
          placement={placement}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
          isFirst={isFirst}
          isLast={isLast}
          zIndex={zIndex + 1}
        />
      )}
    </>
  );

  return createPortal(overlay, document.body);
}
