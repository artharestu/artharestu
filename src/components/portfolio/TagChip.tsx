import type { CSSProperties } from "react";
import type { ProjectTag } from "@/data/schema";

type Props = { tag: ProjectTag; className?: string };

/** Project tag pill. Known technologies show their logo on a see-through tint of the brand colour (`.chip`). */
export function TagChip({ tag, className = "" }: Props) {
  const { logo } = tag;
  const tone = logo && ({ "--tone-dark": logo.dark, "--tone-light": logo.light } as CSSProperties);

  return (
    <span className={`chip theme-t ${className}`} style={tone}>
      {logo && (
        <svg aria-hidden viewBox="0 0 24 24">
          {logo.plate && <rect x="1" y="1" width="22" height="22" fill={logo.plate} />}
          <path d={logo.path} fill="currentColor" />
        </svg>
      )}
      {tag.name}
    </span>
  );
}
