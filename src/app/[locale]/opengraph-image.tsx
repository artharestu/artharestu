import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Artha Restu";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Unbounded.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist.ttf")),
]);

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const [unbounded, geist] = await fonts;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0B0F",
          color: "#F2F0EA",
          position: "relative",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -220,
            top: -260,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(200,255,61,0.28) 0%, rgba(200,255,61,0) 68%)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, color: "#8A8A93" }}>
          <span>{t("label").toUpperCase()}</span>
          <span style={{ color: "#C8FF3D" }}>ARTHARESTU.COM</span>
        </div>
        <div style={{ display: "flex", fontFamily: "Unbounded", fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1000 }}>
          {t("title")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#8A8A93" }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#C8FF3D" }} />
          <span>Artha Restu · {tm("ogTagline")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: unbounded, weight: 600, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
      ],
    },
  );
}
