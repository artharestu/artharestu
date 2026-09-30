import { ArrowUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SectionLink } from "./SectionLink";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-8">
        <p className="meta text-text-2">{t("copyright")}</p>
        <div className="flex items-center gap-6">
          <LocaleSwitcher />
          <SectionLink
            section="top"
            className="meta inline-flex items-center gap-2 rounded-full py-2 text-text-2 transition-colors hover:text-text"
          >
            {t("top")}
            <ArrowUp aria-hidden strokeWidth={1.5} className="size-4" />
          </SectionLink>
        </div>
      </div>
    </footer>
  );
}
