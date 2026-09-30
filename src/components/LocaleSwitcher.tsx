"use client";

import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { routing } from "@/i18n/routing";

function rememberLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** "ID / EN" — keeps ?project= and the #section when switching. */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const current = useLocale();

  const onClick = (e: MouseEvent<HTMLAnchorElement>, locale: string) => {
    rememberLocale(locale);
    const rest = window.location.pathname.replace(/^\/(id|en)(?=\/|$)/, "");
    e.currentTarget.href = `/${locale}${rest}${window.location.search}${window.location.hash}`;
  };

  return (
    <div role="group" aria-label={t("language")} className={`meta flex items-center gap-1 ${className}`}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-text-2">/</span>}
          {locale === current ? (
            <span aria-current="true" className="px-1 py-2 text-text">
              {locale.toUpperCase()}
            </span>
          ) : (
            <a
              href={`/${locale}`}
              hrefLang={locale}
              lang={locale}
              title={t("switchTo")}
              onClick={(e) => onClick(e, locale)}
              className="rounded-full px-1 py-2 text-text-2 transition-colors hover:text-text"
            >
              {locale.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
