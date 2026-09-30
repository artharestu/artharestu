"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { SectionLink } from "./SectionLink";

export function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      // Skip when motion is reduced, or when the no-JS safety timer already revealed the hero.
      if (prefersReducedMotion() || html.classList.contains("anim-done")) {
        html.classList.add("anim-done");
        return;
      }
      const title = root.current!.querySelector<HTMLElement>("[data-hero-title]")!;
      const fades = root.current!.querySelectorAll("[data-hero-fade]");
      let split: SplitText | undefined;

      const run = () => {
        if (html.classList.contains("anim-done")) return;
        split = SplitText.create(title, { type: "words", mask: "words" });
        gsap.set(split.words, { yPercent: 100 });
        gsap.set(fades, { opacity: 0, y: 16 });
        html.classList.add("anim-done");
        gsap
          .timeline()
          .to(split.words, { yPercent: 0, duration: 0.7, stagger: 0.04 })
          .to(fades, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.35")
          .add(() => split?.revert());
      };
      document.fonts.ready.then(run);
      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-svh flex-col justify-center pb-28 pt-32">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-10">
            <p data-hero-fade className="meta mb-6 text-text-2 md:mb-8">
              {t("label")}
            </p>
            <h1 data-hero-title className="font-display h-hero text-balance">
              {t("title")}
            </h1>
            <p data-hero-fade className="mt-6 max-w-[56ch] text-text-2 md:mt-8 lg:text-[20px]">
              {t("sub")}
            </p>
            <div data-hero-fade className="mt-8 md:mt-10">
              <SectionLink section="portfolio" className="btn btn-primary">
                {t("cta")}
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="arrow size-5" />
              </SectionLink>
            </div>
          </div>
        </div>
      </div>

      <div data-hero-fade aria-hidden className="container-x absolute inset-x-0 bottom-8">
        <span className="meta inline-flex items-center gap-2 text-text-2">
          <ArrowDown strokeWidth={1.5} className="size-4" />
          {t("scroll")}
        </span>
      </div>
    </section>
  );
}
