import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { Cursor } from "@/components/cursor";
import { Intro } from "@/components/intro";
import { AnalyticsBeacon } from "@/components/analytics-beacon";

// Runs before first paint: shows the intro splash once per session (and never
// for "reduce motion" users), adding a flash-free white cover via .mt-intro-on.
const INTRO_BOOT = `(function(){try{var d=document.documentElement;if(!sessionStorage.getItem('mt_intro')&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){d.classList.add('mt-intro-on','mt-intro-lock');}}catch(e){}})();`;

const bastardus = localFont({
  src: "./fonts/BastardusSans.ttf",
  variable: "--font-bastardus",
  display: "swap",
});

// Korean glyphs fall back to MinSans (Latin uses BastardusSans, which has no Hangul).
const minSans = localFont({
  src: "./fonts/MinSans-ExtraLight.otf",
  variable: "--font-minsans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiomotian.com"),
  title: {
    default: "Studio Motian — From a mote of language, to the structure of intent.",
    template: "%s · Studio Motian",
  },
  description:
    "Studio Motian은 브랜드의 방향과 언어, 시각 시스템을 설계하는 디자인 스튜디오입니다.",
  openGraph: {
    title: "Studio Motian",
    description:
      "From a mote of language, to the structure of intent. — Studio Motian은 브랜드의 방향과 언어, 시각 시스템을 설계합니다.",
    url: "https://studiomotian.com",
    siteName: "Studio Motian",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Motian",
    description: "From a mote of language, to the structure of intent.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${bastardus.variable} ${minSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <SiteNav />
        <main>{children}</main>
        <div id="mt-intro-cover" aria-hidden />
        <Intro />
        <Cursor />
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
