"use client";

import { useSyncExternalStore } from "react";
import Threads from "./ui/Thread-Bg";

// Logo spectrum, in the same order as --spectrum-gradient in globals.css
const SPECTRUM = ["#D91F26", "#F18A26", "#F0C21A", "#319B50", "#00A5D8", "#0874C9"];

// Threads are desktop/tablet only (md and up): no WebGL context is created on phones
const THREADS_QUERY = "(min-width: 768px)";
const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(THREADS_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(THREADS_QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Page-wide animated threads. Fixed to the viewport and painted at a negative
 * z-index inside `<main>`, so it sits above the hero photo and background orbs
 * but below every section's content.
 */
export default function HomeThreads() {
  const show = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Threads
        colors={SPECTRUM}
        lineCount={43}
        thickness={0.6}
        softness={1.3}
        amplitude={1.7}
        distance={0.2}
        waves={1.05}
        speed={0.6}
        split={0.04}
        fray={0.5}
        angle={25}
        taper={0.85}
        brightness={1.4}
        parting={0}
        enableMouseInteraction={false}
        fade={0}
        opacity={0.8}
      />
    </div>
  );
}
