"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { TourOverlay } from "../components/TourOverlay.js";
import type {
  TourCallbacks,
  TourContextValue,
  TourProviderProps,
  TourState,
  TourStep,
} from "../types.js";

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | {
      type: "START";
      tourId: string;
      steps: TourStep[];
      callbacks: TourCallbacks;
    }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "STOP" };

const initialState: TourState = {
  status: "idle",
  activeTourId: null,
  steps: [],
  currentStepIndex: 0,
  callbacks: {},
};

function tourReducer(state: TourState, action: Action): TourState {
  switch (action.type) {
    case "START":
      return {
        status: "running",
        activeTourId: action.tourId,
        steps: action.steps,
        currentStepIndex: 0,
        callbacks: action.callbacks,
      };

    case "NEXT": {
      if (state.status !== "running") return state;
      const nextIndex = state.currentStepIndex + 1;
      if (nextIndex >= state.steps.length) {
        return { ...initialState };
      }
      return { ...state, currentStepIndex: nextIndex };
    }

    case "PREV": {
      if (state.status !== "running") return state;
      return {
        ...state,
        currentStepIndex: Math.max(0, state.currentStepIndex - 1),
      };
    }

    case "STOP":
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function useTourContext(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function TourProvider({
  children,
  zIndex = 9000,
  backdropOpacity = 0.6,
}: TourProviderProps) {
  const [state, dispatch] = useReducer(tourReducer, initialState);
  // Use a ref to access current callbacks without stale closures
  const callbacksRef = useRef<TourCallbacks>({});
  const tourIdRef = useRef<string | null>(null);

  const startTour = useCallback(
    (tourId: string, steps: TourStep[], callbacks?: TourCallbacks) => {
      if (steps.length === 0) {
        console.warn("[onboarding-tour] startTour called with 0 steps");
        return;
      }
      callbacksRef.current = callbacks ?? {};
      tourIdRef.current = tourId;
      dispatch({ type: "START", tourId, steps, callbacks: callbacks ?? {} });
    },
    [],
  );

  const stopTour = useCallback(() => {
    dispatch({ type: "STOP" });
  }, []);

  const nextStep = useCallback(
    (currentIndex: number, totalSteps: number) => {
      const isLast = currentIndex === totalSteps - 1;
      if (isLast && tourIdRef.current) {
        callbacksRef.current.onComplete?.(tourIdRef.current);
      }
      dispatch({ type: "NEXT" });
    },
    [],
  );

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV" });
  }, []);

  const skipTour = useCallback((currentIndex: number) => {
    if (tourIdRef.current) {
      callbacksRef.current.onSkip?.(tourIdRef.current, currentIndex);
    }
    dispatch({ type: "STOP" });
  }, []);

  // Stable wrappers that capture current state values
  const nextStepBound = useCallback(() => {
    nextStep(state.currentStepIndex, state.steps.length);
  }, [nextStep, state.currentStepIndex, state.steps.length]);

  const skipTourBound = useCallback(() => {
    skipTour(state.currentStepIndex);
  }, [skipTour, state.currentStepIndex]);

  const contextValue: TourContextValue = {
    state,
    startTour,
    stopTour,
    nextStep: nextStepBound,
    prevStep,
    skipTour: skipTourBound,
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      <TourOverlay
        state={state}
        nextStep={nextStepBound}
        prevStep={prevStep}
        skipTour={skipTourBound}
        zIndex={zIndex}
        backdropOpacity={backdropOpacity}
      />
    </TourContext.Provider>
  );
}

// Re-export ReactNode to avoid direct react import in consumer files
export type { ReactNode };
