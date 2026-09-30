import type { ReactNode } from "react";
import "./globals.css";

// The <html> shell lives in app/[locale]/layout.tsx so `lang` matches the locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
