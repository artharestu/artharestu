"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Category } from "@/data/categories";
import type { Project } from "@/data/schema";
import { FILTER_EVENT, OPEN_EVENT, type FilterEventDetail, type OpenEventDetail } from "@/lib/events";
import dynamic from "next/dynamic";
import type { Flip } from "gsap/Flip";
import { gsap, getFlip, loadFlip, useGSAP, isFinePointer, prefersReducedMotion } from "@/lib/motion";
import { SITE_URL } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";

const loadModal = () => import("./ProjectModal").then((m) => m.ProjectModal);
const ProjectModal = dynamic(loadModal, { ssr: false });

type Filter = "all" | Category;
const FILTERS: Filter[] = ["all", "web", "mobile", "video"];

function readProjectParam() {
  return new URLSearchParams(window.location.search).get("project");
}

function urlWithProject(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set("project", slug);
  else url.searchParams.delete("project");
  return `${url.pathname}${url.search}${url.hash}`;
}

export function Portfolio({ projects }: { projects: Project[] }) {
  const t = useTranslations("portfolio");
  const tm = useTranslations("modal");
  const locale = useLocale();

  const [filter, setFilter] = useState<Filter>("all");
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);

  const bySlug = useMemo(() => new Map(projects.map((p) => [p.slug, p])), [projects]);
  const visible = useMemo(() => projects.filter((p) => filter === "all" || p.category === filter), [projects, filter]);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, web: 0, mobile: 0, video: 0 };
    projects.forEach((p) => c[p.category]++);
    return c;
  }, [projects]);

  // ——— Filtering (GSAP Flip) ———
  const changeFilter = useCallback(
    (next: Filter) => {
      if (next === filter) return;
      const Flip = getFlip();
      if (Flip && !prefersReducedMotion() && gridRef.current) {
        flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-card]"));
      }
      setFilter(next);
    },
    [filter],
  );

  useLayoutEffect(() => {
    const state = flipState.current;
    const Flip = getFlip();
    if (!state || !Flip) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.45,
      ease: "power3.out",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.3 }),
    });
  }, [filter]);

  useEffect(() => {
    const onFilter = (e: Event) => changeFilter((e as CustomEvent<FilterEventDetail>).detail.category);
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, [changeFilter]);

  // Warm the lazy chunks once the page is idle, so the first filter/modal feels instant.
  useEffect(() => {
    const warm = () => {
      loadFlip();
      loadModal();
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(warm, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 1500);
    return () => clearTimeout(id);
  }, []);

  // ——— Modal <-> URL (?project=slug) ———
  useEffect(() => {
    const syncFromUrl = () => {
      const slug = readProjectParam();
      if (slug && bySlug.has(slug)) {
        setModalSlug(slug);
        setModalOpen(true);
      } else {
        if (slug) history.replaceState(history.state, "", urlWithProject(null));
        pushedRef.current = false;
        setModalOpen(false);
      }
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [bySlug]);

  const openProject = useCallback((slug: string, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    history.pushState(null, "", urlWithProject(slug));
    pushedRef.current = true;
    setModalSlug(slug);
    setModalOpen(true);
  }, []);

  // The hero showcase opens projects through the same path as the cards.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const { slug, trigger } = (e as CustomEvent<OpenEventDetail>).detail;
      if (!bySlug.has(slug)) return;
      e.preventDefault();
      openProject(slug, trigger);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [bySlug, openProject]);

  const requestClose = useCallback(() => {
    if (pushedRef.current) {
      history.back(); // popstate closes the modal
    } else {
      history.replaceState(history.state, "", urlWithProject(null));
      setModalOpen(false);
    }
  }, []);

  const onExited = useCallback(() => {
    setModalSlug(null);
    const trigger =
      triggerRef.current ?? gridRef.current?.querySelector<HTMLElement>(`[data-slug="${modalSlug}"] a`) ?? null;
    trigger?.focus({ preventScroll: true });
    triggerRef.current = null;
  }, [modalSlug]);

  // Prev/next follow the active filter; fall back to the full list if the open project is filtered out.
  const sequence = modalSlug && visible.some((p) => p.slug === modalSlug) ? visible : projects;
  const position = { index: Math.max(0, sequence.findIndex((p) => p.slug === modalSlug)), total: sequence.length };

  const step = useCallback(
    (dir: -1 | 1) => {
      if (sequence.length < 2) return;
      const next = sequence[(position.index + dir + sequence.length) % sequence.length];
      history.replaceState(history.state, "", urlWithProject(next.slug));
      triggerRef.current = gridRef.current?.querySelector<HTMLElement>(`[data-slug="${next.slug}"] a`) ?? null;
      setModalSlug(next.slug);
    },
    [sequence, position.index],
  );

  // ——— Toast ———
  const showToast = (text: string) => setToast({ id: Date.now(), text });
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE_URL}/${locale}?project=${modalSlug}`);
      showToast(tm("copied"));
    } catch {
      showToast(tm("copyFailed"));
    }
  };

  const toastRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!toast || !toastRef.current) return;
    const el = toastRef.current;
    const reduced = prefersReducedMotion();
    const tl = gsap
      .timeline({ onComplete: () => setToast(null) })
      .fromTo(el, { opacity: 0, y: reduced ? 0 : 8 }, { opacity: 1, y: 0, duration: 0.25 })
      .to(el, { opacity: 0, y: reduced ? 0 : 8, duration: 0.2 }, "+=2");
    return () => {
      tl.kill();
    };
  }, [toast]);

  // ——— Cursor label (pointer: fine only) ———
  const sectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const label = cursorRef.current;
      const grid = gridRef.current;
      if (!label || !grid || !isFinePointer() || prefersReducedMotion()) return;
      gsap.set(label, { scale: 0, xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3" });
      let shown = false;
      const show = (on: boolean) => {
        if (on === shown) return;
        shown = on;
        gsap.to(label, { scale: on ? 1 : 0, duration: 0.25, overwrite: "auto" });
      };
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        show(!!(e.target as HTMLElement).closest?.("[data-card]"));
      };
      const onLeave = () => show(false);
      grid.addEventListener("pointermove", onMove);
      grid.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onLeave, { passive: true });
      return () => {
        grid.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onLeave);
      };
    },
    { scope: sectionRef },
  );

  // ——— Tab indicator ———
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const btn = tabsRef.current?.querySelector<HTMLElement>(`[data-filter="${filter}"]`);
      if (btn) setIndicator({ x: btn.offsetLeft, w: btn.offsetWidth });
    };
    measure();
    // Keep the active tab visible in the horizontally scrolling bar (phones). Only the bar scrolls:
    // scrollIntoView would also scroll the page down to the tabs as soon as it loads.
    const bar = tabsRef.current?.parentElement;
    const active = tabsRef.current?.querySelector<HTMLElement>(`[data-filter="${filter}"]`);
    if (bar && active) {
      const tab = active.getBoundingClientRect();
      const view = bar.getBoundingClientRect();
      if (tab.left < view.left) bar.scrollLeft -= view.left - tab.left + 16;
      else if (tab.right > view.right) bar.scrollLeft += tab.right - view.right + 16;
    }
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  const modalProject = modalSlug ? bySlug.get(modalSlug) : undefined;

  return (
    <div ref={sectionRef}>
      <div className="no-scrollbar -mx-4 mb-8 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div ref={tabsRef} role="group" aria-label={t("filterLabel")} className="relative flex w-max gap-1 rounded-full border border-line p-1">
          {indicator && (
            <span
              aria-hidden
              className="absolute bottom-1 left-0 top-1 rounded-full bg-accent transition-[transform,width] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
              style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
            />
          )}
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                data-filter={f}
                aria-pressed={active}
                onClick={() => changeFilter(f)}
                className={`relative z-10 flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors duration-200 ${
                  active ? `text-accent-ink ${indicator ? "" : "bg-accent"}` : "text-text-2 hover:text-text"
                }`}
              >
                {t(`filters.${f}`)}
                <span className={`meta ${active ? "text-accent-ink/70" : "text-text-2"}`}>{counts[f]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul ref={gridRef} data-reveal-group className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            hidden={filter !== "all" && p.category !== filter}
            priority={i < 3}
            onOpen={openProject}
          />
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[16px] border border-line px-6 py-16 text-center">
          <p className="text-[20px] font-medium">{t("emptyTitle")}</p>
          <p className="text-text-2">{t("emptyText")}</p>
          <button type="button" onClick={() => changeFilter("all")} className="btn btn-secondary mt-3">
            {t("emptyCta")}
          </button>
        </div>
      )}

      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden size-[72px] items-center justify-center rounded-full bg-accent text-[14px] font-medium text-accent-ink fine:flex motion-reduce:!hidden"
        style={{ transform: "scale(0)" }}
      >
        {t("view")}
      </div>

      {modalProject && (
        <ProjectModal
          project={modalProject}
          open={modalOpen}
          position={position}
          onRequestClose={requestClose}
          onExited={onExited}
          onStep={step}
          onCopy={copyLink}
        />
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        {toast && (
          <div key={toast.id} ref={toastRef} className="glass glass-strong rounded-full px-5 py-3 text-[14px] font-medium">
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
