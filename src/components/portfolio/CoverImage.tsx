"use client";

import Image from "next/image";
import { useState } from "react";
import { Clapperboard, Monitor, Smartphone } from "lucide-react";
import blur from "@/data/blur.generated.json";
import type { Project } from "@/data/schema";
import { getYouTubeId, youTubeThumb } from "@/lib/youtube";

const ICONS = { web: Monitor, mobile: Smartphone, video: Clapperboard };

function sourcesFor(project: Project) {
  if (project.cover) return [project.cover];
  const id = getYouTubeId(project.youtubeUrl);
  return id ? [youTubeThumb(id, "maxresdefault"), youTubeThumb(id, "hqdefault")] : [];
}

type Props = { project: Project; alt: string; sizes: string; className?: string; priority?: boolean };

/** Card cover with fallbacks: cover → YouTube maxres → hq → solid panel with title + category icon. */
export function CoverImage({ project, alt, sizes, className = "", priority }: Props) {
  const sources = sourcesFor(project);
  const [attempt, setAttempt] = useState(0);
  const src = sources[attempt];

  if (!src) {
    const Icon = ICONS[project.category];
    return (
      <span className="absolute inset-0 flex flex-col items-start justify-end gap-3 bg-surface p-6">
        <Icon aria-hidden strokeWidth={1.5} className="size-8 text-text-2" />
        <span className="font-display text-[24px] text-text">{project.title}</span>
      </span>
    );
  }

  const blurUrl = (blur as Record<string, string>)[src];
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={blurUrl ? "blur" : "empty"}
      blurDataURL={blurUrl}
      onError={() => setAttempt((n) => n + 1)}
      className={`object-cover ${className}`}
    />
  );
}
