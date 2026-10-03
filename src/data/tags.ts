import type { TagIcon } from "@/lib/tag-icons";
import { logoFor, tagKey, type TagLogo } from "./tech";

type Localized = { id: string; en: string };

/** A project tag as the cards and the modal render it, labelled in both languages. */
export type ProjectTag = { label: Localized; logo?: TagLogo; icon?: TagIcon };

/**
 * Descriptive tags: a Lucide icon (see src/lib/tag-icons.ts) and a label per language. A tag in
 * projects.ts matches either label or an alias and is shown in the visitor's language.
 * Technologies get their logo from tech.ts instead. A tag with neither stays out of the cards
 * and only shows in the modal.
 */
const TOPICS: { label: Localized; icon: TagIcon; aliases?: string[] }[] = [
  // Website
  { label: { id: "SEO", en: "SEO" }, icon: "Search" },
  { label: { id: "SEO lokal", en: "Local SEO" }, icon: "MapPin" },
  { label: { id: "i18n", en: "i18n" }, icon: "Languages" },
  { label: { id: "Reservasi", en: "Booking" }, icon: "CalendarCheck" },
  { label: { id: "Grafik", en: "Charts" }, icon: "ChartLine" },
  // Mobile
  { label: { id: "Offline-first", en: "Offline-first" }, icon: "WifiOff" },
  { label: { id: "Notifikasi", en: "Notifications" }, icon: "Bell", aliases: ["Notification"] },
  { label: { id: "Kesehatan", en: "Health" }, icon: "HeartPulse" },
  { label: { id: "GPS", en: "GPS" }, icon: "LocateFixed" },
  { label: { id: "Peta offline", en: "Offline maps" }, icon: "Map" },
  // Video
  { label: { id: "9:16", en: "9:16" }, icon: "RectangleVertical" },
  { label: { id: "16:9", en: "16:9" }, icon: "RectangleHorizontal" },
  { label: { id: "Iklan produk", en: "Product ad" }, icon: "Megaphone" },
  { label: { id: "Brand film", en: "Brand film" }, icon: "Film" },
  { label: { id: "Sinematik", en: "Cinematic" }, icon: "Clapperboard" },
  { label: { id: "UGC", en: "UGC" }, icon: "SquareUserRound" },
  { label: { id: "Virtual influencer", en: "Virtual influencer" }, icon: "ScanFace" },
];

const byKey = new Map<string, (typeof TOPICS)[number]>();
for (const topic of TOPICS) {
  for (const name of [topic.label.id, topic.label.en, ...(topic.aliases ?? [])]) {
    const other = byKey.get(tagKey(name));
    if (other && other !== topic) throw new Error(`src/data/tags.ts: "${name}" is listed twice`);
    byKey.set(tagKey(name), topic);
  }
}

export function toTag(name: string): ProjectTag {
  const logo = logoFor(name);
  if (logo) return { label: { id: name, en: name }, logo };
  const topic = byKey.get(tagKey(name));
  if (topic) return { label: topic.label, icon: topic.icon };
  return { label: { id: name, en: name } };
}
