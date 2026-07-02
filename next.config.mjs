// CSP — 우선 "Report-Only"로 적용한다. 이 모드는 리소스를 절대 차단하지 않고
// 위반만 브라우저 콘솔에 보고하므로 라이브를 깨뜨리지 않는다(비훼손).
// Preview에서 콘솔 위반이 없음을 확인한 뒤, 헤더 키를 "Content-Security-Policy"로
// 바꿔 실제 차단(enforce)으로 전환한다.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  // 인라인 스크립트(INTRO_BOOT)·GA·Turnstile 허용. 추후 nonce 전환 검토.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  // 이미지: unsplash/behance(remotePatterns) 포함
  "img-src 'self' data: blob: https://images.unsplash.com https://mir-s3-cdn-cf.behance.net https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  // Turnstile 위젯 iframe
  "frame-src https://challenges.cloudflare.com",
  "media-src 'self'",
  "form-action 'self'",
].join("; ");

// 기본 보안 헤더.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "mir-s3-cdn-cf.behance.net" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
