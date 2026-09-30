"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/** Pulls its child up to 12px toward the cursor within a 120px radius (pointer: fine only). */
export function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !isFinePointer() || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.3 });
      const yTo = gsap.quickTo(el, "y", { duration: 0.3 });
      let active = false;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        // Distance measured from the button edge, not its center.
        const edge = Math.hypot(Math.max(Math.abs(dx) - r.width / 2, 0), Math.max(Math.abs(dy) - r.height / 2, 0));
        if (edge < 120) {
          active = true;
          const pull = 1 - edge / 120;
          const len = Math.hypot(dx, dy) || 1;
          xTo((dx / len) * 12 * pull);
          yTo((dy / len) * 12 * pull);
        } else if (active) {
          active = false;
          gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)", overwrite: true });
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
