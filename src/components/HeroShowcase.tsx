"use client";

import Image from "next/image";
import { useImperativeHandle, useRef, useState, type MouseEvent, type Ref } from "react";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import type { ShowcaseImage, ShowcaseScene, ShowcaseShape } from "@/data/showcase";
import { OPEN_EVENT, type OpenEventDetail } from "@/lib/events";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(DrawSVGPlugin);

export type ShowcaseHandle = { start: () => void };
/** The title's words for each category, e.g. { web: "website", mobile: "aplikasi", video: "video AI" }. */
export type Keywords = Partial<Record<ShowcaseScene["category"], string>>;

const SCENE = 4.4; // seconds per scene, hold included
const MORPH = 0.9;
const BEZEL = 14; // frame border (1px) + padding (6px), both sides
const CAP = 58; // caption row (32) + gap (12) + progress (2) + gap (12) above the frame
const TALLEST_MIN = 260; // keeps the stage wide enough for the longest caption
const TALLEST_MAX = 340;
const TITLE_GAP = 48; // min. space between the title's last line and the showcase

const RATIO: Record<ShowcaseShape, number> = { "16:10": 16 / 10, "16:9": 16 / 9, "9:16": 9 / 16, "9:19.5": 9 / 19.5 };
const HIDDEN = { visibility: "hidden" } as const;

/** Screen size of the frame. Portrait shapes take the full height; landscape ones 80% of it, capped by the stage width. */
function frameSize(shape: ShowcaseShape, stageWidth: number, tallest: number) {
  const ratio = RATIO[shape];
  if (ratio < 1) return { width: (tallest - BEZEL) * ratio, height: tallest - BEZEL };
  const width = Math.min(stageWidth - BEZEL, (tallest * 0.8 - BEZEL) * ratio);
  return { width, height: width / ratio };
}

/** Right edge of the last line of text in `el`. */
function lastLineRight(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = Array.from(range.getClientRects()).filter((r) => r.width > 1);
  if (!rects.length) return Infinity;
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return Math.max(...rects.filter((r) => r.bottom > bottom - 8).map((r) => r.right));
}

/**
 * Wraps each keyword in the (plain-text) title in a span the underline can target. Runs after the
 * title intro, since SplitText restores the title's original markup when it reverts.
 */
function markKeywords(title: HTMLElement, keywords: Keywords) {
  const text = title.firstChild;
  if (title.querySelector("[data-kw]") || title.childNodes.length !== 1 || !(text instanceof Text)) return;
  const found = Object.entries(keywords)
    .map(([category, word = ""]) => ({ category, word, at: word ? text.data.indexOf(word) : -1 }))
    .filter(({ at }) => at >= 0)
    .sort((a, b) => b.at - a.at); // last first, so the earlier offsets stay valid
  for (const { category, word, at } of found) {
    const span = document.createElement("span");
    span.className = "hero-kw";
    span.dataset.kw = category;
    const range = document.createRange();
    range.setStart(text, at);
    range.setEnd(text, at + word.length);
    try {
      range.surroundContents(span);
    } catch {
      // overlapping keywords: skip this one
    }
  }
}

/** Reads the image as a cols × rows grid of colors (object-fit: cover), or null when it can't be read yet. */
function samplePixels(img: HTMLImageElement | null, cols: number, rows: number) {
  if (!img?.complete || !img.naturalWidth) return null;
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const { naturalWidth: w, naturalHeight: h } = img;
  const scale = Math.max(cols / w, rows / h);
  const sw = cols / scale;
  const sh = rows / scale;
  try {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh, 0, 0, cols, rows);
    return ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    return null;
  }
}

/** Low-res noise that resolves pixel by pixel into the footage: the "generating" look of AI video. */
function createNoise(canvas: HTMLCanvasElement, img: HTMLImageElement | null, portrait: boolean) {
  const cols = portrait ? 12 : 21;
  const rows = portrait ? 21 : 12;
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  const frame = ctx?.createImageData(cols, rows);
  const target = samplePixels(img, cols, rows);
  const resolved = new Uint8Array(cols * rows);

  const draw = (progress: number) => {
    if (!ctx || !frame) return;
    const d = frame.data;
    for (let i = 0; i < resolved.length; i++) {
      if (target && !resolved[i] && Math.random() < progress) resolved[i] = 1;
      const o = i * 4;
      if (target && resolved[i]) {
        d[o] = target[o];
        d[o + 1] = target[o + 1];
        d[o + 2] = target[o + 2];
      } else if (Math.random() < 0.05) {
        d[o] = 200;
        d[o + 1] = 255;
        d[o + 2] = 61;
      } else {
        const v = 16 + Math.random() * 96;
        d[o] = v;
        d[o + 1] = v;
        d[o + 2] = v + 6;
      }
      d[o + 3] = 255;
    }
    ctx.putImageData(frame, 0, 0);
  };

  return {
    reset: () => {
      resolved.fill(0);
      draw(0);
    },
    draw,
  };
}

type Build = (tl: gsap.core.Timeline, scene: HTMLElement, data: ShowcaseScene) => void;

/** Website: a wireframe draws itself, then the real screenshot settles in over it. */
const buildWeb: Build = (tl, scene) => {
  const wire = scene.querySelector("[data-wire]");
  tl.set(wire, { autoAlpha: 1 }, 0.3)
    .fromTo(scene.querySelectorAll("[data-wire] path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, stagger: 0.05 }, 0.55)
    .fromTo(scene.querySelector("[data-shot]"), { autoAlpha: 0, scale: 1.03 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, 1.6)
    .to(wire, { autoAlpha: 0, duration: 0.4 }, 1.9);
};

/** Mobile app: the first screen slides up; a second screen is swiped to, like using the app. */
const buildMobile: Build = (tl, scene) => {
  const strip = scene.querySelector<HTMLElement>("[data-strip]")!;
  const screens = strip.children.length;
  tl.fromTo(strip, { xPercent: 0, yPercent: 6 }, { yPercent: 0, duration: 0.7 }, 0.35);
  if (screens > 1) tl.to(strip, { xPercent: -100 / screens, duration: 0.7, ease: "power3.inOut" }, 2.4);
};

/** AI video: pixel noise resolves into the footage, which then plays with a slow push-in. */
const buildVideo: Build = (tl, scene, data) => {
  const footage = scene.querySelector<HTMLElement>("[data-footage]")!;
  const canvas = scene.querySelector<HTMLCanvasElement>("[data-noise]")!;
  const noise = createNoise(canvas, footage.querySelector("img"), RATIO[data.shape] < 1);
  const state = { progress: 0 };
  let last = 0;
  // The noise covers the footage before the scene fades in, so the finished image never shows first.
  tl.call(noise.reset, undefined, 0.3)
    .set(canvas, { autoAlpha: 1 }, 0.3)
    .fromTo(footage, { scale: 1.12 }, { scale: 1, duration: SCENE - 0.35, ease: "none" }, 0.35)
    .fromTo(
      state,
      { progress: 0 },
      {
        progress: 1,
        duration: 1.4,
        ease: "power1.in",
        onUpdate: () => {
          const now = performance.now();
          if (state.progress < 1 && now - last < 100) return; // ~10 noise frames per second
          last = now;
          noise.draw(state.progress);
        },
      },
      0.6,
    )
    .to(canvas, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, 2.2);
};

const BUILD: Record<ShowcaseScene["category"], Build> = { web: buildWeb, mobile: buildMobile, video: buildVideo };

// Wireframe of a landing page (160 × 100 viewBox), drawn before the website screenshot appears.
const WIREFRAME = [
  { d: "M0 5.6H160", w: 0.6 },
  { d: "M59.4 1.4h41.2a1.4 1.4 0 0 1 0 2.8H59.4a1.4 1.4 0 0 1 0-2.8z", w: 0.6 },
  { d: "M8 11.3h12.4", w: 1.2 },
  { d: "M98 11.2h8m3 0h8m3 0h8m3 0h8", w: 1.2 },
  { d: "M144 9.3h7a1.95 1.95 0 0 1 0 3.9h-7a1.95 1.95 0 0 1 0-3.9z", w: 0.6 },
  { d: "M8 29h66", w: 2.4 },
  { d: "M8 38h32", w: 2.4 },
  { d: "M8 48.3h52", w: 1 },
  { d: "M8 51.1h44", w: 1 },
  { d: "M10.8 55.7h13.4a2.8 2.8 0 0 1 0 5.6H10.8a2.8 2.8 0 0 1 0-5.6z", w: 0.6 },
  { d: "M31.8 55.7h13.4a2.8 2.8 0 0 1 0 5.6H31.8a2.8 2.8 0 0 1 0-5.6z", w: 0.6 },
  { d: "M92 16.7h58a2 2 0 0 1 2 2v70a2 2 0 0 1-2 2H92a2 2 0 0 1-2-2v-70a2 2 0 0 1 2-2z", w: 0.6 },
  { d: "M121 30.7a19 19 0 1 0 0 38a19 19 0 1 0 0-38z", w: 0.6 },
  { d: "M96 77.3h30m-30 3h20", w: 1 },
];

function Footage({ image, sizes }: { image: ShowcaseImage; sizes: string }) {
  const [src, setSrc] = useState(image.src);
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      onError={() => {
        if (image.fallback && src !== image.fallback) setSrc(image.fallback);
      }}
      className="object-cover"
    />
  );
}

function SceneContent({ scene, eager }: { scene: ShowcaseScene; eager: boolean }) {
  const loading = eager ? "eager" : undefined;
  if (scene.category === "web") {
    const [shot] = scene.images;
    return (
      <>
        <span data-shot className="absolute inset-0">
          <Image
            src={shot.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 330px"
            loading={loading}
            placeholder={shot.blurDataURL ? "blur" : "empty"}
            blurDataURL={shot.blurDataURL}
            className="object-cover object-top"
          />
        </span>
        <svg
          data-wire
          aria-hidden
          viewBox="0 0 160 100"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          className="absolute inset-0 size-full text-accent-text"
          style={HIDDEN}
        >
          {WIREFRAME.map(({ d, w }) => (
            <path key={d} d={d} strokeWidth={w} />
          ))}
        </svg>
      </>
    );
  }

  if (scene.category === "mobile") {
    return (
      <span data-strip className="absolute inset-y-0 left-0 flex" style={{ width: `${scene.images.length * 100}%` }}>
        {scene.images.map((screen) => (
          <span key={screen.src} className="relative h-full flex-1">
            <Image
              src={screen.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 160px, 120px"
              loading={loading}
              placeholder={screen.blurDataURL ? "blur" : "empty"}
              blurDataURL={screen.blurDataURL}
              className="object-cover object-top"
            />
          </span>
        ))}
      </span>
    );
  }

  return (
    <>
      <span data-footage className="absolute inset-0 bg-[#0b0b0f]">
        <Footage image={scene.images[0]} sizes="(min-width: 1024px) 460px, 360px" />
      </span>
      <canvas data-noise aria-hidden className="absolute inset-0 size-full [image-rendering:pixelated]" style={HIDDEN} />
    </>
  );
}

type Props = { scenes: ShowcaseScene[]; keywords: Keywords; ref?: Ref<ShowcaseHandle> };

/**
 * Hero motion graphic: one frame that morphs between the featured website, mobile app, and AI video,
 * with the matching headline word underlined. Clicking the frame opens that project's modal.
 */
export function HeroShowcase({ scenes, keywords, ref }: Props) {
  const t = useTranslations("hero");
  const tp = useTranslations("portfolio");
  const stage = useRef<HTMLDivElement>(null);
  const startLoop = useRef<() => void>(() => {});
  const holdByUser = useRef<(on: boolean) => void>(() => {});
  const [paused, setPaused] = useState(false);
  const loops = scenes.length > 1;
  const labels = scenes.map((s) => tp("open", { title: s.title }));

  useImperativeHandle(ref, () => ({ start: () => startLoop.current() }), []);

  useGSAP(
    () => {
      const el = stage.current!;
      const cell = el.parentElement!;
      const section = el.closest("section")!;
      const title = section.querySelector<HTMLElement>("[data-hero-title]");
      const frame = el.querySelector<HTMLAnchorElement>("[data-frame]")!;
      const sceneEls = gsap.utils.toArray<HTMLElement>("[data-scene]", el);
      const captions = gsap.utils.toArray<HTMLElement>("[data-caption]", el);
      const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", el);
      const lg = window.matchMedia("(min-width: 1024px)");
      let current = 0;
      let disposed = false;

      // ≥ 1024px: beside the title's last line when that line is short enough, else below the title.
      // Its bottom stays level with the scroll indicator and inside the first screen when there is room.
      const place = () => {
        if (!lg.matches || !title) {
          el.style.removeProperty("--st");
          el.style.removeProperty("--sh");
          return;
        }
        const cellBox = cell.getBoundingClientRect();
        const firstScreen = Math.min(section.getBoundingClientRect().bottom + window.scrollY, window.innerHeight);
        const limit = firstScreen - 32 - (cellBox.top + window.scrollY);
        const tallestFor = (top: number) => gsap.utils.clamp(TALLEST_MIN, TALLEST_MAX, limit - top - CAP);
        const widthFor = (tallest: number) => Math.min(cellBox.width, (tallest * 0.8 - BEZEL) * 1.6 + BEZEL);
        let top = title.getBoundingClientRect().bottom - cellBox.top - CAP;
        let tallest = tallestFor(top);
        if (lastLineRight(title) - cellBox.left + TITLE_GAP > cellBox.width - widthFor(tallest)) {
          top = 0;
          tallest = tallestFor(top);
        }
        el.style.setProperty("--st", `${Math.round(top)}px`);
        el.style.setProperty("--sh", `${Math.round(tallest)}px`);
      };

      const sizeFor = (i: number) => frameSize(scenes[i].shape, el.clientWidth, el.clientHeight - CAP);
      const relayout = () => {
        if (disposed) return;
        place();
        gsap.set(frame, { ...sizeFor(current), overwrite: "auto" });
      };
      let raf = 0;
      const onResize = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(relayout);
      };
      relayout();
      // Runs before the title intro (same promise, registered first), so the title is measured unsplit.
      document.fonts?.ready.then(relayout);
      window.addEventListener("resize", onResize);

      const cleanupLayout = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
      if (prefersReducedMotion() || !loops) return cleanupLayout;

      // ——— Loop ———
      gsap.set(sceneEls, { autoAlpha: (i: number) => (i ? 0 : 1) });
      gsap.set(captions, { autoAlpha: (i: number) => (i ? 0 : 1) });
      gsap.set(fills, { scaleX: 0 });

      // Any hold pauses the loop: the pause button, hover, keyboard focus, off-screen, or a hidden tab.
      const holds = { user: false, hover: false, focus: false, offscreen: false, hidden: document.hidden };
      let tl: gsap.core.Timeline | null = null;
      const sync = () => tl?.paused(Object.values(holds).some(Boolean));
      const hold = (key: keyof typeof holds, on: boolean) => {
        holds[key] = on;
        sync();
      };

      const highlight = (category: string | null) => {
        if (!title) return;
        if (category) markKeywords(title, keywords);
        title.querySelectorAll<HTMLElement>("[data-kw]").forEach((kw) => kw.toggleAttribute("data-active", kw.dataset.kw === category));
      };

      const play = (i: number, first = false) => {
        const prev = current;
        current = i;
        const next = gsap.timeline({ onComplete: () => play((i + 1) % scenes.length) });
        next.call(
          () => {
            highlight(scenes[i].category);
            frame.setAttribute("href", `?project=${scenes[i].slug}`);
            frame.setAttribute("aria-label", labels[i]);
          },
          undefined,
          0,
        );
        if (i === 0) next.set(fills, { scaleX: 0 }, 0);
        next.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: SCENE, ease: "none" }, 0);
        if (!first) {
          next
            .to(sceneEls[prev], { autoAlpha: 0, duration: 0.25 }, 0)
            .to(frame, { ...sizeFor(i), duration: MORPH, ease: "power3.inOut" }, 0)
            .to(captions[prev], { yPercent: -100, autoAlpha: 0, duration: 0.45, ease: "power3.inOut" }, 0)
            .fromTo(captions[i], { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 0.45, ease: "power3.inOut" }, 0)
            .fromTo(sceneEls[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.35);
          BUILD[scenes[i].category](next, sceneEls[i], scenes[i]);
        }
        next.set({}, {}, SCENE);
        tl?.kill();
        tl = next;
        sync();
      };

      let started = false;
      startLoop.current = () => {
        if (started || disposed) return;
        started = true;
        play(0, true); // the first scene is already on screen, so it only holds
      };
      holdByUser.current = (on) => hold("user", on);

      const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && hold("hover", true);
      const onLeave = (e: PointerEvent) => e.pointerType === "mouse" && hold("hover", false);
      const onFocus = () => hold("focus", frame.matches(":focus-visible"));
      const onBlur = () => hold("focus", false);
      const onVisibility = () => hold("hidden", document.hidden);
      const observer = new IntersectionObserver(([entry]) => hold("offscreen", !entry.isIntersecting));
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      frame.addEventListener("focus", onFocus);
      frame.addEventListener("blur", onBlur);
      document.addEventListener("visibilitychange", onVisibility);
      observer.observe(el);

      return () => {
        cleanupLayout();
        tl?.kill();
        highlight(null);
        startLoop.current = () => {};
        holdByUser.current = () => {};
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        frame.removeEventListener("focus", onFocus);
        frame.removeEventListener("blur", onBlur);
        document.removeEventListener("visibilitychange", onVisibility);
        observer.disconnect();
      };
    },
    { scope: stage },
  );

  const togglePause = () => {
    setPaused(!paused);
    holdByUser.current(!paused);
  };

  const onOpen = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const slug = new URLSearchParams(e.currentTarget.search).get("project");
    if (!slug) return;
    const detail: OpenEventDetail = { slug, trigger: e.currentTarget };
    // The portfolio cancels the event when it opens the modal; otherwise the link navigates normally.
    if (!window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail, cancelable: true }))) e.preventDefault();
  };

  return (
    <div ref={stage} data-hero-fade className="showcase">
      <div className="flex h-8 items-center justify-between gap-3">
        <span aria-hidden className="meta relative block h-[17px] min-w-0 flex-1 overflow-hidden text-text-2">
          {scenes.map((s, i) => (
            <span key={s.slug} data-caption className="absolute inset-x-0 top-0 truncate" style={i ? HIDDEN : undefined}>
              ({String(s.index).padStart(2, "0")}) {tp(`categories.${s.category}`)} · {s.title}
            </span>
          ))}
        </span>
        {loops && (
          <button
            type="button"
            data-showcase-controls
            onClick={togglePause}
            aria-label={paused ? t("play") : t("pause")}
            className="btn btn-icon size-8 shrink-0 text-text-2 hover:text-text"
          >
            {paused ? (
              <Play aria-hidden strokeWidth={1.5} className="size-4" />
            ) : (
              <Pause aria-hidden strokeWidth={1.5} className="size-4" />
            )}
          </button>
        )}
      </div>

      <div data-showcase-controls aria-hidden className="mt-3 flex h-0.5 gap-1">
        {loops &&
          scenes.map((s) => (
            <span key={s.slug} className="flex-1 overflow-hidden rounded-full bg-line">
              <span data-fill className="block h-full origin-left bg-accent-text" style={{ transform: "scaleX(0)" }} />
            </span>
          ))}
      </div>

      <a
        data-frame
        href={`?project=${scenes[0].slug}`}
        aria-label={labels[0]}
        aria-haspopup="dialog"
        onClick={onOpen}
        className="showcase-frame theme-t mt-3 block rounded-[16px] border border-line bg-[#0a0a0c] p-1.5 fine:hover:border-accent/40"
      >
        <span className="relative block size-full overflow-hidden rounded-[12px] bg-surface">
          {scenes.map((s, i) => (
            <span key={s.slug} data-scene className="absolute inset-0 overflow-hidden" style={i ? HIDDEN : undefined}>
              <SceneContent scene={s} eager={i === 0} />
            </span>
          ))}
        </span>
      </a>
    </div>
  );
}
