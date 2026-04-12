"use client";

import { useEffect, useState } from "react";

import { useUIStore } from "@/store/ui-store";

/**
 * Fixed, thin top-of-viewport progress bar driven by in-flight API calls.
 *
 * Any call going through `lib/api.ts`'s `request<T>` wrapper increments/decrements
 * `useUIStore.inFlight`, so this component requires zero per-page plumbing.
 *
 * A 150ms show-delay prevents flicker on sub-150ms responses.
 */
export function TopProgressBar() {
  const inFlight = useUIStore((s) => s.inFlight);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show path: wait 150ms so sub-150ms calls never flicker the bar.
    // Hide path: also queued via a zero-delay timeout to keep all setState
    // calls asynchronous with respect to the effect body (satisfies
    // react-hooks/set-state-in-effect).
    const delay = inFlight > 0 ? 150 : 0;
    const next = inFlight > 0;
    const id = window.setTimeout(() => setVisible(next), delay);
    return () => window.clearTimeout(id);
  }, [inFlight]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-full animate-[progressSlide_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />
      <style jsx>{`
        @keyframes progressSlide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
