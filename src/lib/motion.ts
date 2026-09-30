"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: "power3.out" });

export { gsap, ScrollTrigger, SplitText, useGSAP };

type FlipPlugin = typeof import("gsap/Flip").Flip;
let flip: FlipPlugin | null = null;

/** Flip is only needed once someone filters the grid, so it loads after first paint. */
export function loadFlip() {
  return import("gsap/Flip").then(({ Flip }) => {
    gsap.registerPlugin(Flip);
    flip = Flip;
    return Flip;
  });
}

export const getFlip = () => flip;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}
