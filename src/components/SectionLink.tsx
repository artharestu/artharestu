"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useLocale } from "next-intl";
import { scrollToSection } from "@/lib/scroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { section: string; onNavigate?: () => void };

/** Anchor to a section on the home page; smooth-scrolls when the section is on the current page. */
export function SectionLink({ section, onNavigate, onClick, ...rest }: Props) {
  const locale = useLocale();
  const href = section === "top" ? `/${locale}` : `/${locale}#${section}`;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (section !== "top" && !document.getElementById(section)) return; // let the browser navigate
    e.preventDefault();
    if (onNavigate) {
      // Closing the mobile menu unlocks scrolling on the next commit; scroll after that.
      onNavigate();
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(section)));
    } else {
      scrollToSection(section);
    }
  };

  return <a href={href} onClick={handleClick} {...rest} />;
}
