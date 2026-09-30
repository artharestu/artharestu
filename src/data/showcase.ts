import blur from "./blur.generated.json";
import { categories, type Category } from "./categories";
import type { Project } from "./schema";
import { getYouTubeId, youTubeThumb } from "@/lib/youtube";

/** Screen ratio of the hero frame for each scene. */
export type ShowcaseShape = "16:10" | "9:19.5" | "9:16" | "16:9";
export type ShowcaseImage = { src: string; blurDataURL?: string; fallback?: string };
export type ShowcaseScene = {
  slug: string;
  category: Category;
  /** Service number (01 Website, 02 Mobile App, 03 AI Video), same as the Services section. */
  index: number;
  title: string;
  shape: ShowcaseShape;
  /** Web: one screenshot. Mobile: one or two screens (the second one is swiped to). Video: the cover. */
  images: ShowcaseImage[];
};

const blurs = blur as Record<string, string>;
const local = (src: string): ShowcaseImage => ({ src, blurDataURL: blurs[src] });

function imagesFor(project: Project): ShowcaseImage[] {
  if (project.category === "web") return [local(project.gallery?.[0] ?? project.cover!)];
  if (project.category === "mobile") return (project.gallery ?? []).slice(0, 2).map(local);
  if (project.cover) return [local(project.cover)];
  const id = getYouTubeId(project.youtubeUrl);
  return id ? [{ src: youTubeThumb(id, "maxresdefault"), fallback: youTubeThumb(id, "hqdefault") }] : [];
}

function shapeFor(project: Project): ShowcaseShape {
  if (project.category === "web") return "16:10";
  if (project.category === "mobile") return "9:19.5";
  return project.aspect ?? "16:9";
}

/**
 * One project per category for the hero showcase, in service order. `projects` is already sorted
 * featured-first, so this picks the featured project, or the newest one when none is featured.
 */
export function getShowcase(projects: Project[]): ShowcaseScene[] {
  return categories.flatMap((category, i) => {
    const project = projects.find((p) => p.category === category);
    const images = project ? imagesFor(project) : [];
    if (!project || !images.length) return [];
    return [{ slug: project.slug, category, index: i + 1, title: project.title, shape: shapeFor(project), images }];
  });
}
