import type { CSSProperties } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import blur from "@/data/blur.generated.json";
import { SectionHeading } from "./SectionHeading";

const TOOLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "PHP",
  "Laravel",
  "Go",
  "Python",
  "Flutter",
  "React Native",
  "REST API",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Firebase",
  "Veo",
  "Gemini Omni",
  "Kling AI",
  "Seedance",
  "Nano Banana",
  "GPT Image",
  "Higgsfield",
  "ElevenLabs",
  "CapCut",
  "Prompt Engineering",
];

const STATS = ["years", "fields", "clients"] as const;
const PHOTO = "/images/artha-restu.webp";

export async function About() {
  const t = await getTranslations("about");

  return (
    <section id="about" aria-labelledby="about-title" className="section-y scroll-mt-20">
      <div className="container-x">
        <SectionHeading index={3} label={t("label")} title={t("title")} id="about-title" />
        <div className="grid grid-cols-12 gap-6 lg:gap-x-12">
          <div data-reveal className="col-span-12 lg:col-span-7">
            <p className="max-w-[64ch] text-[20px] leading-[1.6] lg:text-[24px] lg:leading-[1.5]">{t("bio")}</p>
            <p className="meta mt-8 inline-flex items-center gap-2 text-text-2">
              <MapPin aria-hidden strokeWidth={1.5} className="size-4" />
              {t("location")}
            </p>
          </div>

          {/* The photo is deliberately muted (grayscale + dark overlay), with the stats laid over it. */}
          <div data-reveal className="col-span-12 lg:col-span-5">
            <figure className="relative isolate aspect-[4/5] max-h-[640px] w-full overflow-hidden rounded-[16px] border border-line bg-[#0b0b0f] sm:aspect-[16/11] lg:aspect-[4/5]">
              <Image
                src={PHOTO}
                alt={t("photoAlt")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={blur[PHOTO as keyof typeof blur]}
                className="object-cover object-[50%_20%] opacity-50 contrast-[1.1] grayscale"
              />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#0b0b0f_18%,rgba(11,11,15,0.55)_55%,rgba(11,11,15,0.25))]" />
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(200,255,61,0.18),transparent_55%)] mix-blend-screen" />
              <dl className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-4 p-6 text-[#f2f0ea]">
                {STATS.map((key) => (
                  <div key={key} className="flex flex-col-reverse gap-2 border-t border-white/15 pt-4">
                    <dt className="text-[14px] leading-snug text-[#c9c7c0]">{t(`stats.${key}.label`)}</dt>
                    <dd className="font-display text-[clamp(20px,3vw,32px)] text-[#c8ff3d]">{t(`stats.${key}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </figure>
          </div>
        </div>
      </div>

      <div role="region" aria-label={t("toolsLabel")} className="marquee mt-16 overflow-hidden border-y border-line py-4 lg:mt-24 lg:py-6">
        <ul className="sr-only">
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div aria-hidden className="marquee-track flex w-max" style={{ "--marquee-items": TOOLS.length } as CSSProperties}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {TOOLS.map((tool) => (
                <span key={tool} className="font-display flex items-center text-[18px] text-text-2 lg:text-[24px]">
                  <span className="px-4 lg:px-6">{tool}</span>
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
