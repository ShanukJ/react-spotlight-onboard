# react-spotlight-onboard

Zero-dependency React onboarding tour with SVG spotlight, smart tooltip placement, and keyboard navigation.

**[Live Demo](https://spotlight.shanukj.me)**

- **No external dependencies** — built entirely with React + TypeScript
- **SVG spotlight** — smooth cutout effect that works with any layout (no z-index hacks)
- **Smart placement** — tooltip auto-positions to avoid viewport edges
- **Keyboard navigation** — `→` next, `←` back, `Escape` to skip
- **Next.js App Router ready** — all client components marked with `"use client"`
- **Fully typed** — complete TypeScript types included

## Installation

```bash
npm install react-spotlight-onboard
# or
pnpm add react-spotlight-onboard
# or
yarn add react-spotlight-onboard
```

## Quick Start

### 1. Wrap your app with `TourProvider`

```tsx
// app/layout.tsx or a providers file ("use client" required)
import { TourProvider } from "react-spotlight-onboard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider>
      {children}
    </TourProvider>
  );
}
```

### 2. Mark target elements with `data-tour-id`

```tsx
<nav data-tour-id="sidebar-nav">...</nav>
<header data-tour-id="main-header">...</header>
<div data-tour-id="dashboard-stats">...</div>
```

### 3. Start the tour

```tsx
"use client";
import { useOnboardingTour } from "react-spotlight-onboard";
import { useEffect } from "react";

export function DashboardPage() {
  const { startTour } = useOnboardingTour();

  useEffect(() => {
    startTour(
      "dashboard",
      [
        {
          id: "step-1",
          target: "sidebar-nav",
          title: "Navigation",
          description: "Use the sidebar to move between sections.",
        },
        {
          id: "step-2",
          target: "main-header",
          title: "Header",
          description: "Your account and settings are up here.",
          placement: "bottom",
        },
        {
          id: "step-3",
          target: "dashboard-stats",
          title: "Dashboard",
          description: "Your key metrics at a glance.",
          placement: "top",
        },
      ],
      {
        onComplete: (tourId) => {
          localStorage.setItem(`tour-${tourId}-done`, "true");
        },
        onSkip: (tourId, stepIndex) => {
          console.log(`Skipped tour "${tourId}" at step ${stepIndex}`);
        },
      }
    );
  }, []);

  return <main>...</main>;
}
```

## API

### `<TourProvider>`

Wrap your app once. Renders the spotlight overlay automatically when a tour is active.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `zIndex` | `number` | `9000` | z-index of the overlay stack |
| `backdropOpacity` | `number` | `0.6` | Darkness of the backdrop (0–1) |

### `useOnboardingTour()`

```ts
const {
  startTour,        // (tourId, steps, callbacks?) => void
  stopTour,         // () => void — stops without firing onSkip
  nextStep,         // () => void
  prevStep,         // () => void
  skipTour,         // () => void — fires onSkip callback
  isActive,         // boolean
  activeTourId,     // string | null
  currentStep,      // TourStep | null
  currentStepIndex, // number
  totalSteps,       // number
} = useOnboardingTour();
```

### `TourStep`

```ts
interface TourStep {
  id: string;
  target: string;              // matches data-tour-id="..." on a DOM element
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto"; // default: "auto"
  spotlightPadding?: number;   // px padding around the spotlight cutout; default: 8
  customContent?: ReactNode;   // rendered below the description
}
```

### Callbacks

```ts
startTour("my-tour", steps, {
  onComplete: (tourId: string) => void,
  onSkip: (tourId: string, stepIndex: number) => void,
  onStepChange: (tourId: string, step: TourStep, index: number) => void,
});
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` `ArrowRight` | Next step |
| `←` `ArrowLeft` | Previous step |
| `Escape` | Skip tour |

## How It Works

The spotlight effect uses an **SVG mask** that cuts a rounded rectangle hole over the target element. This approach is immune to CSS stacking context issues that affect `clip-path`-based approaches — it works correctly inside sidebars, modals, and transformed containers.

Target elements are resolved via `document.querySelector('[data-tour-id="..."]')`. The tooltip placement algorithm measures available viewport space in all four directions and picks the side with the most room, clamping the position to always stay within the viewport.

## Next.js App Router

All interactive components include the `"use client"` directive. Place `TourProvider` inside a Client Component boundary:

```tsx
// providers.tsx
"use client";
import { TourProvider } from "react-spotlight-onboard";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TourProvider>{children}</TourProvider>;
}
```

```tsx
// app/layout.tsx (Server Component)
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## License

MIT
