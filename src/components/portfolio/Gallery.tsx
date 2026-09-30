"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import blur from "@/data/blur.generated.json";

type Props = { images: string[]; variant: "web" | "mobile"; altFor: (n: number) => string };

/** Swipeable screenshot gallery. Web: 16:10 frame. Mobile: 9:19.5 inside a simple phone frame. */
export function Gallery({ images, variant, altFor }: Props) {
  const t = useTranslations("modal");
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = images.length;
  const go = (i: number) => setIndex((i + count) % count);

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40 && count > 1) go(index + (dx < 0 ? 1 : -1));
  };

  const isMobile = variant === "mobile";
  const frame = isMobile
    ? "mx-auto aspect-[9/19.5] h-[min(62svh,600px)] rounded-[16px] border border-line bg-[#0a0a0c] p-1.5"
    : "aspect-[16/10] w-full";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${frame}`}>
        <div
          className="relative h-full w-full touch-pan-y select-none overflow-hidden rounded-[12px] bg-surface"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startX.current = null)}
        >
          <div
            className="flex h-full transition-transform duration-[400ms] ease-[var(--ease-out)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((src, i) => {
              const blurUrl = (blur as Record<string, string>)[src];
              return (
                <div key={src} className="relative h-full w-full shrink-0" aria-hidden={i !== index}>
                  <Image
                    src={src}
                    alt={altFor(i + 1)}
                    fill
                    draggable={false}
                    sizes={isMobile ? "300px" : "(min-width: 768px) 620px, 100vw"}
                    loading={i === 0 ? "eager" : "lazy"}
                    placeholder={blurUrl ? "blur" : "empty"}
                    blurDataURL={blurUrl}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={t("prevImage")}
              className="btn absolute left-3 top-1/2 size-10 -translate-y-1/2 bg-[#0b0b0f]/70 text-[#f2f0ea] hover:bg-[#0b0b0f]/90"
            >
              <ChevronLeft aria-hidden strokeWidth={1.5} className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={t("nextImage")}
              className="btn absolute right-3 top-1/2 size-10 -translate-y-1/2 bg-[#0b0b0f]/70 text-[#f2f0ea] hover:bg-[#0b0b0f]/90"
            >
              <ChevronRight aria-hidden strokeWidth={1.5} className="size-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("goToImage", { n: i + 1 })}
              aria-current={i === index}
              className="group flex size-6 items-center justify-center rounded-full"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)] ${
                  i === index ? "w-5 bg-accent-text" : "w-1.5 bg-text-2/50 group-hover:bg-text-2"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
