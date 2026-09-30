"use client";

import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { FILTER_EVENT, type FilterEventDetail } from "@/lib/events";
import { SectionLink } from "./SectionLink";

export function ServiceLink({ category, label }: { category: Category; label: string }) {
  return (
    <SectionLink
      section="portfolio"
      onNavigate={() => window.dispatchEvent(new CustomEvent<FilterEventDetail>(FILTER_EVENT, { detail: { category } }))}
      className="link inline-flex items-center gap-1 rounded-full text-[16px] font-medium"
    >
      {label}
      <ArrowRight aria-hidden strokeWidth={1.5} className="arrow size-4" />
    </SectionLink>
  );
}
