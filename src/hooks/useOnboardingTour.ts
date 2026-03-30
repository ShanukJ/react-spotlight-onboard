"use client";

import { useTourContext } from "../context/TourContext.js";
import type { TourCallbacks, TourStep } from "../types.js";

export interface UseOnboardingTourReturn {
  /** Start a named tour with the given steps and optional callbacks */
  startTour: (
    tourId: string,
    steps: TourStep[],
    callbacks?: TourCallbacks,
  ) => void;
  /** Stop the active tour immediately without firing onSkip */
  stopTour: () => void;
  /** Advance to the next step (fires onComplete on the last step) */
  nextStep: () => void;
  /** Go back to the previous step */
  prevStep: () => void;
  /** Skip the tour (fires onSkip) */
  skipTour: () => void;
  /** Whether a tour is currently running */
  isActive: boolean;
  /** The id of the currently running tour, or null */
  activeTourId: string | null;
  /** The current step object, or null if no tour is running */
  currentStep: TourStep | null;
  /** Zero-based index of the current step */
  currentStepIndex: number;
  /** Total number of steps in the active tour */
  totalSteps: number;
}

export function useOnboardingTour(): UseOnboardingTourReturn {
  const { state, startTour, stopTour, nextStep, prevStep, skipTour } =
    useTourContext();

  const currentStep =
    state.status === "running"
      ? (state.steps[state.currentStepIndex] ?? null)
      : null;

  return {
    startTour,
    stopTour,
    nextStep,
    prevStep,
    skipTour,
    isActive: state.status === "running",
    activeTourId: state.activeTourId,
    currentStep,
    currentStepIndex: state.currentStepIndex,
    totalSteps: state.steps.length,
  };
}
