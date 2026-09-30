"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useMounted } from "@/lib/useMounted";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isLight = mounted && resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? t("themeToDark") : t("themeToLight")}
      className={`btn btn-icon relative overflow-hidden ${className}`}
    >
      {/* Both icons are stacked; the .dark class decides which one is shown, so there's no flash. */}
      <Sun
        aria-hidden
        strokeWidth={1.5}
        className="absolute size-[18px] rotate-90 scale-50 opacity-0 transition-[transform,opacity] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
      <Moon
        aria-hidden
        strokeWidth={1.5}
        className="absolute size-[18px] rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none dark:-rotate-90 dark:scale-50 dark:opacity-0"
      />
    </button>
  );
}
