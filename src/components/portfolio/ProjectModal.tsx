"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Link2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@/data/schema";
import type { Locale } from "@/i18n/routing";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { Gallery } from "./Gallery";
import { VideoPlayer } from "./VideoPlayer";

type Props = {
  project: Project;
  open: boolean;
  position: { index: number; total: number };
  onRequestClose: () => void;
  onExited: () => void;
  onStep: (dir: -1 | 1) => void;
  onCopy: () => void;
};

const isSmall = () => window.matchMedia("(max-width: 767px)").matches;

export function ProjectModal({ project, open, position, onRequestClose, onExited, onStep, onCopy }: Props) {
  const t = useTranslations("modal");
  const tp = useTranslations("portfolio");
  const locale = useLocale() as Locale;
  const backdrop = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const handlers = useRef({ onRequestClose, onStep, onExited });
  useLayoutEffect(() => {
    handlers.current = { onRequestClose, onStep, onExited };
  });

  // Lock page scroll for the lifetime of the modal.
  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  // Enter / exit animations.
  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const sheet = isSmall();
    const ctx = gsap.context(() => {
      if (open) {
        if (reduced) {
          gsap.fromTo([backdrop.current, panel.current], { opacity: 0 }, { opacity: 1, duration: 0.15 });
        } else {
          gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
          if (sheet) gsap.fromTo(panel.current, { yPercent: 100 }, { yPercent: 0, duration: 0.4 });
          else gsap.fromTo(panel.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.3 });
        }
        closeBtn.current?.focus({ preventScroll: true });
      } else {
        const done = () => handlers.current.onExited();
        const d = reduced ? 0.15 : 0.2;
        gsap.to(backdrop.current, { opacity: 0, duration: d, ease: "power2.in" });
        if (!reduced && sheet) gsap.to(panel.current, { yPercent: 100, duration: d, ease: "power2.in", onComplete: done });
        else gsap.to(panel.current, { opacity: 0, scale: reduced ? 1 : 0.96, duration: d, ease: "power2.in", onComplete: done });
      }
    });
    return () => ctx.kill();
  }, [open]);

  // Content fade when the project changes (and on first open).
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !panel.current) return;
    const items = panel.current.querySelectorAll("[data-modal-item]");
    const tween = gsap.fromTo(items, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.05 });
    return () => {
      tween.kill();
    };
  }, [project.slug]);

  // Keyboard: Esc closes, ←/→ switch project, Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handlers.current.onRequestClose();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        handlers.current.onStep(e.key === "ArrowLeft" ? -1 : 1);
      } else if (e.key === "Tab" && panel.current) {
        const items = Array.from(
          panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'),
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const category = tp(`categories.${project.category}`);
  const links = [
    project.links.live && { href: project.links.live, label: t("visit") },
    project.links.repo && { href: project.links.repo, label: t("code") },
    project.links.playStore && { href: project.links.playStore, label: t("playStore") },
    project.links.appStore && { href: project.links.appStore, label: t("appStore") },
    project.links.demo && { href: project.links.demo, label: t("demo") },
    project.category === "video" && project.youtubeUrl && { href: project.youtubeUrl, label: t("youtube") },
  ].filter(Boolean) as { href: string; label: string }[];

  const stepBtn = "btn btn-icon border-line";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <div ref={backdrop} aria-hidden className="modal-backdrop absolute inset-0" onClick={onRequestClose} />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="glass glass-strong relative flex h-[calc(100svh-24px)] w-full flex-col overflow-hidden rounded-t-[16px] md:h-auto md:max-h-[calc(100svh-48px)] md:max-w-[1080px] md:rounded-[16px]"
      >
        <div aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-text-2/40 md:hidden" />

        <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-3 md:px-6">
          <p className="meta mr-auto text-text-2">
            {category} · {project.year}
          </p>
          <p className="meta mr-2 hidden text-text-2 sm:block" aria-live="polite">
            {t("counter", { current: position.index + 1, total: position.total })}
          </p>
          <button type="button" onClick={() => onStep(-1)} aria-label={t("prev")} className={stepBtn} disabled={position.total < 2}>
            <ChevronLeft aria-hidden strokeWidth={1.5} className="size-5" />
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label={t("next")} className={stepBtn} disabled={position.total < 2}>
            <ChevronRight aria-hidden strokeWidth={1.5} className="size-5" />
          </button>
          <button ref={closeBtn} type="button" onClick={onRequestClose} aria-label={t("close")} className={`${stepBtn} ml-2`}>
            <X aria-hidden strokeWidth={1.5} className="size-5" />
          </button>
        </div>

        <div
          key={project.slug}
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid md:grid-cols-[3fr_2fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden"
        >
          <div data-modal-item className="flex items-center justify-center p-4 md:overflow-y-auto md:p-6">
            <div className="w-full">
              {project.category === "video" ? (
                <VideoPlayer project={project} active={open} />
              ) : (
                <Gallery
                  images={project.gallery ?? []}
                  variant={project.category}
                  altFor={(n) => tp("imageAlt", { title: project.title, category, n })}
                />
              )}
            </div>
          </div>

          <div data-modal-item data-lenis-prevent className="flex flex-col gap-6 border-line p-4 pb-10 md:overflow-y-auto md:border-l md:p-6">
            <div>
              <h2 id="project-modal-title" className="font-display text-[32px]">
                {project.title}
              </h2>
              <p className="mt-4 text-[16px] text-text-2">{project.description[locale]}</p>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-y border-line py-4 text-[16px]">
              {project.role && (
                <div>
                  <dt className="meta text-text-2">{t("role")}</dt>
                  <dd className="mt-1">{project.role[locale]}</dd>
                </div>
              )}
              <div>
                <dt className="meta text-text-2">{t("year")}</dt>
                <dd className="mt-1">{project.year}</dd>
              </div>
            </dl>

            {project.tags.length > 0 && (
              <div>
                <h3 className="sr-only">{t("tags")}</h3>
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="meta rounded-full border border-line px-3 py-1.5 text-text-2">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-3">
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener" className="btn btn-secondary">
                  {link.label}
                  <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4" />
                </a>
              ))}
              <button type="button" onClick={onCopy} className="btn btn-secondary">
                <Link2 aria-hidden strokeWidth={1.5} className="size-4" />
                {t("copy")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
