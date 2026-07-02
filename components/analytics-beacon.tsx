"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 자체 방문 통계 비콘.
// NEXT_PUBLIC_ANALYTICS_ENDPOINT가 설정된 경우에만 동작한다.
// 미설정 시 아무것도 전송·렌더하지 않음 → 키 넣기 전엔 현재 라이브 영향 0(비훼손).
const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
const SITE = "motian";

// 세션 식별자: sessionStorage에 탭 세션 단위로 저장(개인정보 아님, 쿠키 미사용).
function getSessionId(): string | undefined {
  try {
    let sid = sessionStorage.getItem("sa_sid");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("sa_sid", sid);
    }
    return sid;
  } catch {
    // 프라이빗 모드 등에서 storage 접근이 막혀도 전송 자체는 계속한다.
    return undefined;
  }
}

export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ENDPOINT || !pathname) return;
    try {
      const payload = JSON.stringify({
        site: SITE,
        path: pathname,
        referrer: document.referrer,
        sessionId: getSessionId(),
      });
      // sendBeacon(문자열 body → text/plain) 우선, 실패 시 fetch keepalive 폴백.
      let sent = false;
      if (typeof navigator.sendBeacon === "function") {
        sent = navigator.sendBeacon(ENDPOINT, payload);
      }
      if (!sent) {
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // 어떤 오류도 페이지 동작에 영향을 주지 않는다.
    }
  }, [pathname]);

  // 항상 아무것도 렌더하지 않음(엔드포인트 미설정 시 전송도 없음).
  return null;
}
