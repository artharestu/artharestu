import {
  Bell,
  CalendarCheck,
  ChartLine,
  Clapperboard,
  Film,
  HeartPulse,
  Languages,
  LocateFixed,
  MapIcon,
  MapPin,
  Megaphone,
  RectangleHorizontal,
  RectangleVertical,
  ScanFace,
  Search,
  SquareUserRound,
  WifiOff,
} from "lucide-react";

/** Lucide icons for descriptive project tags: src/data/tags.ts names them, TagChip draws them. */
export const TAG_ICONS = {
  Bell,
  CalendarCheck,
  ChartLine,
  Clapperboard,
  Film,
  HeartPulse,
  Languages,
  LocateFixed,
  Map: MapIcon,
  MapPin,
  Megaphone,
  RectangleHorizontal,
  RectangleVertical,
  ScanFace,
  Search,
  SquareUserRound,
  WifiOff,
};

export type TagIcon = keyof typeof TAG_ICONS;
