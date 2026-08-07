import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Laguna Dubai — الكافيه والتقييمات",
  description:
    "كافيه Laguna Dubai على شاطئ دبي. شوف تقييمات الزوار وشارك تجربتك.",
};

function SiteHeader() {
  return (
    <header className="border-b border-sand-200 bg-sand-50/90 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-laguna-deep"
        >
          Laguna&nbsp;Dubai
        </Link>
        <div className="flex items-center gap-1 rounded-full bg-sand-100 p-1 text-sm">
          <Link
            href="/"
            className="rounded-full px-4 py-1.5 font-medium text-ink-700 transition-colors hover:bg-white"
          >
            الرئيسية
          </Link>
          <Link
            href="/reviews"
            className="rounded-full px-4 py-1.5 font-medium text-ink-700 transition-colors hover:bg-white"
          >
            التقييمات
          </Link>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-sand-200 py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-ink-500 sm:px-6">
        Laguna Dubai — قهو وقيل شاطئ. رأيك بيفرّق.
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}