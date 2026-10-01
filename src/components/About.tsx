import Image from "next/image";
import { Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";
import blur from "@/data/blur.generated.json";
import { SectionHeading } from "./SectionHeading";

const TOOLS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Flutter",
  "React Native",
  "Supabase",
  "Vercel",
  "Figma",
  "Veo",
  "Kling",
  "Seedance",
  "Nano Banana",
  "CapCut",
  "DaVinci Resolve",
];

const STATS = ["years", "fields", "clients"] as const;
const PHOTO = "/images/artha-restu.webp";

export async function About() {
  const t = await getTranslations("about");

  return (
    <section id="about" aria-labelledby="about-title" className="section-y scroll-mt-20">
      <div className="container-x">
        <SectionHeading index={3} label={t("label")} title={t("title")} id="about-title" />
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-12">
          <div data-reveal className="col-span-12 lg:col-span-7">
            {/* Round profile photo in a thin ring, sized like a typical professional avatar. */}
            <div className="mb-8 w-fit rounded-full border border-line p-1">
              <Image
                src={PHOTO}
                alt={t("photoAlt")}
                width={160}
                height={160}
                placeholder="blur"
                blurDataURL={blur[PHOTO as keyof typeof blur]}
                className="size-28 rounded-full object-cover lg:size-40"
              />
            </div>
            <p className="max-w-[64ch] text-[20px] leading-[1.6] lg:text-[24px] lg:leading-[1.5]">{t("bio")}</p>
            <p className="meta mt-8 inline-flex items-center gap-2 text-text-2">
              <Globe aria-hidden strokeWidth={1.5} className="size-4" />
              {t("location")}
            </p>
          </div>

          <dl data-reveal className="col-span-12 grid grid-cols-3 gap-4 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
            {STATS.map((key) => (
              <div key={key} className="flex flex-col-reverse justify-end gap-2 border-t border-line pt-4">
                <dt className="text-[14px] leading-snug text-text-2">{t(`stats.${key}.label`)}</dt>
                <dd className="font-display text-[clamp(20px,3vw,32px)] text-accent-text">{t(`stats.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div role="region" aria-label={t("toolsLabel")} className="marquee mt-16 overflow-hidden border-y border-line py-6 lg:mt-24">
        <ul className="sr-only">
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div aria-hidden className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {TOOLS.map((tool) => (
                <span key={tool} className="font-display flex items-center text-[28px] text-text-2 lg:text-[40px]">
                  <span className="px-6 lg:px-8">{tool}</span>
                  <span className="size-2 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
