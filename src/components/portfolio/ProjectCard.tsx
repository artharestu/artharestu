"use client";

import type { MouseEvent } from "react";
import { ArrowUpRight, CalendarDays, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@/data/schema";
import type { Locale } from "@/i18n/routing";
import { CoverImage } from "./CoverImage";
import { TagChip } from "./TagChip";

type Props = {
  project: Project;
  hidden: boolean;
  priority?: boolean;
  onOpen: (slug: string, trigger: HTMLElement) => void;
};

export function ProjectCard({ project, hidden, priority, onOpen }: Props) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as Locale;
  const category = t(`categories.${project.category}`);
  const isVideo = project.category === "video";

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onOpen(project.slug, e.currentTarget);
  };

  return (
    <li data-card data-reveal-item data-slug={project.slug} className={hidden ? "hidden" : ""}>
      <a
        href={`?project=${project.slug}`}
        onClick={onClick}
        aria-haspopup="dialog"
        className="group theme-t block h-full rounded-[16px] border border-line bg-surface p-3 fine:hover:border-accent/40"
      >
        <span className="relative block aspect-[4/3] overflow-hidden rounded-[12px] bg-bg">
          <CoverImage
            project={project}
            alt={`${project.title} — ${category}`}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="transition-transform duration-500 ease-[var(--ease-out)] fine:group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          <span className="absolute left-3 top-3 flex gap-2">
            <span className="meta rounded-full bg-[#0b0b0f]/75 px-3 py-1.5 text-[#f2f0ea]">{category}</span>
            {isVideo && project.aspect === "9:16" && (
              <span className="meta rounded-full bg-[#0b0b0f]/75 px-3 py-1.5 text-[#f2f0ea]">{t("vertical")}</span>
            )}
          </span>
          {isVideo && (
            <span aria-hidden className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform duration-300 ease-[var(--ease-out)] fine:group-hover:scale-110 motion-reduce:transition-none">
                <Play strokeWidth={1.5} className="ml-0.5 size-6 fill-current" />
              </span>
            </span>
          )}
        </span>

        <span className="flex items-start justify-between gap-4 px-2 pt-4">
          <span className="min-w-0">
            <span className="block text-[20px] font-medium leading-snug">{project.title}</span>
            <span className="mt-1 block text-[16px] leading-snug text-text-2">{project.summary[locale]}</span>
          </span>
          <ArrowUpRight
            aria-hidden
            strokeWidth={1.5}
            className="mt-1 size-5 shrink-0 text-text-2 transition-transform duration-300 ease-[var(--ease-out)] fine:group-hover:-translate-y-1 fine:group-hover:translate-x-1 fine:group-hover:text-accent-text"
          />
        </span>

        <span className="flex flex-wrap items-center gap-2 px-2 pb-2 pt-4">
          <span className="chip theme-t">
            <CalendarDays aria-hidden strokeWidth={1.5} />
            {project.year}
          </span>
          {/* Only tags with a logo or icon make the card; the modal lists them all. */}
          {project.tags
            .filter((tag) => tag.logo || tag.icon)
            .slice(0, 3)
            .map((tag) => (
              <TagChip key={tag.label.en} tag={tag} />
            ))}
        </span>
      </a>
    </li>
  );
}
