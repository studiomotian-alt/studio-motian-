"use client";

import Script from "next/script";

// NEXT_PUBLIC_GA_ID가 설정된 경우에만 GA4를 로드한다.
// 미설정 시 아무것도 렌더하지 않음 → 키 넣기 전엔 사이트 동작 변화 없음(비훼손).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
