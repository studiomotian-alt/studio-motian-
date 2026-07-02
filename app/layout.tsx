import type { Metadata } from "next";
import localFont from "next/font/local";
// Pretendard 폰트 자체호스팅 (jsDelivr CDN 의존 제거 — 빌드 시 우리 origin으로 번들)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { Cursor } from "@/components/cursor";
import { Intro } from "@/components/intro";
import { Analytics } from "@/components/analytics";
import { CONTACT } from "@/lib/contact";

// 검색엔진용 구조화 데이터(JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Studio Motian",
  description:
    "Studio Motian은 브랜드의 방향과 언어, 시각 시스템을 설계하는 디자인 스튜디오입니다.",
  url: "https://studiomotian.com",
  email: CONTACT.email,
  logo: "https://studiomotian.com/logo.png",
  sameAs: [CONTACT.instagramUrl, CONTACT.kakaoUrl, CONTACT.behanceUrl],
};

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
  // 검색엔진 소유확인 — 환경변수가 있을 때만 메타가 출력됨(미설정 시 기존과 동일).
  // 구글 서치콘솔/네이버 서치어드바이저 등록 후 발급 코드를 env에 넣으면 활성화.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
      : undefined,
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
        <script
          type="application/ld+json"
          // 정적 데이터지만 `</script>` 브레이크아웃 방지를 위해 '<'를 이스케이프
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <SiteNav />
        <main>{children}</main>
        <div id="mt-intro-cover" aria-hidden />
        <Intro />
        <Cursor />
        <Analytics />
      </body>
    </html>
  );
}
