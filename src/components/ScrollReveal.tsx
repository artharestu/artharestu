"use client";

import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/motion";

/**
 * Scroll reveals for the whole page: [data-reveal] fades up on its own,
 * [data-reveal-group] staggers its [data-reveal-item] children. Runs once per element.
 */
export function ScrollReveal() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const start = "top 85%";

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, { opacity: 0, y: 24, duration: 0.6, clearProps: "opacity,transform", scrollTrigger: { trigger: el, start, once: true } });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
      if (!items.length) return;
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: group, start, once: true },
      });
    });

    // Filtering, fonts, and images change the page height; recompute trigger positions when it does.
    let timer: ReturnType<typeof setTimeout>;
    let lastHeight = document.body.scrollHeight;
    const observer = new ResizeObserver(() => {
      if (document.body.scrollHeight === lastHeight) return;
      lastHeight = document.body.scrollHeight;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  });

  return null;
}
