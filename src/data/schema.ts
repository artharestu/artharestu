import { z } from "zod";
import { categories } from "./categories";

export type { Category } from "./categories";

const https = z.string().url().startsWith("https://", "must start with https://");
const localized = (max: number) => z.object({ id: z.string().min(1).max(max), en: z.string().min(1).max(max) });


const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case"),
    category: z.enum(categories),
    title: z.string().min(1).max(40),
    summary: localized(140),
    description: localized(400),
    year: z.number().int().min(2000).max(2100),
    role: localized(60).optional(),
    tags: z.array(z.string().min(1)).max(5),
    cover: z.string().startsWith("/portfolio/").optional(),
    gallery: z.array(z.string().startsWith("/portfolio/")).optional(),
    youtubeUrl: https.nullable().optional(),
    aspect: z.enum(["16:9", "9:16"]).optional(),
    links: z
      .object({
        live: https.optional(),
        repo: https.optional(),
        playStore: https.optional(),
        appStore: https.optional(),
        demo: https.optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
  })
  .superRefine((p, ctx) => {
    if (p.category === "web" || p.category === "mobile") {
      const n = p.gallery?.length ?? 0;
      if (n < 1 || n > 5) ctx.addIssue({ code: "custom", path: ["gallery"], message: "needs 1–5 images for web/mobile" });
      if (!p.cover) ctx.addIssue({ code: "custom", path: ["cover"], message: "required for web/mobile" });
    }
    if (p.category === "video") {
      if (p.youtubeUrl === undefined)
        ctx.addIssue({ code: "custom", path: ["youtubeUrl"], message: "required for video (use null for a placeholder)" });
      if (!p.aspect) ctx.addIssue({ code: "custom", path: ["aspect"], message: "required for video" });
    }
  });

export type ProjectInput = z.input<typeof projectSchema>;
export type Project = z.output<typeof projectSchema>;

/** Validates at module load, so invalid data fails `next build` with the slug and field named. */
export function parseProjects(input: ProjectInput[]): Project[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  const projects: Project[] = [];

  input.forEach((raw, i) => {
    const label = typeof raw.slug === "string" ? raw.slug : `#${i}`;
    const result = projectSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`  - [${label}] ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
      return;
    }
    if (seen.has(result.data.slug)) errors.push(`  - [${label}] slug: duplicate slug`);
    seen.add(result.data.slug);
    projects.push(result.data);
  });

  if (errors.length) throw new Error(`Invalid portfolio data in src/data/projects.ts:\n${errors.join("\n")}`);

  return projects.sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year || a.order - b.order,
  );
}
