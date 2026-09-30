"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);
gsap.defaults({ ease: "power3.out" });

export { gsap, SplitText, useGSAP };

export type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;
let scrollTrigger: Promise<ScrollTriggerPlugin> | null = null;

/**
 * ScrollTrigger (with its Observer) only drives the reveals below the hero, so it loads right after
 * hydration instead of with the page. Every caller shares the same import.
 */
export function loadScrollTrigger() {
  scrollTrigger ??= import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
    return ScrollTrigger;
  });
  return scrollTrigger;
}

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
