import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { whatsappUrl } from "@/lib/site";
import { MagneticButton } from "./MagneticButton";

export async function Contact() {
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y scroll-mt-20">
      <div className="container-x">
        <div data-reveal>
          <h2 id="contact-title" className="font-display max-w-[14ch] text-balance text-[clamp(44px,9vw,120px)]">
            {t("title")}
          </h2>
          <p className="mt-8 max-w-[48ch] text-text-2 lg:text-[20px]">{t("sub")}</p>
          <div className="mt-10">
            <MagneticButton>
              <a href={whatsappUrl(tc("whatsappMessage"))} target="_blank" rel="noopener" className="btn btn-primary">
                {t("cta")}
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="arrow size-5" />
                <span className="sr-only">{tc("newTab")}</span>
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
