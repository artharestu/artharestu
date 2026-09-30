"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";

/** Fixed ornament layer: three slow lime blobs (parallax 0.1×) plus a grain overlay. */
export function Background() {
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const blobs = gsap.utils.toArray<HTMLElement>(".blob");
      const drift = [
        { x: "6vw", y: "4vh", scale: 1.08 },
        { x: "-5vw", y: "-6vh", scale: 0.94 },
        { x: "-4vw", y: "5vh", scale: 1.06 },
      ];
      blobs.forEach((blob, i) =>
        gsap.to(blob, { ...drift[i], duration: 12, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * -4 }),
      );

      const setY = gsap.quickSetter(layer.current, "y", "px");
      const onScroll = () => setY(-window.scrollY * 0.1);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: layer },
  );

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div ref={layer} className="absolute inset-0 h-[140vh]">
          <div className="blob -right-[12vw] -top-[18vw] size-[56vw]" />
          <div className="blob -left-[16vw] top-[55vh] size-[44vw]" />
          <div className="blob right-[4vw] top-[110vh] size-[40vw]" />
        </div>
      </div>
      <svg aria-hidden className="grain pointer-events-none fixed inset-0 z-[80] h-full w-full">
        <filter id="grain-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </>
  );
}
