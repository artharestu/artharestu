"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clapperboard, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import blur from "@/data/blur.generated.json";
import type { Project } from "@/data/schema";
import { getYouTubeId, youTubeEmbedUrl } from "@/lib/youtube";

type Props = { project: Project; active: boolean };

/**
 * YouTube player for the modal. The iframe exists only while the modal is open (`active`),
 * so closing it removes the iframe and stops audio.
 */
export function VideoPlayer({ project, active }: Props) {
  const t = useTranslations("modal");
  const id = getYouTubeId(project.youtubeUrl);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vertical = project.aspect === "9:16";

  // With enablejsapi=1 the player posts events; onError (100/101/150) means removed or not embeddable.
  useEffect(() => {
    if (!id || !active) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onError") setStatus("error");
      } catch {
        /* not a player message */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [id, active]);

  const onLoad = () => {
    setStatus((s) => (s === "error" ? s : "ready"));
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: project.slug }), "*");
  };

  const box = vertical ? "mx-auto aspect-[9/16] h-[min(66svh,640px)] max-w-full" : "aspect-video w-full";
  const cover = project.cover;
  const coverBlur = cover ? (blur as Record<string, string>)[cover] : undefined;

  return (
    <div className={`relative overflow-hidden rounded-[12px] bg-surface ${box}`}>
      {!id ? (
        <>
          {cover && (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 768px) 620px, 100vw"
              placeholder={coverBlur ? "blur" : "empty"}
              blurDataURL={coverBlur}
              className="object-cover opacity-40 blur-[2px]"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0b0f]/60 p-6 text-center text-[#f2f0ea]">
            <Clapperboard aria-hidden strokeWidth={1.5} className="size-8 text-[#c8ff3d]" />
            <p className="text-[20px] font-medium">{t("videoSoonTitle")}</p>
            <p className="max-w-[32ch] text-[16px] text-[#c9c7c0]">{t("videoSoonText")}</p>
          </div>
        </>
      ) : status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <TriangleAlert aria-hidden strokeWidth={1.5} className="size-8 text-danger" />
          <p role="alert" className="text-[18px] font-medium">
            {t("videoFailed")}
          </p>
          <a href={project.youtubeUrl!} target="_blank" rel="noopener" className="btn btn-primary">
            {t("youtube")}
            <ArrowUpRight aria-hidden strokeWidth={1.5} className="arrow size-5" />
          </a>
        </div>
      ) : (
        active && (
          <iframe
            ref={iframeRef}
            src={youTubeEmbedUrl(id)}
            title={project.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={onLoad}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
          />
        )
      )}
    </div>
  );
}
