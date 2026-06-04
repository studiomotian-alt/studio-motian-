import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const bastardus = localFont({
  src: "./fonts/BastardusSans.ttf",
  variable: "--font-bastardus",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studio-motian.com"),
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
    url: "https://studio-motian.com",
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
    <html lang="ko" className={bastardus.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
