import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL, OWNER_NAME } from "@/lib/site";
import { Background } from "@/components/Background";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmoothScroll } from "@/components/SmoothScroll";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["600"], variable: "--font-unbounded", display: "swap" });
const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-geist-mono", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    authors: [{ name: OWNER_NAME, url: SITE_URL }],
    alternates: {
      canonical: `/${locale}`,
      languages: { id: "/id", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: OWNER_NAME,
      title: t("title"),
      description: t("description"),
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f3ee" },
  ],
};

// Marks JS as running so the hero can start hidden; reveals it after 1.2s if the animation never runs.
const bootScript = `document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('anim-done')},1200);`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      className={`dark ${unbounded.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="btn btn-primary fixed left-4 top-4 z-[100] -translate-y-24 focus-visible:translate-y-0"
            >
              {t("skip")}
            </a>
            <Background />
            <Navbar />
            <main id="main" className="relative">
              {children}
            </main>
            <Footer />
            <SmoothScroll />
            <ScrollReveal />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
