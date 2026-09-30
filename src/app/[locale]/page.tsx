import { getTranslations, setRequestLocale } from "next-intl/server";
import { projects } from "@/data/projects";
import { OWNER_NAME, SITE_URL } from "@/lib/site";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/portfolio/Portfolio";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const tm = await getTranslations("meta");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: OWNER_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/images/artha-restu.webp`,
    jobTitle: "Freelance Web, Mobile & AI Video Developer",
    description: tm("description"),
    address: { "@type": "PostalAddress", addressLocality: "Yogyakarta", addressCountry: "ID" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Services />
      <section id="portfolio" aria-labelledby="portfolio-title" className="section-y scroll-mt-20">
        <div className="container-x">
          <SectionHeading index={2} label={t("label")} title={t("title")} id="portfolio-title" />
          <Portfolio projects={projects} />
        </div>
      </section>
      <About />
      <Contact />
    </>
  );
}
