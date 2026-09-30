import Link from "next/link";

// Fallback for paths the locale proxy doesn't handle; localized 404s live in app/[locale]/not-found.tsx.
export default function RootNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="font-display text-3xl">Page not found</h1>
        <Link className="link" href="/">
          Back to home
        </Link>
      </body>
    </html>
  );
}
