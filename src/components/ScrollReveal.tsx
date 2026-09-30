"use client";

import { gsap, useGSAP, loadScrollTrigger, prefersReducedMotion, type ScrollTriggerPlugin } from "@/lib/motion";

const LINE = 0.85; // reveal when an element's top reaches 85% of the viewport height

/**
 * Scroll reveals for the whole page: [data-reveal] fades up on its own,
 * [data-reveal-group] staggers its [data-reveal-item] children. Runs once per element.
 */
export function ScrollReveal() {
  useGSAP((_, contextSafe) => {
    if (prefersReducedMotion()) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let observer: ResizeObserver | undefined;

    const setup = contextSafe!((ScrollTrigger: ScrollTriggerPlugin) => {
      const start = `top ${LINE * 100}%`;
      // ScrollTrigger arrives after hydration; whatever has already passed the line by then stays
      // as it is, so nothing on screen disappears to animate back in.
      const pending = (el: HTMLElement) => el.getBoundingClientRect().top > window.innerHeight * LINE;

      gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(pending).forEach((el) => {
        gsap.from(el, { opacity: 0, y: 24, duration: 0.6, clearProps: "opacity,transform", scrollTrigger: { trigger: el, start, once: true } });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").filter(pending).forEach((group) => {
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
      let lastHeight = document.body.scrollHeight;
      observer = new ResizeObserver(() => {
        if (document.body.scrollHeight === lastHeight) return;
        lastHeight = document.body.scrollHeight;
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      observer.observe(document.body);
    });

    loadScrollTrigger().then((ScrollTrigger) => {
      if (active) setup(ScrollTrigger);
    });
    return () => {
      active = false;
      clearTimeout(timer);
      observer?.disconnect();
    };
  });

  return null;
}
