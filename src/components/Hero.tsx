"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Category } from "@/data/categories";
import type { ShowcaseScene } from "@/data/showcase";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { HeroShowcase, type ShowcaseHandle, type Keywords } from "./HeroShowcase";
import { SectionLink } from "./SectionLink";

export function Hero({ showcase }: { showcase: ShowcaseScene[] }) {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const reel = useRef<ShowcaseHandle>(null);

  // The title marks its <web>, <mobile>, and <video> words. It renders as plain text (so SplitText
  // splits it cleanly); the showcase wraps those words for its underline once the intro is done.
  const keywords: Keywords = {};
  const capture = (category: Category) => (chunks: string) => {
    // Typed as a string, but next-intl passes the chunks as an array at runtime.
    const word = ([] as unknown[]).concat(chunks).join("");
    keywords[category] = word;
    return word;
  };
  const title = t.markup("title", { web: capture("web"), mobile: capture("mobile"), video: capture("video") });

  useGSAP(
    () => {
      const html = document.documentElement;
      const startReel = () => reel.current?.start();
      // Skip when motion is reduced, or when the no-JS safety timer already revealed the hero.
      if (prefersReducedMotion() || html.classList.contains("anim-done")) {
        html.classList.add("anim-done");
        startReel();
        return;
      }
      const heading = root.current!.querySelector<HTMLElement>("[data-hero-title]")!;
      const fades = root.current!.querySelectorAll("[data-hero-fade]");
      let split: SplitText | undefined;
      let cancelled = false;

      const run = () => {
        if (cancelled) return; // unmounted before the fonts loaded (also React's dev double-mount)
        if (html.classList.contains("anim-done")) return startReel();
        split = SplitText.create(heading, { type: "words", mask: "words" });
        gsap.set(split.words, { yPercent: 100 });
        gsap.set(fades, { opacity: 0, y: 16 });
        html.classList.add("anim-done");
        gsap
          .timeline()
          .to(split.words, { yPercent: 0, duration: 0.7, stagger: 0.04 })
          .to(fades, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.35")
          .add(() => split?.revert())
          // The showcase loop starts only once the intro is done, so one thing moves at a time.
          .add(startReel, "+=0.2");
      };
      document.fonts.ready.then(run);
      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-svh flex-col justify-center pb-28 pt-32">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-10">
            <p data-hero-fade className="meta mb-6 text-text-2 md:mb-8">
              {t("label")}
            </p>
            <h1 data-hero-title className="font-display h-hero text-balance">
              {title}
            </h1>
          </div>
          <div className="col-span-12 mt-6 md:mt-8 lg:col-span-6">
            <p data-hero-fade className="max-w-[56ch] text-text-2 lg:text-[20px]">
              {t("sub")}
            </p>
            <div data-hero-fade className="mt-8 md:mt-10">
              <SectionLink section="portfolio" className="btn btn-primary">
                {t("cta")}
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="arrow size-5" />
              </SectionLink>
            </div>
          </div>
          {showcase.length > 0 && (
            <div className="relative col-span-12 mt-12 md:mt-16 lg:col-span-5 lg:col-start-8 lg:mt-8">
              <HeroShowcase ref={reel} scenes={showcase} keywords={keywords} />
            </div>
          )}
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
