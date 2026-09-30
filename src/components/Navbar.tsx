"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { whatsappUrl } from "@/lib/site";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SectionLink } from "./SectionLink";
import { ThemeToggle } from "./ThemeToggle";

const SECTIONS = ["services", "portfolio", "about"] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wa = whatsappUrl(tc("whatsappMessage"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Full-screen mobile menu: lock scroll, animate in, trap focus, Esc to close.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menuOpen || !menu) return;
    lockScroll();
    if (!prefersReducedMotion()) {
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(menu.querySelectorAll("[data-menu-item]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, delay: 0.05 });
    }
    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>("a[href], button"));
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key !== "Tab") return;
      const items = [toggleRef.current!, ...focusables()];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <div className="container-x">
        <nav
          aria-label={t("label")}
          data-scrolled={scrolled}
          className="glass relative z-10 flex h-16 items-center gap-6 rounded-[16px] pl-5 pr-3 transition-[height] duration-[250ms] ease-[var(--ease-out)] data-[scrolled=true]:h-[52px]"
        >
          <SectionLink section="top" aria-label={t("home")} onNavigate={closeMenu} className="font-display rounded-full text-[15px] tracking-tight">
            Artha Restu
          </SectionLink>

          <ul className="ml-auto hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => (
              <li key={s}>
                <SectionLink section={s} className="rounded-full px-3 py-2 text-sm text-text-2 transition-colors hover:text-text">
                  {t(s)}
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <LocaleSwitcher className="hidden md:flex" />
            <ThemeToggle className="hidden md:inline-flex" />
            <a href={wa} target="_blank" rel="noopener" className="btn btn-primary btn-sm hidden md:inline-flex">
              {tc("whatsapp")}
              <ArrowUpRight aria-hidden strokeWidth={1.5} className="arrow size-4" />
              <span className="sr-only">{tc("newTab")}</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
              onClick={() => setMenuOpen((v) => !v)}
              className="btn btn-icon md:hidden"
            >
              {menuOpen ? <X aria-hidden strokeWidth={1.5} className="size-5" /> : <Menu aria-hidden strokeWidth={1.5} className="size-5" />}
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-0 flex flex-col bg-bg px-4 pb-8 pt-28 md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {SECTIONS.map((s, i) => (
              <li key={s} data-menu-item>
                <SectionLink section={s} onNavigate={closeMenu} className="flex items-baseline gap-4 rounded-[16px] py-3">
                  <span className="meta text-text-2">({String(i + 1).padStart(2, "0")})</span>
                  <span className="font-display text-[40px]">{t(s)}</span>
                </SectionLink>
              </li>
            ))}
          </ul>
          <div data-menu-item className="mt-auto flex flex-col gap-6 border-t border-line pt-6">
            <div className="flex items-center justify-between">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <a href={wa} target="_blank" rel="noopener" className="btn btn-primary w-full">
              {tc("whatsapp")}
              <ArrowUpRight aria-hidden strokeWidth={1.5} className="arrow size-5" />
              <span className="sr-only">{tc("newTab")}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
