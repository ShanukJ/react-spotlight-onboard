import type { ReactNode } from "react";

// ─── Tour Definition ─────────────────────────────────────────────────────────

export interface TourStep {
  /** Unique step id, used for analytics/callbacks */
  id: string;
  /** Matches data-tour-id="..." on the target DOM element */
  target: string;
  /** Tooltip title */
  title: string;
  /** Tooltip body copy */
  description: string;
  /** Override default tooltip placement; 'auto' lets the algorithm decide */
  placement?: TooltipPlacement;
  /** Padding (px) added around the spotlight cutout; default 8 */
  spotlightPadding?: number;
  /** Custom content rendered below description */
  customContent?: ReactNode;
}

export type TooltipPlacement = "top" | "bottom" | "left" | "right" | "auto";

export interface TourCallbacks {
  onComplete?: (tourId: string) => void;
  onSkip?: (tourId: string, stepIndex: number) => void;
  onStepChange?: (tourId: string, step: TourStep, index: number) => void;
}

// ─── Internal State ──────────────────────────────────────────────────────────

export type TourStatus = "idle" | "running";

export interface TourState {
  status: TourStatus;
  activeTourId: string | null;
  steps: TourStep[];
  currentStepIndex: number;
  callbacks: TourCallbacks;
}

// ─── Computed Geometry ───────────────────────────────────────────────────────

export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface ResolvedPlacement {
  side: "top" | "bottom" | "left" | "right";
  x: number;
  y: number;
  arrowOffset: number;
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface TourContextValue {
  state: TourState;
  startTour: (
    tourId: string,
    steps: TourStep[],
    callbacks?: TourCallbacks,
  ) => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface TourProviderProps {
  children: ReactNode;
  /** z-index base for the overlay stack; default 9000 */
  zIndex?: number;
  /** Overlay backdrop opacity 0–1; default 0.6 */
  backdropOpacity?: number;
}

export interface TourSpotlightProps {
  rect: TargetRect;
  padding: number;
  backdropOpacity: number;
  zIndex: number;
}

export interface TourTooltipProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  placement: ResolvedPlacement;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  zIndex: number;
}

export interface TourProgressDotsProps {
  total: number;
  current: number;
}

export interface TourOverlayInternalProps {
  state: TourState;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  zIndex: number;
  backdropOpacity: number;
}
