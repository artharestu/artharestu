const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** Extracts the video ID from watch?v=, youtu.be/, /shorts/, and /embed/ URLs. */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = parsed.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else {
      const match = parsed.pathname.match(/^\/(shorts|embed|live|v)\/([^/?#]+)/);
      id = match?.[2] ?? null;
    }
  }
  return id && ID_PATTERN.test(id) ? id : null;
}

export function youTubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1`;
}

export function youTubeThumb(id: string, quality: "maxresdefault" | "hqdefault") {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}
