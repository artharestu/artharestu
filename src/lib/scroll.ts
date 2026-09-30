"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Nested-safe page scroll lock (menu + modal). Stops Lenis and native scrolling. */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}

const NAV_OFFSET = -88;

/** Smooth-scrolls to a section id. Returns false when the section isn't on this page. */
export function scrollToSection(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return false;
  const target = id === "top" ? 0 : el;
  if (lenis) lenis.scrollTo(target, { offset: id === "top" ? 0 : NAV_OFFSET, duration: 1.2 });
  else if (id === "top") window.scrollTo({ top: 0 });
  else el.scrollIntoView();

  const hash = id === "top" ? "" : `#${id}`;
  history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`);
  return true;
}
