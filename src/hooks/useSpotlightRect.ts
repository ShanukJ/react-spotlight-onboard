"use client";

import { useEffect, useState } from "react";
import type { TargetRect } from "../types.js";
import { resolveTarget, scrollTargetIntoView } from "../utils/dom.js";

export function useSpotlightRect(targetId: string): TargetRect | null {
  const [rect, setRect] = useState<TargetRect | null>(null);

  useEffect(() => {
    const el = resolveTarget(targetId);

    if (!el) {
      console.warn(
        `[onboarding-tour] No element found with data-tour-id="${targetId}"`,
      );
      setRect(null);
      return;
    }

    scrollTargetIntoView(el);

    let rafId: number;

    const measure = () => {
      const domRect = el.getBoundingClientRect();
      if (domRect.width === 0 && domRect.height === 0) {
        setRect(null);
        return;
      }
      setRect({
        top: domRect.top,
        left: domRect.left,
        width: domRect.width,
        height: domRect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    };

    // Double rAF: first frame starts scroll, second reads settled position
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(measure);
    });

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.documentElement);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 100);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", measure);
    };
  }, [targetId]);

  return rect;
}
