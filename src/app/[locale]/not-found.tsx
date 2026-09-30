import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center gap-4 pt-32 text-center">
      <p className="meta text-accent-text">404</p>
      <h1 className="font-display h-section">{t("title")}</h1>
      <p className="text-text-2">{t("text")}</p>
      <a href={`/${locale}`} className="btn btn-primary mt-4">
        {t("cta")}
      </a>
    </section>
  );
}
