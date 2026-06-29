// 기본 보안 헤더 (렌더링에 영향 없는 안전한 항목만).
// 주의: Content-Security-Policy(CSP)는 인라인 스타일/스크립트(INTRO_BOOT)·외부 폰트와
//       충돌할 수 있어 Preview에서 충분히 검증한 뒤 별도로 추가한다. 여기서는 제외.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
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
