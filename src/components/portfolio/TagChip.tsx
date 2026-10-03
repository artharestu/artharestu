import type { CSSProperties } from "react";
import { useLocale } from "next-intl";
import type { ProjectTag } from "@/data/schema";
import type { Locale } from "@/i18n/routing";
import { TAG_ICONS } from "@/lib/tag-icons";

type Props = { tag: ProjectTag; className?: string };

/**
 * Project tag pill in the visitor's language (`.chip`). Technologies show their logo on a see-through
 * tint of the brand colour; descriptive tags show a Lucide icon on neutral grey.
 */
export function TagChip({ tag, className = "" }: Props) {
  const locale = useLocale() as Locale;
  const { logo } = tag;
  const Icon = tag.icon && TAG_ICONS[tag.icon];
  const tone = logo && ({ "--tone-dark": logo.dark, "--tone-light": logo.light } as CSSProperties);

  return (
    <span className={`chip theme-t ${className}`} style={tone}>
      {logo && (
        <svg aria-hidden viewBox="0 0 24 24">
          {logo.plate && <rect x="1" y="1" width="22" height="22" fill={logo.plate} />}
          <path d={logo.path} fill="currentColor" />
        </svg>
      )}
      {Icon && <Icon aria-hidden strokeWidth={1.5} />}
      {tag.label[locale]}
    </span>
  );
}
