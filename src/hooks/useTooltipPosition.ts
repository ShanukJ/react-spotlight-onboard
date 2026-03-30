"use client";

import { useMemo } from "react";
import type { ResolvedPlacement, TargetRect, TourStep } from "../types.js";
import { computePlacement } from "../utils/geometry.js";

export function useTooltipPosition(
  rect: TargetRect | null,
  step: TourStep | null,
): ResolvedPlacement | null {
  return useMemo(() => {
    if (!rect || !step) return null;
    return computePlacement(rect, step);
  }, [rect, step]);
}
