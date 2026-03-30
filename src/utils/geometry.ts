import type { ResolvedPlacement, TargetRect, TourStep, TooltipPlacement } from "../types.js";

const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT = 220;
const GAP = 14;
const ARROW_SIZE = 8;
const VIEWPORT_MARGIN = 8;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type Side = "top" | "bottom" | "left" | "right";

function rankBySpace(
  above: number,
  below: number,
  left: number,
  right: number,
): Side[] {
  const sides: [Side, number][] = [
    ["bottom", below],
    ["top", above],
    ["right", right],
    ["left", left],
  ];
  return sides.sort((a, b) => b[1] - a[1]).map(([side]) => side);
}

function checkFits(
  side: Side,
  spaces: { above: number; below: number; left: number; right: number },
): boolean {
  switch (side) {
    case "bottom":
      return spaces.below >= TOOLTIP_HEIGHT + GAP;
    case "top":
      return spaces.above >= TOOLTIP_HEIGHT + GAP;
    case "right":
      return spaces.right >= TOOLTIP_WIDTH + GAP;
    case "left":
      return spaces.left >= TOOLTIP_WIDTH + GAP;
  }
}

function resolveCoords(side: Side, rect: TargetRect): ResolvedPlacement {
  const { top, left, width, height, viewportWidth, viewportHeight } = rect;
  const targetCenterX = left + width / 2;
  const targetCenterY = top + height / 2;
  const minX = VIEWPORT_MARGIN;
  const maxX = viewportWidth - TOOLTIP_WIDTH - VIEWPORT_MARGIN;
  const minY = VIEWPORT_MARGIN;
  const maxY = viewportHeight - TOOLTIP_HEIGHT - VIEWPORT_MARGIN;

  switch (side) {
    case "bottom": {
      const x = clamp(targetCenterX - TOOLTIP_WIDTH / 2, minX, maxX);
      const y = top + height + GAP;
      const arrowOffset = clamp(
        targetCenterX - x,
        ARROW_SIZE * 2,
        TOOLTIP_WIDTH - ARROW_SIZE * 2,
      );
      return { side, x, y, arrowOffset };
    }
    case "top": {
      const x = clamp(targetCenterX - TOOLTIP_WIDTH / 2, minX, maxX);
      const y = top - TOOLTIP_HEIGHT - GAP;
      const arrowOffset = clamp(
        targetCenterX - x,
        ARROW_SIZE * 2,
        TOOLTIP_WIDTH - ARROW_SIZE * 2,
      );
      return { side, x, y, arrowOffset };
    }
    case "right": {
      const x = left + width + GAP;
      const y = clamp(targetCenterY - TOOLTIP_HEIGHT / 2, minY, maxY);
      const arrowOffset = clamp(
        targetCenterY - y,
        ARROW_SIZE * 2,
        TOOLTIP_HEIGHT - ARROW_SIZE * 2,
      );
      return { side, x, y, arrowOffset };
    }
    case "left": {
      const x = left - TOOLTIP_WIDTH - GAP;
      const y = clamp(targetCenterY - TOOLTIP_HEIGHT / 2, minY, maxY);
      const arrowOffset = clamp(
        targetCenterY - y,
        ARROW_SIZE * 2,
        TOOLTIP_HEIGHT - ARROW_SIZE * 2,
      );
      return { side, x, y, arrowOffset };
    }
  }
}

export function computePlacement(
  rect: TargetRect,
  step: TourStep,
): ResolvedPlacement {
  const { top, left, width, height, viewportWidth, viewportHeight } = rect;
  const spaces = {
    above: top,
    below: viewportHeight - (top + height),
    left: left,
    right: viewportWidth - (left + width),
  };

  const preferredPlacement: TooltipPlacement = step.placement ?? "auto";
  const ranked = rankBySpace(spaces.above, spaces.below, spaces.left, spaces.right);

  const candidates: Side[] =
    preferredPlacement !== "auto"
      ? [
          preferredPlacement as Side,
          ...ranked.filter((s) => s !== preferredPlacement),
        ]
      : ranked;

  for (const side of candidates) {
    if (checkFits(side, spaces)) {
      return resolveCoords(side, rect);
    }
  }

  // Absolute fallback: center of viewport
  return {
    side: "bottom",
    x: clamp(
      (viewportWidth - TOOLTIP_WIDTH) / 2,
      VIEWPORT_MARGIN,
      viewportWidth - TOOLTIP_WIDTH - VIEWPORT_MARGIN,
    ),
    y: clamp(
      (viewportHeight - TOOLTIP_HEIGHT) / 2,
      VIEWPORT_MARGIN,
      viewportHeight - TOOLTIP_HEIGHT - VIEWPORT_MARGIN,
    ),
    arrowOffset: TOOLTIP_WIDTH / 2,
  };
}
