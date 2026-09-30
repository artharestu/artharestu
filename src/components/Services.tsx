import { Clapperboard, Monitor, Smartphone, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Category } from "@/data/categories";
import { SectionHeading } from "./SectionHeading";
import { ServiceLink } from "./ServiceLink";

const SERVICES: { key: Category; icon: LucideIcon }[] = [
  { key: "web", icon: Monitor },
  { key: "mobile", icon: Smartphone },
  { key: "video", icon: Clapperboard },
];

export async function Services() {
  const t = await getTranslations("services");

  return (
    <section id="services" aria-labelledby="services-title" className="section-y scroll-mt-20">
      <div className="container-x">
        <SectionHeading index={1} label={t("label")} title={t("title")} id="services-title" />
        <ul data-reveal-group className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map(({ key, icon: Icon }, i) => {
            const points = t.raw(`items.${key}.points`) as string[];
            return (
              <li key={key} data-reveal-item className="glass flex flex-col rounded-[16px] p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="meta text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden strokeWidth={1.5} className="size-6 text-text-2" />
                </div>
                <h3 className="mt-12 text-[24px] font-medium leading-tight">{t(`items.${key}.title`)}</h3>
                <p className="mt-3 text-text-2">{t(`items.${key}.text`)}</p>
                <ul className="mt-6 flex flex-col border-t border-line">
                  {points.map((point) => (
                    <li key={point} className="border-b border-line py-3 text-[16px]">
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <ServiceLink category={key} label={t("cta")} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
